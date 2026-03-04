# AggMonetaryPolicy (v4)

The `AggMonetaryPolicy4` contract is the latest version of the aggregated monetary policy for crvUSD markets. It builds on the original `AggMonetaryPolicy` with several key improvements: **EMA-smoothed PegKeeper debt ratios** (reducing manipulation risk), **debt candles** (using the minimum debt over half-day periods for more stable rate calculations), **per-market rate adjustments** (scaling rates based on how close a market is to its debt ceiling), and an additional **`extra_const`** parameter added to the base rate.

:::vyper[`AggMonetaryPolicy4.vy`]

The source code for the `AggMonetaryPolicy4.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-stablecoin/blob/master/contracts/mpolicies/AggMonetaryPolicy4.vy). The contract is written in [Vyper](https://vyperlang.org/) version `0.4.3`.

The contract is deployed on :logos-ethereum: Ethereum at [`0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251`](https://etherscan.io/address/0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251).

<ContractABI>

```json
[{"anonymous":false,"inputs":[{"indexed":false,"name":"admin","type":"address"}],"name":"SetAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"peg_keeper","type":"address"}],"name":"AddPegKeeper","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"peg_keeper","type":"address"}],"name":"RemovePegKeeper","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"rate","type":"uint256"}],"name":"SetRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sigma","type":"int256"}],"name":"SetSigma","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target_debt_fraction","type":"uint256"}],"name":"SetTargetDebtFraction","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"extra_const","type":"uint256"}],"name":"SetExtraConst","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"debt_ratio_ema_time","type":"uint256"}],"name":"SetDebtRatioEmaTime","type":"event"},{"inputs":[{"name":"admin","type":"address"},{"name":"price_oracle","type":"address"},{"name":"controller_factory","type":"address"},{"name":"peg_keepers","type":"address[5]"},{"name":"rate","type":"uint256"},{"name":"sigma","type":"int256"},{"name":"target_debt_fraction","type":"uint256"},{"name":"extra_const","type":"uint256"},{"name":"_debt_ratio_ema_time","type":"uint256"}],"outputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"name":"admin","type":"address"}],"name":"set_admin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"pk","type":"address"}],"name":"add_peg_keeper","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"pk","type":"address"}],"name":"remove_peg_keeper","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"_for","type":"address"}],"name":"rate","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate_write","outputs":[{"name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_for","type":"address"}],"name":"rate_write","outputs":[{"name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"rate","type":"uint256"}],"name":"set_rate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"sigma","type":"int256"}],"name":"set_sigma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"target_debt_fraction","type":"uint256"}],"name":"set_target_debt_fraction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"extra_const","type":"uint256"}],"name":"set_extra_const","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_debt_ratio_ema_time","type":"uint256"}],"name":"set_debt_ratio_ema_time","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"debt_ratio_ema_time","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate0","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sigma","outputs":[{"name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"target_debt_fraction","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"extra_const","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"uint256"}],"name":"peg_keepers","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRICE_ORACLE","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CONTROLLER_FACTORY","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"n_controllers","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"uint256"}],"name":"controllers","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"address"}],"name":"min_debt_candles","outputs":[{"name":"candle0","type":"uint256"},{"name":"candle1","type":"uint256"},{"name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"}]
```

</ContractABI>

:::


## Interest Rate Mechanics

This version of the monetary policy uses the same core formula as the original but adds several refinements for more robust and market-aware rate calculation.

### Base Rate Formula

The base interest rate is computed as:

$$r = rate0 \cdot e^{\text{power}} + extra\_const$$

Where:

$$\text{power} = \frac{price\_peg - price\_crvusd}{\sigma} - \frac{EMA(DebtRatio)}{TargetFraction}$$

Key variables:

- $rate0$: the baseline rate when PegKeepers are debt-free and crvUSD price equals 1
- $price\_peg$: target crvUSD price (1.00)
- $price\_crvusd$: actual crvUSD price from `PRICE_ORACLE.price()`
- $\sigma$: sensitivity parameter controlling how much price deviations affect the rate
- $EMA(DebtRatio)$: exponentially smoothed PegKeeper debt ratio (see below)
- $TargetFraction$: target debt fraction for PegKeepers
- $extra\_const$: an additional constant added to the rate

### EMA-Smoothed Debt Ratio

Instead of using the raw PegKeeper debt fraction directly, this version smooths it with an **exponential moving average**. The EMA uses a queueing mechanism where the value from the *previous* update is used as input, and new values are queued for the *next* update. This reduces manipulation risk—a flash loan attacker would have to sustain their position beyond a single transaction to impact the EMA.

### Per-Market Rate Adjustment

After computing the base rate, it is further adjusted based on how close an individual market's debt is to its debt ceiling:

$$rate\_adjusted = rate \cdot \frac{(1 - target) + target \cdot \frac{1}{1 - f}}{1}$$

Where $f = \frac{debt\_for}{ceiling}$ and $target = 0.1$ (`TARGET_REMAINDER`). This means:

- At 0% utilization: rate stays the same ($1.0 \times rate$)
- At 90% of ceiling: rate doubles ($1.9 \times rate$)
- At 100% of ceiling: rate is capped at `MAX_RATE` (300% APY)

### Debt Candles

The contract tracks **minimum debt** over half-day periods using a candle-like structure. Instead of using the current (potentially manipulated) debt values, `calculate_rate` uses the minimum observed debt from recent candle periods, providing more stable rate calculations.

### Annualized Rate

Both `rate` and `rate0` are expressed per second with $10^{18}$ precision. The annualized rate is:

$$\text{annualRate} = (1 + \frac{rate}{10^{18}})^{365 \times 24 \times 60 \times 60} - 1$$

---


## Interest Rates

### `rate`
::::description[`AggMonetaryPolicy4.rate(_for: address = msg.sender) -> uint256: view`]

Getter for the current interest rate paid per second for a given controller. If no `_for` address is provided, it defaults to `msg.sender`. The rate is calculated using EMA-smoothed PegKeeper debt ratios and adjusted based on the controller's debt ceiling utilization.

| Input  | Type      | Description                                      |
| ------ | --------- | ------------------------------------------------ |
| `_for` | `address` | Controller address to calculate rate for (optional, defaults to `msg.sender`) |

Returns: rate (`uint256`).

<SourceCode>

```vyper
@view
@external
def rate(_for: address = msg.sender) -> uint256:
    rate: uint256 = 0
    _: uint256 = 0
    rate, _ = self.calculate_rate(_for, staticcall PRICE_ORACLE.price(), True)
    return rate

@internal
@view
def calculate_rate(_for: address, _price: uint256, ro: bool) -> (uint256, uint256):
    sigma: int256 = self.sigma
    target_debt_fraction: uint256 = self.target_debt_fraction

    p: int256 = convert(_price, int256)
    pk_debt: uint256 = 0
    for pk: PegKeeper in self.peg_keepers:
        if pk.address == empty(address):
            break
        pk_debt += staticcall pk.debt()

    total_debt: uint256 = 0
    debt_for: uint256 = 0
    total_debt, debt_for = self.read_debt(_for, ro)

    power: int256 = (10**18 - p) * 10**18 // sigma  # high price -> negative pow -> low rate
    ratio: uint256 = 0
    if pk_debt > 0:
        if total_debt == 0:
            return 0, 0
        else:
            ratio = pk_debt * 10**18 // total_debt
            power -= convert(ema.read(DEBT_RATIO_EMA_ID) * 10**18 // target_debt_fraction, int256)

    # Rate accounting for crvUSD price and PegKeeper debt
    rate: uint256 = self.rate0 * min(self.exp(power), MAX_EXP) // 10**18 + self.extra_const

    # Account for individual debt ceiling to dynamically tune rate depending on filling the market
    ceiling: uint256 = staticcall CONTROLLER_FACTORY.debt_ceiling(_for)
    if ceiling > 0:
        f: uint256 = min(debt_for * 10**18 // ceiling, 10**18 - TARGET_REMAINDER // 1000)
        rate = min(rate * ((10**18 - TARGET_REMAINDER) + TARGET_REMAINDER * 10**18 // (10**18 - f)) // 10**18, MAX_RATE)

    return rate, ratio
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function rate() view returns (uint256)"]} method="rate" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `rate_write`
::::description[`AggMonetaryPolicy4.rate_write(_for: address = msg.sender) -> uint256`]

State-changing version of `rate` that also updates the controller cache, debt candles, and the EMA of the PegKeeper debt ratio. This function is called by controllers when they need the current rate and want to ensure state is updated.

| Input  | Type      | Description                                      |
| ------ | --------- | ------------------------------------------------ |
| `_for` | `address` | Controller address to calculate rate for (optional, defaults to `msg.sender`) |

Returns: the current rate (`uint256`).

<SourceCode>

```vyper
@external
def rate_write(_for: address = msg.sender) -> uint256:
    # Update controller list
    n_controllers: uint256 = self.n_controllers
    n_factory_controllers: uint256 = staticcall CONTROLLER_FACTORY.n_collaterals()
    if n_factory_controllers > n_controllers:
        self.n_controllers = n_factory_controllers
        for i: uint256 in range(MAX_CONTROLLERS):
            self.controllers[n_controllers] = staticcall CONTROLLER_FACTORY.controllers(n_controllers)
            n_controllers += 1
            if n_controllers >= n_factory_controllers:
                break

    # Update candles
    total_debt: uint256 = 0
    debt_for: uint256 = 0
    total_debt, debt_for = self.get_total_debt(_for)
    self.save_candle(empty(address), total_debt)
    self.save_candle(_for, debt_for)

    rate: uint256 = 0
    ratio: uint256 = 0
    rate, ratio = self.calculate_rate(_for, extcall PRICE_ORACLE.price_w(), False)
    ema.update(DEBT_RATIO_EMA_ID, ratio)
    return rate
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.rate_write()
3488503937
```

</Example>


::::

### `rate0`
::::description[`AggMonetaryPolicy4.rate0() -> uint256: view`]

Getter for the `rate0` baseline rate. `rate0` must be less than or equal to `MAX_RATE` (300% APY = `43959106799`).

Returns: rate0 (`uint256`).

<SourceCode>

```vyper
MAX_RATE: constant(uint256) = 43959106799  # 300% APY

rate0: public(uint256)

@deploy
def __init__(admin: address,
             price_oracle: PriceOracle,
             controller_factory: ControllerFactory,
             peg_keepers: PegKeeper[5],
             rate: uint256,
             sigma: int256,
             target_debt_fraction: uint256,
             extra_const: uint256,
             _debt_ratio_ema_time: uint256):
    ...

    assert rate <= MAX_RATE
    self.rate0 = rate

    ...
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function rate0() view returns (uint256)"]} method="rate0" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `set_rate`
::::description[`AggMonetaryPolicy4.set_rate(rate: uint256)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to set a new `rate0`. New value must be less than or equal to `MAX_RATE` (`43959106799`, i.e. 300% APY).

| Input  | Type      | Description     |
| ------ | --------- | --------------- |
| `rate` | `uint256` | New rate0 value |

Emits: `SetRate` event.

<SourceCode>

```vyper
event SetRate:
    rate: uint256

MAX_RATE: constant(uint256) = 43959106799  # 300% APY
rate0: public(uint256)

@external
def set_rate(rate: uint256):
    assert msg.sender == self.admin
    assert rate <= MAX_RATE
    self.rate0 = rate
    log SetRate(rate=rate)
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.set_rate(3488077118)
```

</Example>


::::


## Rate Parameters

### `sigma`
::::description[`AggMonetaryPolicy4.sigma() -> int256: view`]

Getter for the sigma value, which controls how sensitive the interest rate is to crvUSD price deviations. Must satisfy: $10^{14} \leq \sigma \leq 10^{18}$.

Returns: sigma (`int256`).

<SourceCode>

```vyper
sigma: public(int256)  # 2 * 10**16 for example

MAX_SIGMA: constant(int256) = 10**18
MIN_SIGMA: constant(int256) = 10**14
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function sigma() view returns (int256)"]} method="sigma" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `set_sigma`
::::description[`AggMonetaryPolicy4.set_sigma(sigma: int256)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to set a new sigma value. New value must be between `MIN_SIGMA` ($10^{14}$) and `MAX_SIGMA` ($10^{18}$).

| Input   | Type     | Description     |
| ------- | -------- | --------------- |
| `sigma` | `int256` | New sigma value |

Emits: `SetSigma` event.

<SourceCode>

```vyper
event SetSigma:
    sigma: int256

sigma: public(int256)

MAX_SIGMA: constant(int256) = 10**18
MIN_SIGMA: constant(int256) = 10**14

@external
def set_sigma(sigma: int256):
    assert msg.sender == self.admin
    assert sigma >= MIN_SIGMA
    assert sigma <= MAX_SIGMA

    self.sigma = sigma
    log SetSigma(sigma=sigma)
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.set_sigma(30000000000000000)
```

</Example>


::::

### `target_debt_fraction`
::::description[`AggMonetaryPolicy4.target_debt_fraction() -> uint256: view`]

Getter for the target PegKeeper debt fraction. This is the desired ratio of PegKeeper debt to total debt.

Returns: target debt fraction (`uint256`).

<SourceCode>

```vyper
MAX_TARGET_DEBT_FRACTION: constant(uint256) = 10**18

target_debt_fraction: public(uint256)
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function target_debt_fraction() view returns (uint256)"]} method="target_debt_fraction" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `set_target_debt_fraction`
::::description[`AggMonetaryPolicy4.set_target_debt_fraction(target_debt_fraction: uint256)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to set a new target debt fraction. Must be greater than 0 and less than or equal to `MAX_TARGET_DEBT_FRACTION` ($10^{18}$).

| Input                  | Type      | Description                    |
| ---------------------- | --------- | ------------------------------ |
| `target_debt_fraction` | `uint256` | New target debt fraction value |

Emits: `SetTargetDebtFraction` event.

<SourceCode>

```vyper
event SetTargetDebtFraction:
    target_debt_fraction: uint256

MAX_TARGET_DEBT_FRACTION: constant(uint256) = 10**18
target_debt_fraction: public(uint256)

@external
def set_target_debt_fraction(target_debt_fraction: uint256):
    assert msg.sender == self.admin
    assert target_debt_fraction <= MAX_TARGET_DEBT_FRACTION
    assert target_debt_fraction > 0

    self.target_debt_fraction = target_debt_fraction
    log SetTargetDebtFraction(target_debt_fraction=target_debt_fraction)
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.set_target_debt_fraction(200000000000000000)
```

</Example>


::::

### `extra_const`
::::description[`AggMonetaryPolicy4.extra_const() -> uint256: view`]

Getter for the `extra_const` value, an additional constant that is added to the computed rate. This allows setting a minimum floor rate independent of the exponential formula. Must be less than or equal to `MAX_EXTRA_CONST` (which equals `MAX_RATE`).

Returns: extra_const (`uint256`).

<SourceCode>

```vyper
MAX_EXTRA_CONST: constant(uint256) = MAX_RATE

extra_const: public(uint256)
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function extra_const() view returns (uint256)"]} method="extra_const" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `set_extra_const`
::::description[`AggMonetaryPolicy4.set_extra_const(extra_const: uint256)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to set a new `extra_const` value. Must be less than or equal to `MAX_EXTRA_CONST`.

| Input         | Type      | Description          |
| ------------- | --------- | -------------------- |
| `extra_const` | `uint256` | New extra_const value |

Emits: `SetExtraConst` event.

<SourceCode>

```vyper
event SetExtraConst:
    extra_const: uint256

MAX_EXTRA_CONST: constant(uint256) = MAX_RATE

extra_const: public(uint256)

@external
def set_extra_const(extra_const: uint256):
    assert msg.sender == self.admin
    assert extra_const <= MAX_EXTRA_CONST

    self.extra_const = extra_const
    log SetExtraConst(extra_const=extra_const)
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.set_extra_const(1000000000)
```

</Example>


::::

### `debt_ratio_ema_time`
::::description[`AggMonetaryPolicy4.debt_ratio_ema_time() -> uint256: view`]

Getter for the EMA smoothing time (in seconds) used for the PegKeeper debt ratio. A longer EMA time means the debt ratio changes more slowly, providing more stability but less responsiveness.

Returns: EMA time in seconds (`uint256`).

<SourceCode>

<Tabs>
<TabItem value="AggMonetaryPolicy4.vy" label="AggMonetaryPolicy4.vy">

```vyper
DEBT_RATIO_EMA_ID: constant(String[4]) = "pkr"

@external
@view
def debt_ratio_ema_time() -> uint256:
    return ema._emas[DEBT_RATIO_EMA_ID].ema_time
```

</TabItem>
<TabItem value="ema.vy" label="ema.vy (curve_std)">

```vyper
struct EMA:
    ema_time: uint256
    prev_value: uint256
    prev_timestamp: uint256
    queued_value: uint256

_emas: HashMap[String[4], EMA]
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function debt_ratio_ema_time() view returns (uint256)"]} method="debt_ratio_ema_time" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `set_debt_ratio_ema_time`
::::description[`AggMonetaryPolicy4.set_debt_ratio_ema_time(_debt_ratio_ema_time: uint256)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to set a new EMA smoothing time for the PegKeeper debt ratio. Before updating, it first computes the current EMA value to avoid discontinuities. The new value must be greater than 0.

| Input                   | Type      | Description                    |
| ----------------------- | --------- | ------------------------------ |
| `_debt_ratio_ema_time`  | `uint256` | New EMA time in seconds        |

Emits: `SetDebtRatioEmaTime` event.

<SourceCode>

<Tabs>
<TabItem value="AggMonetaryPolicy4.vy" label="AggMonetaryPolicy4.vy">

```vyper
event SetDebtRatioEmaTime:
    debt_ratio_ema_time: uint256

@external
def set_debt_ratio_ema_time(_debt_ratio_ema_time: uint256):
    assert msg.sender == self.admin

    ema.set_ema_time(DEBT_RATIO_EMA_ID, _debt_ratio_ema_time)
    log SetDebtRatioEmaTime(debt_ratio_ema_time=_debt_ratio_ema_time)
```

</TabItem>
<TabItem value="ema.vy" label="ema.vy (curve_std)">

```vyper
@internal
def set_ema_time(_ema_id: String[4], _ema_time: uint256):
    assert self._is_allowed(_ema_id)
    self.update(_ema_id, self._emas[_ema_id].queued_value)
    assert _ema_time > 0
    ema: EMA = self._emas[_ema_id]
    ema.ema_time = _ema_time
    self._emas[_ema_id] = ema
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.set_debt_ratio_ema_time(86400)
```

</Example>


::::


## PegKeepers

PegKeepers must be added to the MonetaryPolicy contract to calculate the rate, as it depends on the PegKeeper *DebtFraction*. They can be added by calling `add_peg_keeper` and removed via `remove_peg_keeper`.


### `peg_keepers`
::::description[`AggMonetaryPolicy4.peg_keepers(arg0: uint256) -> address: view`]

Getter for the PegKeeper contract at index `arg0`.

| Input  | Type      | Description              |
| ------ | --------- | ------------------------ |
| `arg0` | `uint256` | Index of the PegKeeper   |

Returns: PegKeeper contract (`address`).

<SourceCode>

```vyper
interface PegKeeper:
    def debt() -> uint256: view

peg_keepers: public(PegKeeper[1001])
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function peg_keepers(uint256) view returns (address)"]} method="peg_keepers" args={["0"]} labels={["arg0"]} contractName="AggMonetaryPolicy4" />

</Example>


::::

### `add_peg_keeper`
::::description[`AggMonetaryPolicy4.add_peg_keeper(pk: address)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to add an existing PegKeeper to the monetary policy contract.

| Input | Type      | Description               |
| ----- | --------- | ------------------------- |
| `pk`  | `address` | PegKeeper address to add  |

Emits: `AddPegKeeper` event.

<SourceCode>

```vyper
event AddPegKeeper:
    peg_keeper: indexed(address)

peg_keepers: public(PegKeeper[1001])

@external
def add_peg_keeper(pk: PegKeeper):
    assert msg.sender == self.admin
    assert pk.address != empty(address)
    for i: uint256 in range(1000):
        _pk: PegKeeper = self.peg_keepers[i]
        assert _pk != pk, "Already added"
        if _pk.address == empty(address):
            self.peg_keepers[i] = pk
            log AddPegKeeper(peg_keeper=pk.address)
            break
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.add_peg_keeper("0x1234567890abcdef1234567890abcdef12345678")
```

</Example>


::::

### `remove_peg_keeper`
::::description[`AggMonetaryPolicy4.remove_peg_keeper(pk: address)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to remove an existing PegKeeper from the monetary policy contract.

| Input | Type      | Description                  |
| ----- | --------- | ---------------------------- |
| `pk`  | `address` | PegKeeper address to remove  |

Emits: `RemovePegKeeper` event.

<SourceCode>

```vyper
event RemovePegKeeper:
    peg_keeper: indexed(address)

peg_keepers: public(PegKeeper[1001])

@external
def remove_peg_keeper(pk: PegKeeper):
    assert msg.sender == self.admin
    replaced_peg_keeper: uint256 = 10000
    for i: uint256 in range(1001):  # 1001th element is always 0x0
        _pk: PegKeeper = self.peg_keepers[i]
        if _pk == pk:
            replaced_peg_keeper = i
            log RemovePegKeeper(peg_keeper=pk.address)
        if _pk.address == empty(address):
            if replaced_peg_keeper < i:
                if replaced_peg_keeper < i - 1:
                    self.peg_keepers[replaced_peg_keeper] = self.peg_keepers[i - 1]
                self.peg_keepers[i - 1] = PegKeeper(empty(address))
            break
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.remove_peg_keeper("0x1234567890abcdef1234567890abcdef12345678")
```

</Example>


::::


## Admin Ownership

### `admin`
::::description[`AggMonetaryPolicy4.admin() -> address: view`]

Getter for the admin of the contract, which is the CurveOwnershipAgent.

Returns: admin (`address`).

<SourceCode>

```vyper
admin: public(address)

@deploy
def __init__(admin: address, ...):
    self.admin = admin
    ...
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function admin() view returns (address)"]} method="admin" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `set_admin`
::::description[`AggMonetaryPolicy4.set_admin(admin: address)`]

:::guard[Guarded Method]
This function is only callable by the `admin` of the contract, which is the CurveOwnershipAgent.
:::

Function to set a new admin.

| Input   | Type      | Description       |
| ------- | --------- | ----------------- |
| `admin` | `address` | New admin address |

Emits: `SetAdmin` event.

<SourceCode>

```vyper
event SetAdmin:
    admin: address

admin: public(address)

@external
def set_admin(admin: address):
    assert msg.sender == self.admin
    self.admin = admin
    log SetAdmin(admin=admin)
```

</SourceCode>

<Example>

```shell
>>> AggMonetaryPolicy4.set_admin("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
```

</Example>


::::


## Contract Info Methods

### `PRICE_ORACLE`
::::description[`AggMonetaryPolicy4.PRICE_ORACLE() -> address: view`]

Getter for the price oracle contract. Immutable variable set at deployment.

Returns: price oracle contract (`address`).

<SourceCode>

```vyper
PRICE_ORACLE: public(immutable(PriceOracle))

@deploy
def __init__(admin: address,
             price_oracle: PriceOracle,
             controller_factory: ControllerFactory, ...):
    ...
    PRICE_ORACLE = price_oracle
    ...
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function PRICE_ORACLE() view returns (address)"]} method="PRICE_ORACLE" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `CONTROLLER_FACTORY`
::::description[`AggMonetaryPolicy4.CONTROLLER_FACTORY() -> address: view`]

Getter for the controller factory contract. Immutable variable set at deployment.

Returns: controller factory contract (`address`).

<SourceCode>

```vyper
CONTROLLER_FACTORY: public(immutable(ControllerFactory))

@deploy
def __init__(admin: address,
             price_oracle: PriceOracle,
             controller_factory: ControllerFactory, ...):
    ...
    CONTROLLER_FACTORY = controller_factory
    ...
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function CONTROLLER_FACTORY() view returns (address)"]} method="CONTROLLER_FACTORY" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `n_controllers`
::::description[`AggMonetaryPolicy4.n_controllers() -> uint256: view`]

Getter for the number of controllers cached in this contract. The controller list is automatically updated when `rate_write` is called and the factory has added new controllers.

Returns: number of cached controllers (`uint256`).

<SourceCode>

```vyper
MAX_CONTROLLERS: constant(uint256) = 50000
n_controllers: public(uint256)
controllers: public(address[MAX_CONTROLLERS])
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function n_controllers() view returns (uint256)"]} method="n_controllers" contractName="AggMonetaryPolicy4" />

</Example>


::::

### `controllers`
::::description[`AggMonetaryPolicy4.controllers(arg0: uint256) -> address: view`]

Getter for the cached controller address at index `arg0`.

| Input  | Type      | Description               |
| ------ | --------- | ------------------------- |
| `arg0` | `uint256` | Index of the controller   |

Returns: controller address (`address`).

<SourceCode>

```vyper
MAX_CONTROLLERS: constant(uint256) = 50000
controllers: public(address[MAX_CONTROLLERS])
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function controllers(uint256) view returns (address)"]} method="controllers" args={["0"]} labels={["arg0"]} contractName="AggMonetaryPolicy4" />

</Example>


::::

### `min_debt_candles`
::::description[`AggMonetaryPolicy4.min_debt_candles(arg0: address) -> (uint256, uint256, uint256): view`]

Getter for the debt candle data for a given controller address. Returns a struct with:

- `candle0`: the earlier half-day candle (minimum debt observed)
- `candle1`: the later half-day candle (minimum debt observed)
- `timestamp`: the last update timestamp

The zero address (`0x0000...`) stores the *total* debt candle across all controllers.

| Input  | Type      | Description                        |
| ------ | --------- | ---------------------------------- |
| `arg0` | `address` | Controller address (or zero for total) |

Returns: candle0 (`uint256`), candle1 (`uint256`), timestamp (`uint256`).

<SourceCode>

```vyper
struct DebtCandle:
    candle0: uint256  # earlier 1/2 day candle
    candle1: uint256  # later 1/2 day candle
    timestamp: uint256

DEBT_CANDLE_TIME: constant(uint256) = 86400 // 2

min_debt_candles: public(HashMap[address, DebtCandle])

@internal
@view
def read_candle(_for: address) -> uint256:
    out: uint256 = 0
    candle: DebtCandle = self.min_debt_candles[_for]

    if block.timestamp < candle.timestamp // DEBT_CANDLE_TIME * DEBT_CANDLE_TIME + DEBT_CANDLE_TIME:
        if candle.candle0 > 0:
            out = min(candle.candle0, candle.candle1)
        else:
            out = candle.candle1
    elif block.timestamp < candle.timestamp // DEBT_CANDLE_TIME * DEBT_CANDLE_TIME + DEBT_CANDLE_TIME * 2:
        out = candle.candle1

    return out

@internal
def save_candle(_for: address, _value: uint256):
    candle: DebtCandle = self.min_debt_candles[_for]

    if candle.timestamp == 0 and _value == 0:
        return

    if block.timestamp >= candle.timestamp // DEBT_CANDLE_TIME * DEBT_CANDLE_TIME + DEBT_CANDLE_TIME:
        if block.timestamp < candle.timestamp // DEBT_CANDLE_TIME * DEBT_CANDLE_TIME + DEBT_CANDLE_TIME * 2:
            candle.candle0 = candle.candle1
            candle.candle1 = _value
        else:
            candle.candle0 = _value
            candle.candle1 = _value
    else:
        candle.candle1 = min(candle.candle1, _value)

    candle.timestamp = block.timestamp
    self.min_debt_candles[_for] = candle
```

</SourceCode>

<Example>

<ContractCall address="0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251" abi={["function min_debt_candles(address) view returns (uint256 candle0, uint256 candle1, uint256 timestamp)"]} method="min_debt_candles" args={["0x0000000000000000000000000000000000000000"]} labels={["arg0"]} contractName="AggMonetaryPolicy4" />

</Example>


::::
