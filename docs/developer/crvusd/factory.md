# MarketFactory

The crvUSD MarketFactory enables the **creation of new markets**and adjustments, including **setting a new fee receiver**, **modifying the debt ceiling**of an existing market, or **updating blueprint implementations**.

Other than the pool factory, this factory **does not allow permissionless deployment of new markets**. Only its **`admin`**, the CurveOwnershipAgent, can call to add a market. Therefore, adding a new market requires a successfully passed DAO vote.

:::vyper[`ControllerFactory.vy`]

The source code for the `ControllerFactory.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-stablecoin/blob/master/contracts/ControllerFactory.vy).

The contract is deployed on :logos-ethereum: Ethereum at [`0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC`](https://etherscan.io/address/0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC#code).

:::


---


## Adding Markets

A new crvUSD market can be added by the CurveOwnershipAgent. Therefore, adding a new market requires a successfully passed DAO vote.


### `add_market`
::::description[`ControllerFactory.add_market(token: address, A: uint256, fee: uint256, admin_fee: uint256, _price_oracle_contract: address, monetary_policy: address, loan_discount: uint256, liquidation_discount: uint256, debt_ceiling: uint256) -> address[2]`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to add a new market and automatically deploy a new AMM and a Controller from the implementation contracts (see [Implementations](#implementations)). Additionally, when initializing a new market, **`rate_write()`**from the MonetaryPolicy contract is called to check if it has a correct ABI.

| Input                    | Type      | Description                                                  |
| ------------------------ | --------- | ------------------------------------------------------------ |
| `token`                  | `address` | Collateral token address                                     |
| `A`                      | `uint256` | Amplification coefficient. One band size is 1/n              |
| `fee`                    | `uint256` | AMM fee in the market's AMM                                  |
| `admin_fee`              | `uint256` | AMM admin fee                                                |
| `_price_oracle_contract` | `address` | Address of the price oracle contract for the market          |
| `monetary_policy`        | `address` | Monetary policy for the market                               |
| `loan_discount`          | `uint256` | Loan Discount: allowed to borrow only up to x_down * (1 - loan_discount) |
| `liquidation_discount`   | `uint256` | Discount defining a bad liquidation threshold                |
| `debt_ceiling`           | `uint256` | Debt ceiling for the market                                  |


:::warning

There are some limitation values for adding new markets regarding `fee`, `A` and `liquidation_discount`.


:::

Returns: AMM and Controller contracts (`address`).

Emits: `AddNewMarket`

<SourceCode>


```vyper
# Limits


MIN_A: constant(uint256) = 2
MAX_A: constant(uint256) = 10000
MIN_FEE: constant(uint256) = 10**6  # 1e-12, still needs to be above 0
MAX_FEE: constant(uint256) = 10**17  # 10%
MAX_ADMIN_FEE: constant(uint256) = 10**18  # 100%
MAX_LOAN_DISCOUNT: constant(uint256) = 5 * 10**17
MIN_LIQUIDATION_DISCOUNT: constant(uint256) = 10**16

@external
@nonreentrant('lock')
def add_market(token: address, A: uint256, fee: uint256, admin_fee: uint256,
            _price_oracle_contract: address,
            monetary_policy: address, loan_discount: uint256, liquidation_discount: uint256,
            debt_ceiling: uint256) -> address[2]:
    """
    @notice Add a new market, creating an AMM and a Controller from a blueprint
    @param token Collateral token address
    @param A Amplification coefficient; one band size is 1/A
    @param fee AMM fee in the market's AMM
    @param admin_fee AMM admin fee
    @param _price_oracle_contract Address of price oracle contract for this market
    @param monetary_policy Monetary policy for this market
    @param loan_discount Loan discount: allowed to borrow only up to x_down * (1 - loan_discount)
    @param liquidation_discount Discount which defines a bad liquidation threshold
    @param debt_ceiling Debt ceiling for this market
    @return (Controller, AMM)
    """
    assert msg.sender == self.admin, "Only admin"
    assert A >= MIN_A and A <= MAX_A, "Wrong A"
    assert fee <= MAX_FEE, "Fee too high"
    assert fee >= MIN_FEE, "Fee too low"
    assert admin_fee < MAX_ADMIN_FEE, "Admin fee too high"
    assert liquidation_discount >= MIN_LIQUIDATION_DISCOUNT, "Liquidation discount too low"
    assert loan_discount <= MAX_LOAN_DISCOUNT, "Loan discount too high"
    assert loan_discount > liquidation_discount, "need loan_discount>liquidation_discount"
    MonetaryPolicy(monetary_policy).rate_write()  # Test that MonetaryPolicy has correct ABI

    p: uint256 = PriceOracle(_price_oracle_contract).price()  # This also validates price oracle ABI
    assert p > 0
    assert PriceOracle(_price_oracle_contract).price_w() == p
    A_ratio: uint256 = 10**18 * A / (A - 1)

    amm: address = create_from_blueprint(
        self.amm_implementation,
        STABLECOIN.address, 10**(18 - STABLECOIN.decimals()),
        token, 10**(18 - ERC20(token).decimals()),  # <- This validates ERC20 ABI
        A, isqrt(A_ratio * 10**18), self.ln_int(A_ratio),
        p, fee, admin_fee, _price_oracle_contract,
        code_offset=3)
    controller: address = create_from_blueprint(
        self.controller_implementation,
        token, monetary_policy, loan_discount, liquidation_discount, amm,
        code_offset=3)
    AMM(amm).set_admin(controller)
    self._set_debt_ceiling(controller, debt_ceiling, True)

    N: uint256 = self.n_collaterals
    self.collaterals[N] = token
    for i in range(1000):
        if self.collaterals_index[token][i] == 0:
            self.collaterals_index[token][i] = 2**128 + N
            break
        assert i != 999, "Too many controllers for same collateral"
    self.controllers[N] = controller
    self.amms[N] = amm
    self.n_collaterals = N + 1

    log AddMarket(token, controller, amm, monetary_policy, N)
    return [controller, amm]
```


```vyper
@internal
@view
def calculate_rate() -> uint256:
    sigma: int256 = self.sigma
    target_debt_fraction: uint256 = self.target_debt_fraction

    p: int256 = convert(PRICE_ORACLE.price(), int256)
    pk_debt: uint256 = 0
    for pk in self.peg_keepers:
        if pk.address == empty(address):
            break
        pk_debt += pk.debt()

    power: int256 = (10**18 - p) * 10**18 / sigma  # high price -> negative pow -> low rate
    if pk_debt > 0:
        total_debt: uint256 = CONTROLLER_FACTORY.total_debt()
        if total_debt == 0:
            return 0
        else:
            power -= convert(pk_debt * 10**18 / total_debt * 10**18 / target_debt_fraction, int256)

    return self.rate0 * min(self.exp(power), MAX_EXP) / 10**18

@external
def rate_write() -> uint256:
    # Not needed here but useful for more automated policies
    # which change rate0 - for example rate0 targeting some fraction pl_debt/total_debt
    return self.calculate_rate()
```


```vyper
@external
@view
def price() -> uint256:
    n: uint256 = self.n_price_pairs
    prices: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    D: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    Dsum: uint256 = 0
    DPsum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        price_pair: PricePair = self.price_pairs[i]
        pool_supply: uint256 = price_pair.pool.totalSupply()
        if pool_supply >= MIN_LIQUIDITY:
            p: uint256 = price_pair.pool.price_oracle()
            if price_pair.is_inverse:
                p = 10**36 / p
            prices[i] = p
            _D: uint256 = price_pair.pool.get_virtual_price() * pool_supply / 10**18
            D[i] = _D
            Dsum += _D
            DPsum += _D * p
    if Dsum == 0:
        return 10**18  # Placeholder for no active pools
    p_avg: uint256 = DPsum / Dsum
    e: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    e_min: uint256 = max_value(uint256)
    for i in range(MAX_PAIRS):
        if i == n:
            break
        p: uint256 = prices[i]
        e[i] = (max(p, p_avg) - min(p, p_avg))**2 / (SIGMA**2 / 10**18)
        e_min = min(e[i], e_min)
    wp_sum: uint256 = 0
    w_sum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        w: uint256 = D[i] * self.exp(-convert(e[i] - e_min, int256)) / 10**18
        w_sum += w
        wp_sum += w * prices[i]
    return wp_sum / w_sum
```


```vyper
@external
def set_admin(_admin: address):
    """
    @notice Set admin of the AMM. Typically it's a controller (unless it's tests)
    @param _admin Admin address
    """
    assert self.admin == empty(address)
    self.admin = _admin
    self.approve_max(BORROWED_TOKEN, _admin)
    self.approve_max(COLLATERAL_TOKEN, _admin)
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.add_market("0xae78736cd615f374d3085123a210448e74fc6393",
                                100,
                                6000000000000000,
                                0,
                                "price oracle contract",
                                "monetary policy contract",
                                90000000000000000,
                                60000000000000000,
                                10000000000000000000000000):

"returns AMM and Controller contract"
```


</Example>


::::


---


## Debt Ceilings

### `debt_ceiling`
::::description[`ControllerFactory.debt_ceiling(arg0: address) -> uint256: view`]


Getter for the current debt ceiling of a market.

Returns: debt ceiling (`uint256`).

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `address` | Address of the controller |

<SourceCode>


```vyper
debt_ceiling: public(HashMap[address, uint256])
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.debt_ceiling("0x8472A9A7632b173c8Cf3a86D3afec50c35548e76")
10000000000000000000000000
```


</Example>


::::

### `debt_ceiling_residual`
::::description[`ControllerFactory.debt_ceiling_residual(arg0: address) -> uint256: view`]


Getter for the residual debt ceiling for a market.

Returns: debt ceiling residual (`uint256`).

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `address` | Address of the controller |

<SourceCode>


```vyper
debt_ceiling: public(HashMap[address, uint256])
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.debt_ceiling("0x8472A9A7632b173c8Cf3a86D3afec50c35548e76")
10000000000000000000000000
```


</Example>


::::

### `rug_debt_ceiling`
::::description[`ControllerFactory.rug_debt_ceiling(_to: address)`]


Function to remove stablecoins above the debt seiling from a controller and burn them. This function is used to burn residual crvUSD when the debt ceiling was lowered.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `_to` |  `address` | Address of the controller to remove stablecoins from |

<SourceCode>


```vyper
@external
@nonreentrant('lock')
def rug_debt_ceiling(_to: address):
    """
    @notice Remove stablecoins above the debt ceiling from the address and burn them
    @param _to Address to remove stablecoins from
    """
    self._set_debt_ceiling(_to, self.debt_ceiling[_to], False)

@internal
def _set_debt_ceiling(addr: address, debt_ceiling: uint256, update: bool):
    """
    @notice Set debt ceiling for a market
    @param addr Controller address
    @param debt_ceiling Value for stablecoin debt ceiling
    @param update Whether to actually update the debt ceiling (False is used for burning the residuals)
    """
    old_debt_residual: uint256 = self.debt_ceiling_residual[addr]

    if debt_ceiling > old_debt_residual:
        to_mint: uint256 = debt_ceiling - old_debt_residual
        STABLECOIN.mint(addr, to_mint)
        self.debt_ceiling_residual[addr] = debt_ceiling
        log MintForMarket(addr, to_mint)

    if debt_ceiling < old_debt_residual:
        diff: uint256 = min(old_debt_residual - debt_ceiling, STABLECOIN.balanceOf(addr))
        STABLECOIN.burnFrom(addr, diff)
        self.debt_ceiling_residual[addr] = old_debt_residual - diff
        log RemoveFromMarket(addr, diff)

    if update:
        self.debt_ceiling[addr] = debt_ceiling
        log SetDebtCeiling(addr, debt_ceiling)
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.rug_debt_ceiling("controller address")
```


</Example>


::::

### `set_debt_ceiling`
::::description[`ControllerFactory.set_debt_ceiling(_to: address, debt_ceiling: uint256)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set the debt ceiling of a market and mint the token amount given for it.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `_to` |  `address` | Address to set debt ceiling for |
| `debt_ceiling` |  `uint256` | Maximum to be allowed to mint |

Emits: `MintForMarket` or `RemoveFromMarket` or `SetDebtCeiling`

<SourceCode>


```vyper
event SetDebtCeiling:
    addr: indexed(address)
    debt_ceiling: uint256

event MintForMarket:
    addr: indexed(address)
    amount: uint256

event RemoveFromMarket:
    addr: indexed(address)
    amount: uint256

@internal
def _set_debt_ceiling(addr: address, debt_ceiling: uint256, update: bool):
    """
    @notice Set debt ceiling for a market
    @param addr Controller address
    @param debt_ceiling Value for stablecoin debt ceiling
    @param update Whether to actually update the debt ceiling (False is used for burning the residuals)
    """
    old_debt_residual: uint256 = self.debt_ceiling_residual[addr]

    if debt_ceiling > old_debt_residual:
        to_mint: uint256 = debt_ceiling - old_debt_residual
        STABLECOIN.mint(addr, to_mint)
        self.debt_ceiling_residual[addr] = debt_ceiling
        log MintForMarket(addr, to_mint)

    if debt_ceiling < old_debt_residual:
        diff: uint256 = min(old_debt_residual - debt_ceiling, STABLECOIN.balanceOf(addr))
        STABLECOIN.burnFrom(addr, diff)
        self.debt_ceiling_residual[addr] = old_debt_residual - diff
        log RemoveFromMarket(addr, diff)

    if update:
        self.debt_ceiling[addr] = debt_ceiling
        log SetDebtCeiling(addr, debt_ceiling)

@external
@nonreentrant('lock')
def set_debt_ceiling(_to: address, debt_ceiling: uint256):
    """
    @notice Set debt ceiling of the address - mint the token amount given for it
    @param _to Address to allow borrowing for
    @param debt_ceiling Maximum allowed to be allowed to mint for it
    """
    assert msg.sender == self.admin
    self._set_debt_ceiling(_to, debt_ceiling, True)
```


```vyper
@external
def mint(_to: address, _value: uint256) -> bool:
    """
    @notice Mint `_value` amount of tokens to `_to`.
    @dev Only callable by an account with minter privileges.
    @param _to The account newly minted tokens are credited to.
    @param _value The amount of tokens to mint.
    """
    assert msg.sender == self.minter
    assert _to not in [self, empty(address)]

    self.balanceOf[_to] += _value
    self.totalSupply += _value

    log Transfer(empty(address), _to, _value)
    return True

@external
def burn(_value: uint256) -> bool:
    """
    @notice Burn `_value` amount of tokens.
    @param _value The amount of tokens to burn.
    """
    self._burn(msg.sender, _value)
    return True
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.set_debt_ceiling(20000000000000000000000000)
```


</Example>


::::


---


## Fee Receiver

The fee receiver is the address that receives the claimed fees when calling `collect_fees()` on the Controller.
A new receiver can be set by the `admin` of the contract, which is the CurveOwnershipAgent.

### `fee_receiver`
::::description[`ControllerFactory.fee_receiver() -> address: view`]


Getter for the fee receiver address.

Returns: `address` of fee receiver.

<SourceCode>


```vyper
fee_receiver: public(address)

@external
def __init__(stablecoin: ERC20,
            admin: address,
            fee_receiver: address,
            weth: address):
    """
    @notice Factory which creates both controllers and AMMs from blueprints
    @param stablecoin Stablecoin address
    @param admin Admin of the factory (ideally DAO)
    @param fee_receiver Receiver of interest and admin fees
    @param weth Address of WETH contract address
    """
    STABLECOIN = stablecoin
    self.admin = admin
    self.fee_receiver = fee_receiver
    WETH = weth
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.fee_receiver()
'0xeCb456EA5365865EbAb8a2661B0c503410e9B347'
```


</Example>


::::

### `set_fee_receiver`
::::description[`ControllerFactory.set_fee_receiver(fee_receiver: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set the fee receiver address.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `fee_receiver` |  `address` | Address of the receiver |

Emits: `SetFeeReceiver`

<SourceCode>


```vyper
event SetFeeReceiver:
    fee_receiver: address

fee_receiver: public(address)

@external
@nonreentrant('lock')
def set_fee_receiver(fee_receiver: address):
    """
    @notice Set fee receiver who earns interest (DAO)
    @param fee_receiver Address of the receiver
    """
    assert msg.sender == self.admin
    assert fee_receiver != empty(address)
    self.fee_receiver = fee_receiver
    log SetFeeReceiver(fee_receiver)
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.set_fee_receiver("0xeCb456EA5365865EbAb8a2661B0c503410e9B347")
```


</Example>


::::

### `collect_fees_above_ceiling`
::::description[`ControllerFactory.collect_fees_above_ceiling(_to: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to claim fees above the debt ceiling. This function will automatically increase the debt ceiling if there is not enough to claim admin fees.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `_to` |  `address` | Address of the controller |

<SourceCode>


```vyper
@external
@nonreentrant('lock')
def collect_fees_above_ceiling(_to: address):
    """
    @notice If the receiver is the controller - increase the debt ceiling if it's not enough to claim admin fees
            and claim them
    @param _to Address of the controller
    """
    assert msg.sender == self.admin
    old_debt_residual: uint256 = self.debt_ceiling_residual[_to]
    assert self.debt_ceiling[_to] > 0 or old_debt_residual > 0

    admin_fees: uint256 = Controller(_to).total_debt() + Controller(_to).redeemed() - Controller(_to).minted()
    b: uint256 = STABLECOIN.balanceOf(_to)
    if admin_fees > b:
        to_mint: uint256 = admin_fees - b
        STABLECOIN.mint(_to, to_mint)
        self.debt_ceiling_residual[_to] = old_debt_residual + to_mint
    Controller(_to).collect_fees()
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.collect_fees_above_ceiling("0x100dAa78fC509Db39Ef7D04DE0c1ABD299f4C6CE")
```


</Example>


::::


---


## Implementations

Implementations are blueprint contracts used to deploy new markets. When calling `add_market`, Controller and AMM are created from the current implementations.


### `controller_implementation`
::::description[`ControllerFactory.controller_implementation() -> address: view`]


Getter for controller implementation address.

Returns: implementation (`address`).

<SourceCode>


```vyper
collaterals: public(address[MAX_CONTROLLERS])
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.controller_implementation()
'0x6340678b2bab22a37d781Cd8da958a3cD1d97cdD'
```


</Example>


::::

### `amm_implementation`
::::description[`ControllerFactory.amm_implementation() -> address: view`]


Getter for amm implementation address.

Returns: implementation (`address`).

<SourceCode>


```vyper
amm_implementation: public(address)
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.amm_implementation()
'0x3da7fF6C15C0c97D9C2dF4AF82a9910384b372FD'
```


</Example>


::::

### `set_implementations`
::::description[`ControllerFactory.set_implementations(controller: address, amm: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set new implementations (blueprints) for Controller and AMM. Setting new implementations for Controller and AMM does not affect the existing ones.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `controller` |  `address` | Address of the controller blueprint |
| `amm` |  `address` | Address of the amm blueprint |

Emits: `SetImplementations`

<SourceCode>


```vyper
event SetImplementations:
    amm: address
    controller: address

controller_implementation: public(address)
amm_implementation: public(address)

@external
@nonreentrant('lock')
def set_implementations(controller: address, amm: address):
    """
    @notice Set new implementations (blueprints) for controller and amm. Doesn't change existing ones
    @param controller Address of the controller blueprint
    @param amm Address of the AMM blueprint
    """
    assert msg.sender == self.admin
    assert controller != empty(address)
    assert amm != empty(address)
    self.controller_implementation = controller
    self.amm_implementation = amm
    log SetImplementations(amm, controller)
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.set_implementations("new controller implementation", "new amm implementation")
```


</Example>


::::


---


## Contract Info Methods

### `stablecoin`
::::description[`ControllerFactory.stablecoin() -> address: view`]


Getter for the stablecoin address.

Returns: stablecoin (`address`).

<SourceCode>


```vyper
STABLECOIN: immutable(ERC20)

@external
def __init__(stablecoin: ERC20,
            admin: address,
            fee_receiver: address,
            weth: address):
    """
    @notice Factory which creates both controllers and AMMs from blueprints
    @param stablecoin Stablecoin address
    @param admin Admin of the factory (ideally DAO)
    @param fee_receiver Receiver of interest and admin fees
    @param weth Address of WETH contract address
    """
    STABLECOIN = stablecoin
    self.admin = admin
    self.fee_receiver = fee_receiver
    WETH = weth
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.stablecoin()
'0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E'
```


</Example>


::::

### `total_debt`
::::description[`ControllerFactory.total_debt() -> uint256: view`]


Getter for the sum of all debts across the controllers.

Returns: total amount of debt (`uint256`).

<SourceCode>


```vyper
@external
@view
def total_debt() -> uint256:
    """
    @notice Sum of all debts across controllers
    """
    total: uint256 = 0
    n_collaterals: uint256 = self.n_collaterals
    for i in range(MAX_CONTROLLERS):
        if i == n_collaterals:
            break
        total += Controller(self.controllers[i]).total_debt()
    return total
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.total_debt()
37565735180665889485176526
```


</Example>


::::

### `get_controller`
::::description[`ControllerFactory.get_controller(collateral: address, i: uint256 = 0) -> address: view`]


Getter for the controller address for `collateral`.

Returns: controller `address`.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `collateral` |  `address` | Address of collateral token |
| `i` |  `uint256` | Index to iterate over several controller for the same collateral if needed |

<SourceCode>


```vyper
@external
@view
def get_controller(collateral: address, i: uint256 = 0) -> address:
    """
    @notice Get controller address for collateral
    @param collateral Address of collateral token
    @param i Iterate over several controllers for collateral if needed
    """
    return self.controllers[self.collaterals_index[collateral][i] - 2**128]
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.get_controller("0xac3E018457B222d93114458476f3E3416Abbe38F", 0)
'0x8472A9A7632b173c8Cf3a86D3afec50c35548e76'
```


</Example>


::::

### `get_amm`
::::description[`ControllerFactory.get_amm(collateral: address, i: uint256 = 0) -> address: view`]


Getter for the amm address for `collateral`.

Returns: amm `address`.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `collateral` |  `address` | Address of collateral token |
| `i` |  `uint256` | Index to iterate over several amms for the same collateral if needed |

<SourceCode>


```vyper
@external
@view
def get_amm(collateral: address, i: uint256 = 0) -> address:
    """
    @notice Get AMM address for collateral
    @param collateral Address of collateral token
    @param i Iterate over several AMMs for collateral if needed
    """
    return self.amms[self.collaterals_index[collateral][i] - 2**128]
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.get_amm("0xac3E018457B222d93114458476f3E3416Abbe38F", 0)
'0x136e783846ef68C8Bd00a3369F787dF8d683a696'
```


</Example>


::::

### `controllers`
::::description[`ControllerFactory.controllers(arg0: uint256) -> address: view`]


Getter for the controller address at index `arg0`.

Returns: controller `address` at specific index.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `uint256` | Index |

<SourceCode>


```vyper
MAX_CONTROLLERS: constant(uint256) = 50000
controllers: public(address[MAX_CONTROLLERS])
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.controllers(0)
'0x8472A9A7632b173c8Cf3a86D3afec50c35548e76'
```


</Example>


::::

### `amms`
::::description[`ControllerFactory.amms(arg0: uint256) -> address: view`]


Getter for the amm address at index `arg0`.

Returns: AMM `address` at specific index.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `uint256` | Index |

<SourceCode>


```vyper
amms: public(address[MAX_CONTROLLERS])
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.amms(0)
'0x136e783846ef68C8Bd00a3369F787dF8d683a696'
```


</Example>


::::

### `n_collaterals`
::::description[`ControllerFactory.n_collaterals() -> uint256: view`]


Getter for the number of collaterals.

Returns: number of collaterals (`uint256`).

<SourceCode>


```vyper
n_collaterals: public(uint256)
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.n_collaterals()
2
```


</Example>


::::

### `collaterals`
::::description[`ControllerFactory.collaterals(arg0: uint256) -> address: view`]


Getter for the collateral addresses at index `arg0`.

Returns: `address` of collateral.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `uint256` | Index |

<SourceCode>


```vyper
collaterals: public(address[MAX_CONTROLLERS])
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.collaterals(0)
'0xac3E018457B222d93114458476f3E3416Abbe38F'
```


</Example>


::::

### `collaterals_index`
::::description[`ControllerFactory.collaterals_index(arg0: address, arg1: uint256) -> uint256: view`]


Getter for the index of a controller for `arg0`.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `address` | Address of collateral |
| `arg1` |  `uint256` | Index |

Returns: index (`uint256`).

:::note

The returned value is $2^{128}$ + index.


:::

<SourceCode>


```vyper
collaterals_index: public(HashMap[address, uint256[1000]])
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.collaterals_index(0xac3E018457B222d93114458476f3E3416Abbe38F, 0)
340282366920938463463374607431768211456
```


</Example>


::::

### `WETH`
::::description[`ControllerFactory.WETH() -> address: view`]


Getter for WETH address.

Returns: `address` of WETH.

<SourceCode>


```vyper
WETH: public(immutable(address))

@external
def __init__(stablecoin: ERC20,
            admin: address,
            fee_receiver: address,
            weth: address):
    """
    @notice Factory which creates both controllers and AMMs from blueprints
    @param stablecoin Stablecoin address
    @param admin Admin of the factory (ideally DAO)
    @param fee_receiver Receiver of interest and admin fees
    @param weth Address of WETH contract address
    """
    STABLECOIN = stablecoin
    self.admin = admin
    self.fee_receiver = fee_receiver
    WETH = weth
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.WETH()
'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
```


</Example>


::::


---


## Admin Ownership

### `admin`
::::description[`ControllerFactory.admin() -> address: view`]


Getter for the admin of the contract.

Returns: admin (`address`).

<SourceCode>


```vyper
admin: public(address)

@external
def __init__(stablecoin: ERC20,
            admin: address,
            fee_receiver: address,
            weth: address):
    """
    @notice Factory which creates both controllers and AMMs from blueprints
    @param stablecoin Stablecoin address
    @param admin Admin of the factory (ideally DAO)
    @param fee_receiver Receiver of interest and admin fees
    @param weth Address of WETH contract address
    """
    STABLECOIN = stablecoin
    self.admin = admin
    self.fee_receiver = fee_receiver
    WETH = weth
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.admin()
'0x40907540d8a6C65c637785e8f8B742ae6b0b9968'
```


</Example>


::::

### `set_admin`
::::description[`ControllerFactory.set_admin(admin: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set the admin of the contract.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `admin` |  `address` | New admin |

Emits: `SetAdmin`

<SourceCode>


```vyper
event SetAdmin:
    admin: address

admin: public(address)

@external
@nonreentrant('lock')
def set_admin(admin: address):
    """
    @notice Set admin of the factory (should end up with DAO)
    @param admin Address of the admin
    """
    assert msg.sender == self.admin
    self.admin = admin
    log SetAdmin(admin)
```


</SourceCode>

<Example>

```shell
>>> ControllerFactory.set_admin("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
```


</Example>


::::
