# Curve DAO Token (CRV)


The Curve DAO Token (CRV) is the protocol's governance token. It is based on the ERC-20 token standard as defined at [EIP-20](https://eips.ethereum.org/EIPS/eip-20).

:::vyper[`CRV.vy`]

The source code for the `CRV.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-dao-contracts/blob/567927551903f71ce5a73049e077be87111963cc/contracts/ERC20CRV.vy). The contract is written using [Vyper](https://vyper.readthedocs.io) version `0.2.4`.

The token is deployed on Ethereum at [`0xD533a949740bb3306d119CC777fa900bA034cd52`](https://etherscan.io/address/0xD533a949740bb3306d119CC777fa900bA034cd52).

<ContractABI>


```json
[{"name":"Transfer","inputs":[{"type":"address","name":"_from","indexed":true},{"type":"address","name":"_to","indexed":true},{"type":"uint256","name":"_value","indexed":false}],"anonymous":false,"type":"event"},{"name":"Approval","inputs":[{"type":"address","name":"_owner","indexed":true},{"type":"address","name":"_spender","indexed":true},{"type":"uint256","name":"_value","indexed":false}],"anonymous":false,"type":"event"},{"name":"UpdateMiningParameters","inputs":[{"type":"uint256","name":"time","indexed":false},{"type":"uint256","name":"rate","indexed":false},{"type":"uint256","name":"supply","indexed":false}],"anonymous":false,"type":"event"},{"name":"SetMinter","inputs":[{"type":"address","name":"minter","indexed":false}],"anonymous":false,"type":"event"},{"name":"SetAdmin","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[{"type":"string","name":"_name"},{"type":"string","name":"_symbol"},{"type":"uint256","name":"_decimals"}],"stateMutability":"nonpayable","type":"constructor"},{"name":"update_mining_parameters","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":148748},{"name":"start_epoch_time_write","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":149603},{"name":"future_epoch_time_write","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":149806},{"name":"available_supply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":4018},{"name":"mintable_in_timeframe","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"start"},{"type":"uint256","name":"end"}],"stateMutability":"view","type":"function","gas":2216141},{"name":"set_minter","outputs":[],"inputs":[{"type":"address","name":"_minter"}],"stateMutability":"nonpayable","type":"function","gas":38698},{"name":"set_admin","outputs":[],"inputs":[{"type":"address","name":"_admin"}],"stateMutability":"nonpayable","type":"function","gas":37837},{"name":"totalSupply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1421},{"name":"allowance","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"_owner"},{"type":"address","name":"_spender"}],"stateMutability":"view","type":"function","gas":1759},{"name":"transfer","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_to"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":75139},{"name":"transferFrom","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_from"},{"type":"address","name":"_to"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":111433},{"name":"approve","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_spender"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":39288},{"name":"mint","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_to"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":228030},{"name":"burn","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":74999},{"name":"set_name","outputs":[],"inputs":[{"type":"string","name":"_name"},{"type":"string","name":"_symbol"}],"stateMutability":"nonpayable","type":"function","gas":178270},{"name":"name","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":8063},{"name":"symbol","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":7116},{"name":"decimals","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1721},{"name":"balanceOf","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":1905},{"name":"minter","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1781},{"name":"admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1811},{"name":"mining_epoch","outputs":[{"type":"int128","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1841},{"name":"start_epoch_time","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1871},{"name":"rate","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1901}]
```

</ContractABI>

:::

For a broader understanding of the use case of the CRV token, check out [Understanding CRV](https://resources.curve.fi/crv-token/overview/).

---

## Transfer and Allowance

### `approve`
::::description[`CRV.approve(_spender: address, _value: uint256) -> bool`]


:::warning

Approval may only be from `zero -> nonzero` or from `nonzero -> zero` in order to mitigate the potential race condition described here: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729


:::

Function to approve `_spender` to transfer `_value` tokens on behalf of `msg.sender`.

Returns: true (`bool`).

Emits: `Approval` event.

| Input      | Type      | Description       |
| ---------- | --------- | ----------------- |
| `_spender` | `address` | Spender address   |
| `_value`   | `uint256` | Amount to approve |

<SourceCode>

```vyper
event Approval:
    _owner: indexed(address)
    _spender: indexed(address)
    _value: uint256

allowances: HashMap[address, HashMap[address, uint256]]

@external
def approve(_spender : address, _value : uint256) -> bool:
    """
    @notice Approve `_spender` to transfer `_value` tokens on behalf of `msg.sender`
    @dev Approval may only be from zero -> nonzero or from nonzero -> zero in order
        to mitigate the potential race condition described here:
        https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    @param _spender The address which will spend the funds
    @param _value The amount of tokens to be spent
    @return bool success
    """
    assert _value == 0 or self.allowances[msg.sender][_spender] == 0
    self.allowances[msg.sender][_spender] = _value
    log Approval(msg.sender, _spender, _value)
    return True
```

</SourceCode>

<Example>

This example approves `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` to transfer 1 CRV token on behalf of `msg.sender`.

```shell
>>> CRV.approve('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 1000000000000000000)
'True'
```

</Example>


::::

### `allowance`
::::description[`CRV.allowance(_owner: address, _spender: address) -> uint256`]


Getter method to check the amount of tokens that `_owner` has allowed `_spender` to use.

Returns: amount of tokens (`uint256`) that `_owner` has allowed `_spender` to use.

| Input      | Type      | Description     |
|------------|-----------|---------------- |
| `_owner`   | `address` | Owner address   |
| `_spender` | `address` | Spender address |

<SourceCode>

```vyper
allowances: HashMap[address, HashMap[address, uint256]]

@external
@view
def allowance(_owner : address, _spender : address) -> uint256:
    """
    @notice Check the amount of tokens that an owner allowed to a spender
    @param _owner The address which owns the funds
    @param _spender The address which will spend the funds
    @return uint256 specifying the amount of tokens still available for the spender
    """
    return self.allowances[_owner][_spender]
```

</SourceCode>

<Example>

This example returns the amount of CRV tokens that `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` is allowed to spend on behalf of `0x7a16fF8270133F063aAb6C9977183D9e72835428`.

```shell
>>> CRV.allowance('0x7a16fF8270133F063aAb6C9977183D9e72835428', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
0
```

</Example>


::::

### `transfer`
::::description[`CRV.transfer(_to: address, _value: uint256) -> bool`]


:::warning

Vyper does not allow underflows; thus, any subtraction in this function will revert if there is an insufficient balance.

Additionally, transfers to `ZERO_ADDRESS` are not allowed.


:::

Function to transfer `_value` tokens from `msg.sender` to `_to`.

Returns: true (`bool`).

Emits: `Transfer` event.

| Input    | Type      | Description                    |
| -------- | --------- | ------------------------------ |
| `_to`    | `address` | Receiver address of the tokens |
| `_value` | `uint256` | Amount of tokens to transfer   |

<SourceCode>

```vyper
event Transfer:
    _from: indexed(address)
    _to: indexed(address)
    _value: uint256

balanceOf: public(HashMap[address, uint256])

@external
def transfer(_to : address, _value : uint256) -> bool:
    """
    @notice Transfer `_value` tokens from `msg.sender` to `_to`
    @dev Vyper does not allow underflows, so the subtraction in
        this function will revert on an insufficient balance
    @param _to The address to transfer to
    @param _value The amount to be transferred
    @return bool success
    """
    assert _to != ZERO_ADDRESS  # dev: transfers to 0x0 are not allowed
    self.balanceOf[msg.sender] -= _value
    self.balanceOf[_to] += _value
    log Transfer(msg.sender, _to, _value)
    return True
```

</SourceCode>

<Example>

This example transfers 1 CRV token from `msg.sender` to `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`.

```shell
>>> CRV.transfer('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 1000000000000000000)
'True'
```

</Example>


::::

### `transferFrom`
::::description[`CRV.transferFrom(_from: address, _to: address, _value: uint256) -> bool`]


:::warning

Vyper does not allow underflows; thus, any subtraction in this function will revert if there is an insufficient balance.

Additionally, transfers to `ZERO_ADDRESS` are not allowed.


:::

Function to transfer `_value` tokens from `_from_` to `_to`.

Returns: true (`bool`).

Emits: `Transfer` event.

| Input    | Type      | Description                    |
| -------- | --------- | ------------------------------ |
| `_from`  | `address` | Address to send tokens from    |
| `_to`    | `address` | Receiver address of the tokens |
| `_value` | `uint256` | Amount of tokens to transfer   |

<SourceCode>

```vyper
event Transfer:
    _from: indexed(address)
    _to: indexed(address)
    _value: uint256

balanceOf: public(HashMap[address, uint256])
allowances: HashMap[address, HashMap[address, uint256]]

@external
def transferFrom(_from : address, _to : address, _value : uint256) -> bool:
    """
    @notice Transfer `_value` tokens from `_from` to `_to`
    @param _from address The address which you want to send tokens from
    @param _to address The address which you want to transfer to
    @param _value uint256 the amount of tokens to be transferred
    @return bool success
    """
    assert _to != ZERO_ADDRESS  # dev: transfers to 0x0 are not allowed
    # NOTE: vyper does not allow underflows
    #       so the following subtraction would revert on insufficient balance
    self.balanceOf[_from] -= _value
    self.balanceOf[_to] += _value
    self.allowances[_from][msg.sender] -= _value
    log Transfer(_from, _to, _value)
    return True
```

</SourceCode>

<Example>

This example transfers 1 CRV token from `0x7a16fF8270133F063aAb6C9977183D9e72835428` to `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`.

```shell
>>> CRV.transferFrom('0x7a16fF8270133F063aAb6C9977183D9e72835428', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 1000000000000000000)
'True'
```

</Example>


::::

---

## Emissions, Minting and Burning

Curve has a strict minting mechanism of new CRV tokens. New tokens are minted based on the gauge weights of an epoch. For more information, see [Gauge Weight Voting](../gauges/overview.md#gauge-weight-voting)

:::info[Minting New CRV]

New `CRV` tokens can only be minted by the `minter` contract.


:::

Mining parameters are used to determine token emissions, which are based on epochs (one year). With each passing epoch, the `rate` will be reduced, consequently decreasing the overall CRV emissions.

The rate can be adjusted by invoking the `update_mining_parameters()` function. Although this function is accessible to anyone, attempts to call it will be reverted if a year has not elapsed since the last update. When successfully executed, the `mining_epoch` increments by 1, and the `start_epoch_time` updates to the timestamp of the function call. Furthermore, the `update_mining_parameters()` function will automatically trigger if someone attempts to mint CRV before a scheduled rate reduction.

*Effectively, each rate reduction decreases CRV inflation by approximately 15.9%. The future rate is calculated as follows:*

$$\text{rate}_\text{future} = \text{rate}_\text{current} * \frac{10^{18}}{2^{\frac{1}{4}} * 10^{18}}$$

with $\text{rate}_\text{current}$ fetched from the [`rate()`](#rate) function.

---

### `minter`
::::description[`CRV.minter() -> address: view`]


Getter for the `Minter` contract address. The minter address can only be set once (at deployment) and not altered after.

Returns: `Minter` contract (`address`).

<SourceCode>

```vyper
minter: public(address)
```

</SourceCode>

<Example>

This example returns the minter contract address.

```shell
>>> CRV.minter()
'0xd061D61a4d941c39E5453435B6345Dc261C2fcE0'
```

</Example>


::::

### `mint`
::::description[`CRV.mint(_to: address, _value: uint256) -> bool:`]


:::guard[Guarded Method]

This function is only callable by the `Minter` contract.


:::

Function to mint `_value` tokens and assign them to `_to`.

Returns: true (`bool`)

Emits: `Transfer` event.

| Input    | Type      | Description                   |
| -------- | --------- | ----------------------------- |
| `_to`    | `address` | Receiver of the minted tokens |
| `_value` | `uint256` | Amount to mint                |

<SourceCode>

```vyper
event Transfer:
    _from: indexed(address)
    _to: indexed(address)
    _value: uint256

minter: public(address)
balanceOf: public(HashMap[address, uint256])
total_supply: uint256

@external
def mint(_to: address, _value: uint256) -> bool:
    """
    @notice Mint `_value` tokens and assign them to `_to`
    @dev Emits a Transfer event originating from 0x00
    @param _to The account that will receive the created tokens
    @param _value The amount that will be created
    @return bool success
    """
    assert msg.sender == self.minter  # dev: minter only
    assert _to != ZERO_ADDRESS  # dev: zero address

    if block.timestamp >= self.start_epoch_time + RATE_REDUCTION_TIME:
        self._update_mining_parameters()

    _total_supply: uint256 = self.total_supply + _value
    assert _total_supply <= self._available_supply()  # dev: exceeds allowable mint amount
    self.total_supply = _total_supply

    self.balanceOf[_to] += _value
    log Transfer(ZERO_ADDRESS, _to, _value)

    return True
```

</SourceCode>

<Example>

This example mints 1 CRV token to `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`.

```shell
>>> CRV.mint('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 1000000000000000000)
'True'
```

</Example>


::::

### `mintable_in_timeframe`
::::description[`CRV.mintable_in_timeframe(start: uint256, end: uint256) -> uint256`]


Getter for the mintable supply between `start` and `end` timestamps. The value is dependent on the current emission `rate` of the token.

Returns: mintable tokens (`uint256`).

| Input   | Type      | Description     |
|-------- | --------- | --------------- |
| `start` | `uint256` | Start timestamp |
| `end`   | `uint256` | End timestamp   |

<SourceCode>

```vyper
@external
@view
def mintable_in_timeframe(start: uint256, end: uint256) -> uint256:
    """
    @notice How much supply is mintable from start timestamp till end timestamp
    @param start Start of the time interval (timestamp)
    @param end End of the time interval (timestamp)
    @return Tokens mintable from `start` till `end`
    """
    assert start <= end  # dev: start > end
    to_mint: uint256 = 0
    current_epoch_time: uint256 = self.start_epoch_time
    current_rate: uint256 = self.rate

    # Special case if end is in future (not yet minted) epoch
    if end > current_epoch_time + RATE_REDUCTION_TIME:
        current_epoch_time += RATE_REDUCTION_TIME
        current_rate = current_rate * RATE_DENOMINATOR / RATE_REDUCTION_COEFFICIENT

    assert end <= current_epoch_time + RATE_REDUCTION_TIME  # dev: too far in future

    for i in range(999):  # Curve will not work in 1000 years. Darn!
        if end >= current_epoch_time:
            current_end: uint256 = end
            if current_end > current_epoch_time + RATE_REDUCTION_TIME:
                current_end = current_epoch_time + RATE_REDUCTION_TIME

            current_start: uint256 = start
            if current_start >= current_epoch_time + RATE_REDUCTION_TIME:
                break  # We should never get here but what if...
            elif current_start < current_epoch_time:
                current_start = current_epoch_time

            to_mint += current_rate * (current_end - current_start)

            if start >= current_epoch_time:
                break

        current_epoch_time -= RATE_REDUCTION_TIME
        current_rate = current_rate * RATE_REDUCTION_COEFFICIENT / RATE_DENOMINATOR  # double-division with rounding made rate a bit less => good
        assert current_rate <= INITIAL_RATE  # This should never happen

    return to_mint
```

</SourceCode>

<Example>

This example returns the mintable CRV supply between two timestamps (`1704067200` to `1704153600`).

```shell
>>> CRV.mintable_in_timeframe(1704067200, 1704153600)
573744014880952380952380
```

</Example>


::::

### `burn`
::::description[`CRV.burn(_value: uint256) -> bool`]


Function to burn `_value` tokens of the function caller by sending them to `ZERO_ADDRESS`.

Returns: true (`bool`).

Emits: `Transfer` event.

| Input    | Type      | Description              |
| -------- | --------- | ------------------------ |
| `_value` | `uint256` | Amount of tokens to burn |

<SourceCode>

```vyper
event Transfer:
    _from: indexed(address)
    _to: indexed(address)
    _value: uint256

balanceOf: public(HashMap[address, uint256])
total_supply: uint256

@external
def burn(_value: uint256) -> bool:
    """
    @notice Burn `_value` tokens belonging to `msg.sender`
    @dev Emits a Transfer event with a destination of 0x00
    @param _value The amount that will be burned
    @return bool success
    """
    self.balanceOf[msg.sender] -= _value
    self.total_supply -= _value

    log Transfer(msg.sender, ZERO_ADDRESS, _value)
    return True
```

</SourceCode>

<Example>

This example burns 1 CRV token belonging to `msg.sender`.

```shell
>>> CRV.burn(1000000000000000000)
'True'
```

</Example>


::::

### `mining_epoch`
::::description[`CRV.mining_epoch() -> int128: view`]


Getter for the current mining epoch. The mining epoch is incremented by 1 every time [`update_mining_parameters()`](#update_mining_parameters) is successfully called. At deployment, `mining_epoch` was set to -1.

Returns: mining epoch (`int128`).

<SourceCode>

```vyper
mining_epoch: public(int128)

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256):
    """
    @notice Contract constructor
    @param _name Token full name
    @param _symbol Token symbol
    @param _decimals Number of decimals for token
    """
    ...
    self.mining_epoch = -1
    ...

@internal
def _update_mining_parameters():
    """
    @dev Update mining rate and supply at the start of the epoch
        Any modifying mining call must also call this
    """
    _rate: uint256 = self.rate
    _start_epoch_supply: uint256 = self.start_epoch_supply

    self.start_epoch_time += RATE_REDUCTION_TIME
    self.mining_epoch += 1

    if _rate == 0:
        _rate = INITIAL_RATE
    else:
        _start_epoch_supply += _rate * RATE_REDUCTION_TIME
        self.start_epoch_supply = _start_epoch_supply
        _rate = _rate * RATE_DENOMINATOR / RATE_REDUCTION_COEFFICIENT

    self.rate = _rate

    log UpdateMiningParameters(block.timestamp, _rate, _start_epoch_supply)
```

</SourceCode>

<Example>

This example returns the current mining epoch. The value is fetched live from the blockchain.

<ContractCall
  address="0xD533a949740bb3306d119CC777fa900bA034cd52"
  abi={["function mining_epoch() view returns (int128)"]}
  method="mining_epoch"
  contractName="CRV"
/>

</Example>


::::

### `start_epoch_time`
::::description[`CRV.start_epoch_time() -> uint256: view`]


Getter for the start timestamp of the current mining epoch.

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
start_epoch_time: public(uint256)

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256):
    """
    @notice Contract constructor
    @param _name Token full name
    @param _symbol Token symbol
    @param _decimals Number of decimals for token
    """
    ...

    self.start_epoch_time = block.timestamp + INFLATION_DELAY - RATE_REDUCTION_TIME

    ...
```

</SourceCode>

<Example>

This example returns the start timestamp of the current mining epoch. The value is fetched live from the blockchain.

<ContractCall
  address="0xD533a949740bb3306d119CC777fa900bA034cd52"
  abi={["function start_epoch_time() view returns (uint256)"]}
  method="start_epoch_time"
  contractName="CRV"
/>

</Example>


::::

### `rate`
::::description[`CRV.rate() -> uint256: view`]


Getter for the current inflation rate of the CRV token emission. The rate is denominated in emissions per second and has a base of 1e18.

To calculate the CRV emission per day:

$$\text{daily\_emission} = \text{rate} \times 86400$$

$$\text{weekly\_emission} = \text{rate} \times 86400 \times 7$$

$$\text{yearly\_emission} = \text{rate} \times 86400 \times 365$$

Returns: current inflation rate (`uint256`).

<SourceCode>

```vyper
rate: public(uint256)
```

</SourceCode>

<Example>

This example returns the current CRV emission rate per second. The value is fetched live from the blockchain.

<ContractCall
  address="0xD533a949740bb3306d119CC777fa900bA034cd52"
  abi={["function rate() view returns (uint256)"]}
  method="rate"
  contractName="CRV"
/>

</Example>


::::

### `update_mining_parameters`
::::description[`CRV.update_mining_parameters()`]


Function to update the mining parameters for the token. By updating, the newly decreased inflation rate is applied. This function is callable by anyone. However, the call will revert if `block.timestamp` is less than or equal to `start_epoch_time` + `RATE_REDUCTION_TIME`, indicating that one year has not yet passed and therefore the rate cannot be updated yet.

Emits: `UpdateMiningParameters` event.

<SourceCode>

```vyper
event UpdateMiningParameters:
    time: uint256
    rate: uint256
    supply: uint256

YEAR: constant(uint256) = 86400 * 365

# Supply parameters
INITIAL_SUPPLY: constant(uint256) = 1_303_030_303
INITIAL_RATE: constant(uint256) = 274_815_283 * 10 **18 / YEAR  # leading to 43% premine
RATE_REDUCTION_TIME: constant(uint256) = YEAR
RATE_REDUCTION_COEFFICIENT: constant(uint256) = 1189207115002721024  # 2 **(1/4) * 1e18
RATE_DENOMINATOR: constant(uint256) = 10 **18
INFLATION_DELAY: constant(uint256) = 86400

# Supply variables
mining_epoch: public(int128)
start_epoch_time: public(uint256)
rate: public(uint256)

start_epoch_supply: uint256

@external
def update_mining_parameters():
    """
    @notice Update mining rate and supply at the start of the epoch
    @dev Callable by any address, but only once per epoch
        Total supply becomes slightly larger if this function is called late
    """
    assert block.timestamp >= self.start_epoch_time + RATE_REDUCTION_TIME  # dev: too soon!
    self._update_mining_parameters()

@internal
def _update_mining_parameters():
    """
    @dev Update mining rate and supply at the start of the epoch
        Any modifying mining call must also call this
    """
    _rate: uint256 = self.rate
    _start_epoch_supply: uint256 = self.start_epoch_supply

    self.start_epoch_time += RATE_REDUCTION_TIME
    self.mining_epoch += 1

    if _rate == 0:
        _rate = INITIAL_RATE
    else:
        _start_epoch_supply += _rate * RATE_REDUCTION_TIME
        self.start_epoch_supply = _start_epoch_supply
        _rate = _rate * RATE_DENOMINATOR / RATE_REDUCTION_COEFFICIENT

    self.rate = _rate

    log UpdateMiningParameters(block.timestamp, _rate, _start_epoch_supply)
```

</SourceCode>

<Example>

This example updates the mining parameters for the CRV token, applying the newly decreased inflation rate.

```shell
>>> CRV.update_mining_parameters()
```

</Example>


::::

### `start_epoch_time_write`
::::description[`CRV.start_epoch_time_write() -> uint256`]


Function to get the current mining epoch start while simultaneously updating mining parameters if possible. If updating is not possible, the function will only return the start timestamp of the current epoch.

Returns: start timestamp of the epoch (`uint256`).

<SourceCode>

```vyper
start_epoch_time: public(uint256)

@external
def start_epoch_time_write() -> uint256:
    """
    @notice Get timestamp of the current mining epoch start
            while simultaneously updating mining parameters
    @return Timestamp of the epoch
    """
    _start_epoch_time: uint256 = self.start_epoch_time
    if block.timestamp >= _start_epoch_time + RATE_REDUCTION_TIME:
        self._update_mining_parameters()
        return self.start_epoch_time
    else:
        return _start_epoch_time
```

</SourceCode>

<Example>

This example returns the current epoch start timestamp while updating mining parameters if applicable.

```shell
>>> CRV.start_epoch_time_write()
1691625600
```

</Example>


::::

### `future_epoch_time_write`
::::description[`CRV.future_epoch_time_write() -> uint256`]


Function to get the next mining epoch start timestamp while simultaneously updating mining parameters if possible. If updating is not possible, the function will only return the start timestamp of the future epoch.

Returns: start timestamp of the future epoch (`uint256`).

<SourceCode>

```vyper
@external
def future_epoch_time_write() -> uint256:
    """
    @notice Get timestamp of the next mining epoch start
            while simultaneously updating mining parameters
    @return Timestamp of the next epoch
    """
    _start_epoch_time: uint256 = self.start_epoch_time
    if block.timestamp >= _start_epoch_time + RATE_REDUCTION_TIME:
        self._update_mining_parameters()
        return self.start_epoch_time + RATE_REDUCTION_TIME
    else:
        return _start_epoch_time + RATE_REDUCTION_TIME
```

</SourceCode>

<Example>

This example returns the next epoch start timestamp while updating mining parameters if applicable.

```shell
>>> CRV.future_epoch_time_write()
1723161600
```

</Example>


::::

---

## Admin Controls and Other Methods

The controls over the Curve DAO Token are strictly limited. The `admin` of the contract can only modify the `name`, `admin`, or `minter`[^1].

Since the [`CurveOwnershipAgent`](https://etherscan.io/address/0x40907540d8a6C65c637785e8f8B742ae6b0b9968) is the current admin of the contract, any changes to these parameters would require a successfully passed DAO vote.

[^1]: Although `set_minter` is technically an admin-guarded function, there is **no actual way to change the minter address** because the code checks if the current minter is set to `ZERO_ADDRESS`, which was only true when the contract was initially deployed.

### `admin`
::::description[`CRV.admin() -> address: view`]


Getter for the current admin of the contract.

Returns: admin (`address`).

<SourceCode>

```vyper
admin: public(address)

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256):
    """
    @notice Contract constructor
    @param _name Token full name
    @param _symbol Token symbol
    @param _decimals Number of decimals for token
    """
    ...
    self.admin = msg.sender
    ...
```

</SourceCode>

<Example>

This example returns the current admin of the CRV token contract.

```shell
>>> CRV.admin()
'0x40907540d8a6C65c637785e8f8B742ae6b0b9968'
```

</Example>


::::

### `set_admin`
::::description[`CRV.set_admin(_admin: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to change the admin of the contract.

Emits: `SetAdmin` event.

| Input    | Type      | Description       |
| -------- | --------- | ----------------- |
| `_admin` | `address` | New Admin Address |

<SourceCode>

```vyper
event SetAdmin:
    admin: address

admin: public(address)

@external
def set_admin(_admin: address):
    """
    @notice Set the new admin.
    @dev After all is set up, admin only can change the token name
    @param _admin New admin address
    """
    assert msg.sender == self.admin  # dev: admin only
    self.admin = _admin
    log SetAdmin(_admin)
```

</SourceCode>

<Example>

This example sets a new admin for the CRV token contract.

```shell
>>> CRV.set_admin("0x0000000000000000000000000000000000000000")
```

</Example>


::::

### `name`
::::description[`CRV.name() -> String[64]`]


Getter for the name of the token. Name of the token can be changed by calling the **`set_name`**function.

Returns: token name (`String[64]`).

<SourceCode>

```vyper
name: public(String[64])

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256):
    """
    @notice Contract constructor
    @param _name Token full name
    @param _symbol Token symbol
    @param _decimals Number of decimals for token
    """
    init_supply: uint256 = INITIAL_SUPPLY * 10 **_decimals
    self.name = _name

    ...
```

</SourceCode>

<Example>

This example returns the name of the CRV token.

```shell
>>> CRV.name()
'Curve DAO Token'
```

</Example>


::::

### `symbol`
::::description[`CRV.symbol() -> String[32]`]


Getter of the token symbol. Symbol of the token can be changed by calling the **`set_name`**function.

Returns: token symbol (`String[32]`).

<SourceCode>

```vyper
symbol: public(String[32])

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256):
    """
    @notice Contract constructor
    @param _name Token full name
    @param _symbol Token symbol
    @param _decimals Number of decimals for token
    """
    ...

    self.symbol = _symbol

    ...
```

</SourceCode>

<Example>

This example returns the symbol of the CRV token.

```shell
>>> CRV.symbol()
'CRV'
```

</Example>


::::

### `set_name`
::::description[`CRV.set_name(_name: String[64], _symbol: String[32])`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to change the token name and symbol.

| Input     | Type         | Description       |
| --------- | ------------ | ----------------- |
| `_name`   | `String[64]` | New token name.   |
| `_symbol` | `String[32]` | New token symbol. |

<SourceCode>

```vyper
name: public(String[64])
symbol: public(String[32])

@external
def set_name(_name: String[64], _symbol: String[32]):
    """
    @notice Change the token name and symbol to `_name` and `_symbol`
    @dev Only callable by the admin account
    @param _name New token name
    @param _symbol New token symbol
    """
    assert msg.sender == self.admin, "Only admin is allowed to change name"
    self.name = _name
    self.symbol = _symbol
```

</SourceCode>

<Example>

This example changes the name and symbol of the CRV token.

```shell
>>> CRV.set_name("New Name", "New Symbol")
```

</Example>


::::

### `set_minter`
::::description[`CRV.set_minter(_minter: address):`]


:::warning[Changing the `minter` contract is not possible anymore!]

This function was only utilized during the initial deployment of the Curve DAO Token. The code permits setting the `minter` exclusively when the current minter is `ZERO_ADDRESS`, a condition met solely at the time of deployment. Consequently, the `minter` variable could only be set once and cannot be changed thereafter.


:::

:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set the minter contract for the token.

Emits: `SetMinter` event.

| Input     | Type      | Description             |
| --------- | --------- | ----------------------- |
| `_minter` | `address` | Minter contract address |

<SourceCode>

```vyper
event SetMinter:
    minter: address

minter: public(address)

@external
def set_minter(_minter: address):
    """
    @notice Set the minter address
    @dev Only callable once, when minter has not yet been set
    @param _minter Address of the minter
    """
    assert msg.sender == self.admin  # dev: admin only
    assert self.minter == ZERO_ADDRESS  # dev: can set the minter only once, at creation
    self.minter = _minter
    log SetMinter(_minter)
```

</SourceCode>

<Example>

This example attempts to set the minter contract address. Since the minter is already set, this call will revert.

```shell
>>> CRV.set_minter("0x0000000000000000000000000000000000000000")
```

</Example>


::::

### `available_supply`
::::description[`CRV.available_supply() -> uint256`]


Getter for the current number of CRV tokens - claimed or unclaimed - in existence.

Returns: currently existing tokens (`uint256`).

<SourceCode>

```vyper
@internal
@view
def _available_supply() -> uint256:
    return self.start_epoch_supply + (block.timestamp - self.start_epoch_time) * self.rate

@external
@view
def available_supply() -> uint256:
    """
    @notice Current number of tokens in existence (claimed or unclaimed)
    """
    return self._available_supply()
```

</SourceCode>

<Example>

This example returns the current available supply of CRV tokens. The value is fetched live from the blockchain.

<ContractCall
  address="0xD533a949740bb3306d119CC777fa900bA034cd52"
  abi={["function available_supply() view returns (uint256)"]}
  method="available_supply"
  contractName="CRV"
/>

</Example>


::::

### `totalSupply`
::::description[`CRV.totalSupply() -> uint256`]


Getter for the total number of tokens in existence.

Returns: total supply (`uint256`).

<SourceCode>

```vyper
total_supply: uint256

@external
@view
def totalSupply() -> uint256:
    """
    @notice Total number of tokens in existence.
    """
    return self.total_supply
```

</SourceCode>

<Example>

This example returns the total supply of CRV tokens. The value is fetched live from the blockchain.

<ContractCall
  address="0xD533a949740bb3306d119CC777fa900bA034cd52"
  abi={["function totalSupply() view returns (uint256)"]}
  method="totalSupply"
  contractName="CRV"
/>

</Example>


::::

### `decimals`
::::description[`CRV.decimals() -> uint256: view`]


Getter of the decimals of the token.

Returns: decimals (`uint256`).

<SourceCode>

```vyper
decimals: public(uint256)

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256):
    """
    @notice Contract constructor
    @param _name Token full name
    @param _symbol Token symbol
    @param _decimals Number of decimals for token
    """
    ...
    self.decimals = _decimals
    ...
```

</SourceCode>

<Example>

This example returns the number of decimals of the CRV token.

```shell
>>> CRV.decimals()
18
```

</Example>


::::

### `balanceOf`
::::description[`CRV.balanceOf(arg0: address) -> uint256: view`]


Getter for the crv token balance of a specific address.

Returns: balance (`uint256`).

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `address` | wallet to check CRV balance for |

<SourceCode>

```vyper
balanceOf: public(HashMap[address, uint256])
```

</SourceCode>

<Example>

This example returns the CRV token balance for a given address. Enter an address and click **Query** to fetch the value live from the blockchain.

<ContractCall
  address="0xD533a949740bb3306d119CC777fa900bA034cd52"
  abi={["function balanceOf(address) view returns (uint256)"]}
  method="balanceOf"
  args={["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]}
  labels={["address"]}
  contractName="CRV"
/>

</Example>


::::
