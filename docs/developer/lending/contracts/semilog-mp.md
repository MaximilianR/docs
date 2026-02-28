# Semi-Log Monetary Policy

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The **borrow rate**in the semi-logarithmic MonetaryPolicy contract is **intricately linked to the utilization ratio of the lending markets**. This ratio plays a crucial role in determining the cost of borrowing, with its value ranging between 0 and 1. At a **utilization rate of 0**, indicating no borrowed assets, the borrowing **rate aligns with the minimum threshold, `min_rate`**. Conversely, a **utilization rate of 1**, where all available assets are borrowed, escalates the **borrowing rate to its maximum limit, `max_rate`**.


:::vyper[`SemilogMonetaryPolicy.vy`]

The source code for the `SemilogMonetaryPolicy.vy` contract can be found on [ GitHub](https://github.com/curvefi/curve-stablecoin/blob/lending/contracts/mpolicies/SemilogMonetaryPolicy.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.3.10`.

:::

*The function for the rate is as simple as:*

$$\text\{rate\} = \text\{rate\}_\{\text\{min\}\} \cdot \left(\frac\{\text\{rate\}_\{\text\{max\}\}\}\{\text\{rate\}_\{\text\{min\}\}\}\right)^\{\text\{utilization\}\}$$

| Variable | Description |
| :------: | ----------- |
| $\text{rate}_{\text{min}}$ | `MonetaryPolicy.min_rate()` |
| $\text{rate}_{\text{max}}$ | `MonetaryPolicy.max_rate()` |
| $\text{utilization}$ | `Utilization of the lending market. What ratio of the provided assets are borrowed?` |

---

*A graph to display the interplay between `min_rate`, `max_rate`, and market utilization:[^1]*

[^1]: For simplicity, the minimum input value is set at 1% and the maximum at 100%. In reality, these values can range from 0.01% to 1000%. 


<div class="input-group">
    <label for="min_rate">Minimum Rate (%):</label>
    <input class="rate-input" type="number" id="min_rate" value="5" min="1" max="100" />
</div>

<div class="input-group">
    <label for="max_rate">Maximum Rate (%):</label>
    <input class="rate-input" type="number" id="max_rate" value="50" min="2" max="100" />
</div>

<canvas id="graphContainer"></canvas>


---


## Rates**The rate values are based on 1e18 and NOT annualized.***To calculate the Borrow APR:*

$$\text\{borrowAPR\} = \frac\{\text\{rate\} * 365 * 86400\}\{10^\{18\}\}$$

Rate calculations occur within the MonetaryPolicy contract. The rate is regularly updated by the internal `_save_rate` method in the Controller. This happens whenever a new loan is initiated (`_create_loan`), collateral is either added (`add_collateral`) or removed (`remove_collateral`), additional debt is incurred (`borrow_more` and `borrow_more_extended`), debt is repaid (`repay`, `repay_extended`), or a loan undergoes liquidation (`_liquidate`).


<SourceCode>


<Tabs>
<TabItem value="controller-vy" label="Controller.vy">


```vyper
@internal
def _save_rate():
    """
    @notice Save current rate
    """
    rate: uint256 = min(self.monetary_policy.rate_write(), MAX_RATE)
    AMM.set_rate(rate)
```


</TabItem>
</Tabs>

<Tabs>
<TabItem value="monetarypolicy-vy" label="MonetaryPolicy.vy">


```vyper
log_min_rate: public(int256)
log_max_rate: public(int256)

@internal
@external
def rate_write(_for: address = msg.sender) -> uint256:
    return self.calculate_rate(_for, 0, 0)

@internal
@view
def calculate_rate(_for: address, d_reserves: int256, d_debt: int256) -> uint256:
    total_debt: int256 = convert(Controller(_for).total_debt(), int256)
    total_reserves: int256 = convert(BORROWED_TOKEN.balanceOf(_for), int256) + total_debt + d_reserves
    total_debt += d_debt
    assert total_debt >= 0, "Negative debt"
    assert total_reserves >= total_debt, "Reserves too small"
    if total_debt == 0:
        return self.min_rate
    else:
        log_min_rate: int256 = self.log_min_rate
        log_max_rate: int256 = self.log_max_rate
        return self.exp(total_debt * (log_max_rate - log_min_rate) / total_reserves + log_min_rate)
```


</TabItem>
</Tabs>

<Tabs>
<TabItem value="amm-vy" label="AMM.vy">


```vyper
@external
@nonreentrant('lock')
def set_rate(rate: uint256) -> uint256:
    """
    @notice Set interest rate. That affects the dependence of AMM base price over time
    @param rate New rate in units of int(fraction * 1e18) per second
    @return rate_mul multiplier (e.g. 1.0 + integral(rate, dt))
    """
    assert msg.sender == self.admin
    rate_mul: uint256 = self._rate_mul()
    self.rate_mul = rate_mul
    self.rate_time = block.timestamp
    self.rate = rate
    log SetRate(rate, rate_mul, block.timestamp)
    return rate_mul
```


</TabItem>
</Tabs>


</SourceCode>

### `rate`
::::description[`SemiLogMonetaryPolicy.rate(_for: address = msg.sender) -> uint256`]


Getter for the borrow rate for a specific lending market.

Returns: rate (`uint256`).

| Input      | Type      | Description    |
| ---------- | --------- | -------------- |
| `_for`     | `address` | Controller contract; Defaults to `msg.sender`, because the caller of the function is usually the Controller. |

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
@view
@external
def rate(_for: address = msg.sender) -> uint256:
    return self.calculate_rate(_for, 0, 0)

@internal
@view
def calculate_rate(_for: address, d_reserves: int256, d_debt: int256) -> uint256:
    total_debt: int256 = convert(Controller(_for).total_debt(), int256)
    total_reserves: int256 = convert(BORROWED_TOKEN.balanceOf(_for), int256) + total_debt + d_reserves
    total_debt += d_debt
    assert total_debt >= 0, "Negative debt"
    assert total_reserves >= total_debt, "Reserves too small"
    if total_debt == 0:
        return self.min_rate
    else:
        log_min_rate: int256 = self.log_min_rate
        log_max_rate: int256 = self.log_max_rate
        return self.exp(total_debt * (log_max_rate - log_min_rate) / total_reserves + log_min_rate)
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.rate("0x7443944962D04720f8c220C0D25f56F869d6EfD4")
Out [1]:  6113754953
```


</Example>


::::

### `future_rate`
::::description[`SemiLogMonetaryPolicy.future_rate(_for: address, d_reserves: int256, d_debt: int256) -> uint256`]


Function to calculate the future borrow rate for a lending market given a specific change of reserves and debt.

Returns: future borrow rate (`uint256`).

| Input        | Type      | Description    |
| ------------ | --------- | -------------- |
| `_for`       | `address` | Controller address. |
| `d_reserves` | `int256`  | Change of reserve asset. |
| `d_debt`     | `int256`  | Change of debt. |

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


    ```vyper
    @view
    @external
    def future_rate(_for: address, d_reserves: int256, d_debt: int256) -> uint256:
        return self.calculate_rate(_for, d_reserves, d_debt)

    @internal
    @view
    def calculate_rate(_for: address, d_reserves: int256, d_debt: int256) -> uint256:
        total_debt: int256 = convert(Controller(_for).total_debt(), int256)
        total_reserves: int256 = convert(BORROWED_TOKEN.balanceOf(_for), int256) + total_debt + d_reserves
        total_debt += d_debt
        assert total_debt >= 0, "Negative debt"
        assert total_reserves >= total_debt, "Reserves too small"
        if total_debt == 0:
            return self.min_rate
        else:
            log_min_rate: int256 = self.log_min_rate
            log_max_rate: int256 = self.log_max_rate
            return self.exp(total_debt * (log_max_rate - log_min_rate) / total_reserves + log_min_rate)
    ```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.future_rate(controller.address, 0, 10000000000000000000000)
Out [1]:  7882992245
```


</Example>


::::

### `rate_write`
::::description[`SemiLogMonetaryPolicy.rate_write(_for: address = msg.sender) -> uint256:`]


Function to update the rate of a lending market.

Returns: rate (`uint256`)

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
@external
def rate_write(_for: address = msg.sender) -> uint256:
    return self.calculate_rate(_for, 0, 0)
    
@internal
@view
def calculate_rate(_for: address, d_reserves: int256, d_debt: int256) -> uint256:
    total_debt: int256 = convert(Controller(_for).total_debt(), int256)
    total_reserves: int256 = convert(BORROWED_TOKEN.balanceOf(_for), int256) + total_debt + d_reserves
    total_debt += d_debt
    assert total_debt >= 0, "Negative debt"
    assert total_reserves >= total_debt, "Reserves too small"
    if total_debt == 0:
        return self.min_rate
    else:
        log_min_rate: int256 = self.log_min_rate
        log_max_rate: int256 = self.log_max_rate
        return self.exp(total_debt * (log_max_rate - log_min_rate) / total_reserves + log_min_rate)
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.rate_write()
Out [1]:  6113754953
```


</Example>


::::

---


## Changing Rates

Rates within the MonetaryPolicy contract can only be **changed by the `admin` of the lending factory**, which is the Curve DAO.

*A short overview of the different parameters:*

| Variable       | Description                                           |
| :------------: | ----------------------------------------------------- |
| `min_rate`     | Current minimum rate set within the MP contract.      |
| `max_rate`     | Current maximum rate set within the MP contract.      |
| `log_min_rate` | Logarithm ln() function of `min_rate`, based on log2. |
| `log_max_rate` | Logarithm ln() function of `max_rate`, based on log2. |
| `MIN_RATE`     | Absolute minimum rate settable.                       |
| `MAX_RATE`     | Absolute maximum rate settable.                       |


### `set_rates`
::::description[`SemiLogMonetaryPolicy.set_rates(min_rate: uint256, max_rate: uint256)`]


:::guard[Guarded Methods]

This function can only be called by the `admin` of `FACTORY`.


:::

Function to set new values for `min_rate` and `max_rate`, and consequently `log_min_rate` and `log_max_rate` as well. New rate values can be chosen quite deliberately, but need to be **within the bounds of `MIN_RATE` and `MAX_RATE`**:

- `MIN_RATE = 31709791 (0.01%)`
- `MAX_RATE = 317097919837 (1000%)`

Emits: `SetRates`

| Input      | Type      | Description    |
| ---------- | --------- | -------------- |
| `min_rate` | `uint256` | New value for the minimum rate. |
| `max_rate` | `uint256` | New value for the maximum rate. |

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
event SetRates:
    min_rate: uint256
    max_rate: uint256

min_rate: public(uint256)
max_rate: public(uint256)
log_min_rate: public(int256)
log_max_rate: public(int256)

@external
def set_rates(min_rate: uint256, max_rate: uint256):
    assert msg.sender == FACTORY.admin()

    assert max_rate >= min_rate
    assert min_rate >= MIN_RATE
    assert max_rate <= MAX_RATE

    if min_rate != self.min_rate:
        self.log_min_rate = self.ln_int(min_rate)
    if max_rate != self.max_rate:
        self.log_max_rate = self.ln_int(max_rate)
    self.min_rate = min_rate
    self.max_rate = max_rate

    log SetRates(min_rate, max_rate)
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.min_rate()
Out [1]:  158548959

In  [2]:  SemilogMonetaryPolicy.set_rates(31709791, 317097919837)

In  [3]:  SemilogMonetaryPolicy.min_rate()
Out [3]:  31709791
```


</Example>


::::

### `min_rate`
::::description[`SemiLogMonetaryPolicy.min_rate() -> uint256: view`]


Getter for the current minimum borrow rate. This value is set to the input given for `min_default_borrow_rate` when [creating a new market](./oneway-factory.md#creating-lending-markets). The rate is charged when utilization is 0 and can be changed by the admin of the lending factory.

Returns: minimum interest rate (`uint256`).

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
min_rate: public(uint256)

@external
def __init__(borrowed_token: ERC20, min_rate: uint256, max_rate: uint256):
    assert min_rate >= MIN_RATE and max_rate <= MAX_RATE and min_rate <= max_rate, "Wrong rates"

    BORROWED_TOKEN = borrowed_token
    self.min_rate = min_rate
    self.max_rate = max_rate
    self.log_min_rate = self.ln_int(min_rate)
    self.log_max_rate = self.ln_int(max_rate)

    FACTORY = Factory(msg.sender)
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.min_rate()
Out [1]:  158548959
```


</Example>


::::

### `max_rate`
::::description[`SemiLogMonetaryPolicy.max_rate() -> uint256: view`]


Getter for the current maximum borrow rate. This value is set to the input given for `max_default_borrow_rate` when [creating a new market](./oneway-factory.md#creating-lending-markets). The rate is charged when utilization is 1 and can be changed by the admin of the lending factory.

Returns: maximum interest rate (`uint256`).

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
max_rate: public(uint256)

@external
def __init__(borrowed_token: ERC20, min_rate: uint256, max_rate: uint256):
    assert min_rate >= MIN_RATE and max_rate <= MAX_RATE and min_rate <= max_rate, "Wrong rates"

    BORROWED_TOKEN = borrowed_token
    self.min_rate = min_rate
    self.max_rate = max_rate
    self.log_min_rate = self.ln_int(min_rate)
    self.log_max_rate = self.ln_int(max_rate)

    FACTORY = Factory(msg.sender)
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.max_rate()
Out [1]:  15854895991
```


</Example>


::::

### `log_min_rate`
::::description[`SemiLogMonetaryPolicy.log_min_rate() -> int256: view`]


Getter for the logarithm ln() function of `min_rate`, based on log2.

Returns: semi-log minimum rate (`int256`).

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
log_min_rate: public(int256)

@external
def __init__(borrowed_token: ERC20, min_rate: uint256, max_rate: uint256):
    assert min_rate >= MIN_RATE and max_rate <= MAX_RATE and min_rate <= max_rate, "Wrong rates"

    BORROWED_TOKEN = borrowed_token
    self.min_rate = min_rate
    self.max_rate = max_rate
    self.log_min_rate = self.ln_int(min_rate)
    self.log_max_rate = self.ln_int(max_rate)

    FACTORY = Factory(msg.sender)

@internal
@pure
def ln_int(_x: uint256) -> int256:
    """
    @notice Logarithm ln() function based on log2. Not very gas-efficient but brief
    """
    # adapted from: https://medium.com/coinmonks/9aef8515136e
    # and vyper log implementation
    # This can be much more optimal but that's not important here
    x: uint256 = _x
    if _x < 10**18:
        x = 10**36 / _x
    res: uint256 = 0
    for i in range(8):
        t: uint256 = 2**(7 - i)
        p: uint256 = 2**t
        if x >= p * 10**18:
            x /= p
            res += t * 10**18
    d: uint256 = 10**18
    for i in range(59):  # 18 decimals: math.log2(10**18) == 59.7
        if (x >= 2 * 10**18):
            res += d
            x /= 2
        x = x * x / 10**18
        d /= 2
    # Now res = log2(x)
    # ln(x) = log2(x) / log2(e)
    result: int256 = convert(res * 10**18 / 1442695040888963328, int256)
    if _x >= 10**18:
        return result
    else:
        return -result
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.log_min_rate()
Out [1]:  -22564957680717876419
```


</Example>


::::

### `log_max_rate`
::::description[`SemiLogMonetaryPolicy.log_max_rate() -> int256: view`]


Getter for the logarithm ln() function of `max_rate`, based on log2.

Returns: semi-log maximum rate (`int256`).

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
log_max_rate: public(int256)

@external
def __init__(borrowed_token: ERC20, min_rate: uint256, max_rate: uint256):
    assert min_rate >= MIN_RATE and max_rate <= MAX_RATE and min_rate <= max_rate, "Wrong rates"

    BORROWED_TOKEN = borrowed_token
    self.min_rate = min_rate
    self.max_rate = max_rate
    self.log_min_rate = self.ln_int(min_rate)
    self.log_max_rate = self.ln_int(max_rate)

    FACTORY = Factory(msg.sender)

@internal
@pure
def ln_int(_x: uint256) -> int256:
    """
    @notice Logarithm ln() function based on log2. Not very gas-efficient but brief
    """
    # adapted from: https://medium.com/coinmonks/9aef8515136e
    # and vyper log implementation
    # This can be much more optimal but that's not important here
    x: uint256 = _x
    if _x < 10**18:
        x = 10**36 / _x
    res: uint256 = 0
    for i in range(8):
        t: uint256 = 2**(7 - i)
        p: uint256 = 2**t
        if x >= p * 10**18:
            x /= p
            res += t * 10**18
    d: uint256 = 10**18
    for i in range(59):  # 18 decimals: math.log2(10**18) == 59.7
        if (x >= 2 * 10**18):
            res += d
            x /= 2
        x = x * x / 10**18
        d /= 2
    # Now res = log2(x)
    # ln(x) = log2(x) / log2(e)
    result: int256 = convert(res * 10**18 / 1442695040888963328, int256)
    if _x >= 10**18:
        return result
    else:
        return -result
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.log_max_rate()
Out [1]:  -17959787488990232781
```


</Example>


::::

### `MIN_RATE`
::::description[`SemiLogMonetaryPolicy.MIN_RATE() -> uint256: view`]


Getter for the lowest possible rate for the MonetaryPolicy. When setting new rates via `set_rates()`, `MIN_RATE` is the lowest possible value. This variable is a constant and therefore cannot be changed.

Returns: absolute minimum rate (`uint256`).

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
MIN_RATE: public(constant(uint256)) = 10**15 / (365 * 86400)  # 0.1%
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.MIN_RATE()
Out [1]:  31709791
```


</Example>


::::

### `MAX_RATE`
::::description[`SemiLogMonetaryPolicy.MAX_RATE() -> uint256: view`]


Getter for the highest possible rate for the MonetaryPolicy. When setting new rates via `set_rates()`, `MAX_RATE` is the highest possible value. This variable is a constant and therefore cannot be changed.

Returns: absolute maximum rate (`uint256`).

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
MAX_RATE: public(constant(uint256)) = 10**19 / (365 * 86400)  # 1000%
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.MAX_RATE()
Out [1]:  317097919837
```


</Example>


::::

---


## Contract Info Methods

### `BORROWED_TOKEN`
::::description[`SemiLogMonetaryPolicy.BORROWED_TOKEN() -> address: view`]


Getter for the borrowed token. This is a immutable variable and is set at deployment (`__init__()`).

Returns: borrowable token from the lending market (`address`)

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
BORROWED_TOKEN: public(immutable(ERC20))

@external
def __init__(borrowed_token: ERC20, min_rate: uint256, max_rate: uint256):
    assert min_rate >= MIN_RATE and max_rate <= MAX_RATE and min_rate <= max_rate, "Wrong rates"

    BORROWED_TOKEN = borrowed_token
    self.min_rate = min_rate
    self.max_rate = max_rate
    self.log_min_rate = self.ln_int(min_rate)
    self.log_max_rate = self.ln_int(max_rate)

    FACTORY = Factory(msg.sender)
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.BORROWED_TOKEN()
Out [1]:  '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E'
```


</Example>


::::

### `FACTORY`
::::description[`SemiLogMonetaryPolicy.FACTORY() -> address: view`]


Getter for the Factory contract. This is a immutable variable and is set at deployment (`__init__()`).

Returns: Factory (`address`).

<SourceCode>


<Tabs>
<TabItem value="semilogmonetarypolicy-vy" label="SemilogMonetaryPolicy.vy">


```vyper
FACTORY: public(immutable(Factory))

@external
def __init__(borrowed_token: ERC20, min_rate: uint256, max_rate: uint256):
    assert min_rate >= MIN_RATE and max_rate <= MAX_RATE and min_rate <= max_rate, "Wrong rates"

    BORROWED_TOKEN = borrowed_token
    self.min_rate = min_rate
    self.max_rate = max_rate
    self.log_min_rate = self.ln_int(min_rate)
    self.log_max_rate = self.ln_int(max_rate)

    FACTORY = Factory(msg.sender)
```


</TabItem>
</Tabs>


</SourceCode>

<Example>

```shell
In  [1]:  SemilogMonetaryPolicy.FACTORY()
Out [1]:  '0xc67a44D958eeF0ff316C3a7c9E14FB96f6DedAA3'
```

</Example>


::::
