# GaugeController

The `GaugeController` contract is responsible for managing and coordinating the distribution of rewards to liquidity providers in various liquidity pools. It **determines the allocation of CRV emissions based on the liquidity provided** by users. By analyzing the gauges, which are parameters that define how rewards are distributed across different pools, the GaugeController ensures a fair and balanced distribution of incentives, encouraging liquidity provision and participation in Curve's ecosystem.


:::vyper[`GaugeController.vy`]

The source code for the `GaugeController.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-dao-contracts/blob/master/contracts/GaugeController.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.2.4`.

The contract is deployed on :logos-ethereum: Ethereum at [`0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB`](https://etherscan.io/address/0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB).

<ContractABI>


```json
[{"name":"CommitOwnership","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"name":"ApplyOwnership","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"name":"AddType","inputs":[{"type":"string","name":"name","indexed":false},{"type":"int128","name":"type_id","indexed":false}],"anonymous":false,"type":"event"},{"name":"NewTypeWeight","inputs":[{"type":"int128","name":"type_id","indexed":false},{"type":"uint256","name":"time","indexed":false},{"type":"uint256","name":"weight","indexed":false},{"type":"uint256","name":"total_weight","indexed":false}],"anonymous":false,"type":"event"},{"name":"NewGaugeWeight","inputs":[{"type":"address","name":"gauge_address","indexed":false},{"type":"uint256","name":"time","indexed":false},{"type":"uint256","name":"weight","indexed":false},{"type":"uint256","name":"total_weight","indexed":false}],"anonymous":false,"type":"event"},{"name":"VoteForGauge","inputs":[{"type":"uint256","name":"time","indexed":false},{"type":"address","name":"user","indexed":false},{"type":"address","name":"gauge_addr","indexed":false},{"type":"uint256","name":"weight","indexed":false}],"anonymous":false,"type":"event"},{"name":"NewGauge","inputs":[{"type":"address","name":"addr","indexed":false},{"type":"int128","name":"gauge_type","indexed":false},{"type":"uint256","name":"weight","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[{"type":"address","name":"_token"},{"type":"address","name":"_voting_escrow"}],"stateMutability":"nonpayable","type":"constructor"},{"name":"commit_transfer_ownership","outputs":[],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"nonpayable","type":"function","gas":37597},{"name":"apply_transfer_ownership","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":38497},{"name":"gauge_types","outputs":[{"type":"int128","name":""}],"inputs":[{"type":"address","name":"_addr"}],"stateMutability":"view","type":"function","gas":1625},{"name":"add_gauge","outputs":[],"inputs":[{"type":"address","name":"addr"},{"type":"int128","name":"gauge_type"}],"stateMutability":"nonpayable","type":"function"},{"name":"add_gauge","outputs":[],"inputs":[{"type":"address","name":"addr"},{"type":"int128","name":"gauge_type"},{"type":"uint256","name":"weight"}],"stateMutability":"nonpayable","type":"function"},{"name":"checkpoint","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":18033784416},{"name":"checkpoint_gauge","outputs":[],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"nonpayable","type":"function","gas":18087678795},{"name":"gauge_relative_weight","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"view","type":"function"},{"name":"gauge_relative_weight","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"},{"type":"uint256","name":"time"}],"stateMutability":"view","type":"function"},{"name":"gauge_relative_weight_write","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"nonpayable","type":"function"},{"name":"gauge_relative_weight_write","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"},{"type":"uint256","name":"time"}],"stateMutability":"nonpayable","type":"function"},{"name":"add_type","outputs":[],"inputs":[{"type":"string","name":"_name"}],"stateMutability":"nonpayable","type":"function"},{"name":"add_type","outputs":[],"inputs":[{"type":"string","name":"_name"},{"type":"uint256","name":"weight"}],"stateMutability":"nonpayable","type":"function"},{"name":"change_type_weight","outputs":[],"inputs":[{"type":"int128","name":"type_id"},{"type":"uint256","name":"weight"}],"stateMutability":"nonpayable","type":"function","gas":36246310050},{"name":"change_gauge_weight","outputs":[],"inputs":[{"type":"address","name":"addr"},{"type":"uint256","name":"weight"}],"stateMutability":"nonpayable","type":"function","gas":36354170809},{"name":"vote_for_gauge_weights","outputs":[],"inputs":[{"type":"address","name":"_gauge_addr"},{"type":"uint256","name":"_user_weight"}],"stateMutability":"nonpayable","type":"function","gas":18142052127},{"name":"get_gauge_weight","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"view","type":"function","gas":2974},{"name":"get_type_weight","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"int128","name":"type_id"}],"stateMutability":"view","type":"function","gas":2977},{"name":"get_total_weight","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2693},{"name":"get_weights_sum_per_type","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"int128","name":"type_id"}],"stateMutability":"view","type":"function","gas":3109},{"name":"admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1841},{"name":"future_admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1871},{"name":"token","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1901},{"name":"voting_escrow","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1931},{"name":"n_gauge_types","outputs":[{"type":"int128","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1961},{"name":"n_gauges","outputs":[{"type":"int128","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1991},{"name":"gauge_type_names","outputs":[{"type":"string","name":""}],"inputs":[{"type":"int128","name":"arg0"}],"stateMutability":"view","type":"function","gas":8628},{"name":"gauges","outputs":[{"type":"address","name":""}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function","gas":2160},{"name":"vote_user_slopes","outputs":[{"type":"uint256","name":"slope"},{"type":"uint256","name":"power"},{"type":"uint256","name":"end"}],"inputs":[{"type":"address","name":"arg0"},{"type":"address","name":"arg1"}],"stateMutability":"view","type":"function","gas":5020},{"name":"vote_user_power","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":2265},{"name":"last_user_vote","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"arg0"},{"type":"address","name":"arg1"}],"stateMutability":"view","type":"function","gas":2449},{"name":"points_weight","outputs":[{"type":"uint256","name":"bias"},{"type":"uint256","name":"slope"}],"inputs":[{"type":"address","name":"arg0"},{"type":"uint256","name":"arg1"}],"stateMutability":"view","type":"function","gas":3859},{"name":"time_weight","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":2355},{"name":"points_sum","outputs":[{"type":"uint256","name":"bias"},{"type":"uint256","name":"slope"}],"inputs":[{"type":"int128","name":"arg0"},{"type":"uint256","name":"arg1"}],"stateMutability":"view","type":"function","gas":3970},{"name":"time_sum","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function","gas":2370},{"name":"points_total","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function","gas":2406},{"name":"time_total","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2321},{"name":"points_type_weight","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"int128","name":"arg0"},{"type":"uint256","name":"arg1"}],"stateMutability":"view","type":"function","gas":2671},{"name":"time_type_weight","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function","gas":2490}]
```

</ContractABI>

:::

The contract also **acts as a registry for the gauges**, storing information such as the gauge data, minted amounts, and more.

---

## Adding Gauges and Gauge Data

After a liquidity gauge was deployed, it can be added to the `GaugeController` for it to be eligible to receive CRV emissions. Adding a gauge requires a successfully passed DAO vote.

:::info[Check if a Gauge has been added to the GaugeController]


The contract does not have a public getter to check whether a gauge has been added. Alternatively, one can try to query the `gauge_types` of the gauge.

```shell
>>> GaugeController.gauge_types('0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a')
0

>>> GaugeController.gauge_types('0xc840e5ed7a1b6a9c1a6bf1ecaca6ddb151b2fd6e')
Error: Returned error: execution reverted
```

If the gauge returns an `int128`, this means the gauge has been added. The returned value represents the [gauge type](#gauge_types). If the query call reverts, this means the gauge has not been added.


:::

### `add_gauge`
::::description[`GaugeController.add_gauge(addr: address, gauge_type: int128, weight: uint256 = 0)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract. The `admin` in this case is the Curve DAO. So, adding a gauge to the `GaugeController` is in the hands of the DAO.


:::

:::warning

Once a gauge has been added, it cannot be removed. Therefore, new gauges should undergo thorough verification by the community before being added to the `GaugeController`. However, it is possible to 'kill' a gauge, which sets its emission rate to zero. As a result, a 'killed' gauge becomes ineligible for any CRV emissions.


:::

Function to add a new gauge to the `GaugeController`. Doing this makes the gauge eligible to receive CRV emissions.

| Input      | Type       | Description |
| ----------- | --------- | ----------- |
| `addr`      | `address` | Gauge address |
| `gauge_type`| `int128`  | Gauge type |
| `weight`    | `uint256` | Gauge weight; defaults to 0 |

Emits: `NewGauge` event.

<SourceCode>

```vyper
event NewGauge:
    addr: address
    gauge_type: int128
    weight: uint256

@external
def add_gauge(addr: address, gauge_type: int128, weight: uint256 = 0):
    """
    @notice Add gauge `addr` of type `gauge_type` with weight `weight`
    @param addr Gauge address
    @param gauge_type Gauge type
    @param weight Gauge weight
    """
    assert msg.sender == self.admin
    assert (gauge_type >= 0) and (gauge_type < self.n_gauge_types)
    assert self.gauge_types_[addr] == 0  # dev: cannot add the same gauge twice

    n: int128 = self.n_gauges
    self.n_gauges = n + 1
    self.gauges[n] = addr

    self.gauge_types_[addr] = gauge_type + 1
    next_time: uint256 = (block.timestamp + WEEK) / WEEK * WEEK

    if weight > 0:
        _type_weight: uint256 = self._get_type_weight(gauge_type)
        _old_sum: uint256 = self._get_sum(gauge_type)
        _old_total: uint256 = self._get_total()

        self.points_sum[gauge_type][next_time].bias = weight + _old_sum
        self.time_sum[gauge_type] = next_time
        self.points_total[next_time] = _old_total + _type_weight * weight
        self.time_total = next_time

        self.points_weight[addr][next_time].bias = weight

    if self.time_sum[gauge_type] == 0:
        self.time_sum[gauge_type] = next_time
    self.time_weight[addr] = next_time

    log NewGauge(addr, gauge_type, weight)
```

</SourceCode>

<Example>

This example adds the gauge at address `0x41af8cC0811DD07F167752B821CF5B11DBa7Ca85` to the `GaugeController`.

```shell
>>> GaugeController.add_gauge('0x41af8cC0811DD07F167752B821CF5B11DBa7Ca85')
```

</Example>


::::

### `gauges`
::::description[`GaugeController.gauges(arg0: uint256) -> address: view`]


Getter for the gauge address at a specific index. Every time a new gauge is added, the variable is populated with the new gauge address. Index 0 equals to the first gauge added.

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `arg0` | `uint256` | Gauge index |

Returns: gauge (`address`).

<SourceCode>

```vyper
# Needed for enumeration
gauges: public(address[1000000000])
```

</SourceCode>

<Example>

This example returns the gauge address at index 0. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function gauges(uint256 arg0) view returns (address)"]}
  method="gauges"
  args={["0"]}
  labels={["arg0"]}
  contractName="GaugeController"
/>

</Example>


::::

### `n_gauges`
::::description[`GaugeController.n_gauges() -> int128: view`]


Getter for the total number of gauges added to the `GaugeController`. This variable is incremented by one each time a new gauge is added via the `add_gauge` function.

Returns: total number of gauges (`int128`).

<SourceCode>

```vyper
n_gauges: public(int128)
```

</SourceCode>

<Example>

This example returns the total number of gauges. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function n_gauges() view returns (int128)"]}
  method="n_gauges"
  contractName="GaugeController"
/>

</Example>


::::

---

## Vote-Weighting and Gauge Weights

Users who have a positive veCRV balance can use their voting power to vote for specific gauges. Only gauges who have been added to the `GaugeController` by the DAO can be voted for. These gauge weights define how much CRV emissions a gauge receives.

Users do not need to allocate 100% of their voting power to a single gauge. They can distribute their voting power across multiple gauges.

Gauge weights are updated every Thursday at 00:00 UTC. At this timestamp, the CRV emissions for one week are based on the gauge weights. The current weights remain the same until someone votes. If there are no votes for several weeks in a row, the gauge weights and CRV emissions will stay the same for all subsequent weeks.

:::example[Example: CRV emissions and Gauge Weights]


If a gauge receives 10% of the total weight, it will receive 10% of the emissions for the current week. 

At the time of writing, the inflation rate per second of CRV is `5181574864521283150 (CRV.rate())`, which equals 5.18157486452128315 CRV per second.
The gauge will, therefore, receive approximately 313,381.65 CRV tokens as emissions for the current week, calculated as 5.18157486452128315 CRV per second * 10% * (7 * 86400 seconds).


:::

### `vote_for_gauge_weights`
::::description[`GaugeController.vote_for_gauge_weights(_gauge_addr: address, _user_weight: uint256)`]


:::warning[`WEIGHT_VOTE_DELAY`]

Gauge weight votes may only be modified once every 10 days.


:::

Function to allocate a specific amount of voting power to a gauge. The voting power is expressed and measured in bps (units of 0.01%). Minimal weight is 0.01%.

| Input          | Type       | Description   |
| -------------- | ---------- | ------------- |
| `_gauge_addr`  |  `address` | Gauge address to allocate weight to |
| `_user_weight` |  `uint256` | Weight to allocate |

Emits: `VoteForGauge` event.

<SourceCode>

```vyper
event VoteForGauge:
    time: uint256
    user: address
    gauge_addr: address
    weight: uint256

# Cannot change weight votes more often than once in 10 days
WEIGHT_VOTE_DELAY: constant(uint256) = 10 * 86400

vote_user_slopes: public(HashMap[address, HashMap[address, VotedSlope]])  # user -> gauge_addr -> VotedSlope
vote_user_power: public(HashMap[address, uint256])  # Total vote power used by user
last_user_vote: public(HashMap[address, HashMap[address, uint256]])  # Last user vote's timestamp for each gauge address

# Past and scheduled points for gauge weight, sum of weights per type, total weight
# Point is for bias+slope
# changes_* are for changes in slope
# time_* are for the last change timestamp
# timestamps are rounded to whole weeks

points_weight: public(HashMap[address, HashMap[uint256, Point]])  # gauge_addr -> time -> Point
changes_weight: HashMap[address, HashMap[uint256, uint256]]  # gauge_addr -> time -> slope
time_weight: public(HashMap[address, uint256])  # gauge_addr -> last scheduled time (next week)

points_sum: public(HashMap[int128, HashMap[uint256, Point]])  # type_id -> time -> Point
changes_sum: HashMap[int128, HashMap[uint256, uint256]]  # type_id -> time -> slope
time_sum: public(uint256[1000000000])  # type_id -> last scheduled time (next week)

points_total: public(HashMap[uint256, uint256])  # time -> total weight
time_total: public(uint256)  # last scheduled time

points_type_weight: public(HashMap[int128, HashMap[uint256, uint256]])  # type_id -> time -> type weight
time_type_weight: public(uint256[1000000000])  # type_id -> last scheduled time (next week)

@external
def vote_for_gauge_weights(_gauge_addr: address, _user_weight: uint256):
    """
    @notice Allocate voting power for changing pool weights
    @param _gauge_addr Gauge which `msg.sender` votes for
    @param _user_weight Weight for a gauge in bps (units of 0.01%). Minimal is 0.01%. Ignored if 0
    """
    escrow: address = self.voting_escrow
    slope: uint256 = convert(VotingEscrow(escrow).get_last_user_slope(msg.sender), uint256)
    lock_end: uint256 = VotingEscrow(escrow).locked__end(msg.sender)
    _n_gauges: int128 = self.n_gauges
    next_time: uint256 = (block.timestamp + WEEK) / WEEK * WEEK
    assert lock_end > next_time, "Your token lock expires too soon"
    assert (_user_weight >= 0) and (_user_weight <= 10000), "You used all your voting power"
    assert block.timestamp >= self.last_user_vote[msg.sender][_gauge_addr] + WEIGHT_VOTE_DELAY, "Cannot vote so often"

    gauge_type: int128 = self.gauge_types_[_gauge_addr] - 1
    assert gauge_type >= 0, "Gauge not added"
    # Prepare slopes and biases in memory
    old_slope: VotedSlope = self.vote_user_slopes[msg.sender][_gauge_addr]
    old_dt: uint256 = 0
    if old_slope.end > next_time:
        old_dt = old_slope.end - next_time
    old_bias: uint256 = old_slope.slope * old_dt
    new_slope: VotedSlope = VotedSlope({
        slope: slope * _user_weight / 10000,
        end: lock_end,
        power: _user_weight
    })
    new_dt: uint256 = lock_end - next_time  # dev: raises when expired
    new_bias: uint256 = new_slope.slope * new_dt

    # Check and update powers (weights) used
    power_used: uint256 = self.vote_user_power[msg.sender]
    power_used = power_used + new_slope.power - old_slope.power
    self.vote_user_power[msg.sender] = power_used
    assert (power_used >= 0) and (power_used <= 10000), 'Used too much power'

    ## Remove old and schedule new slope changes
    # Remove slope changes for old slopes
    # Schedule recording of initial slope for next_time
    old_weight_bias: uint256 = self._get_weight(_gauge_addr)
    old_weight_slope: uint256 = self.points_weight[_gauge_addr][next_time].slope
    old_sum_bias: uint256 = self._get_sum(gauge_type)
    old_sum_slope: uint256 = self.points_sum[gauge_type][next_time].slope

    self.points_weight[_gauge_addr][next_time].bias = max(old_weight_bias + new_bias, old_bias) - old_bias
    self.points_sum[gauge_type][next_time].bias = max(old_sum_bias + new_bias, old_bias) - old_bias
    if old_slope.end > next_time:
        self.points_weight[_gauge_addr][next_time].slope = max(old_weight_slope + new_slope.slope, old_slope.slope) - old_slope.slope
        self.points_sum[gauge_type][next_time].slope = max(old_sum_slope + new_slope.slope, old_slope.slope) - old_slope.slope
    else:
        self.points_weight[_gauge_addr][next_time].slope += new_slope.slope
        self.points_sum[gauge_type][next_time].slope += new_slope.slope
    if old_slope.end > block.timestamp:
        # Cancel old slope changes if they still didn't happen
        self.changes_weight[_gauge_addr][old_slope.end] -= old_slope.slope
        self.changes_sum[gauge_type][old_slope.end] -= old_slope.slope
    # Add slope changes for new slopes
    self.changes_weight[_gauge_addr][new_slope.end] += new_slope.slope
    self.changes_sum[gauge_type][new_slope.end] += new_slope.slope

    self._get_total()

    self.vote_user_slopes[msg.sender][_gauge_addr] = new_slope

    # Record last action time
    self.last_user_vote[msg.sender][_gauge_addr] = block.timestamp

    log VoteForGauge(block.timestamp, msg.sender, _gauge_addr, _user_weight)

@internal
def _get_total() -> uint256:
    """
    @notice Fill historic total weights week-over-week for missed checkins
            and return the total for the future week
    @return Total weight
    """
    t: uint256 = self.time_total
    _n_gauge_types: int128 = self.n_gauge_types
    if t > block.timestamp:
        # If we have already checkpointed - still need to change the value
        t -= WEEK
    pt: uint256 = self.points_total[t]

    for gauge_type in range(100):
        if gauge_type == _n_gauge_types:
            break
        self._get_sum(gauge_type)
        self._get_type_weight(gauge_type)

    for i in range(500):
        if t > block.timestamp:
            break
        t += WEEK
        pt = 0
        # Scales as n_types * n_unchecked_weeks (hopefully 1 at most)
        for gauge_type in range(100):
            if gauge_type == _n_gauge_types:
                break
            type_sum: uint256 = self.points_sum[gauge_type][t].bias
            type_weight: uint256 = self.points_type_weight[gauge_type][t]
            pt += type_sum * type_weight
        self.points_total[t] = pt

        if t > block.timestamp:
            self.time_total = t
    return pt
```

</SourceCode>

<Example>

This example allocates 100% of the voting power to `0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939`.

```shell
>>> GaugeController.vote_for_gauge_weights('0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939', 10000)
```

</Example>


::::

### `vote_user_power`
::::description[`GaugeController.vote_user_power(arg0: address) -> uint256: view`]


Getter method for the total allocated voting power by a specific user. If a user has a veCRV balance but has not yet voted, this function will return 0.

| Input  | Type      | Description  |
| ------ | --------- | ------------ |
| `arg0` | `address` | User address |

Returns: used voting power (`uint256`).

<SourceCode>

```vyper
vote_user_power: public(HashMap[address, uint256])  # Total vote power used by user
```

</SourceCode>

<Example>

This example returns the total allocated voting power for a specific user. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function vote_user_power(address arg0) view returns (uint256)"]}
  method="vote_user_power"
  args={["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]}
  labels={["arg0"]}
  contractName="GaugeController"
/>

</Example>


::::

### `last_user_vote`
::::description[`GaugeController.last_user_vote(arg0: address, arg1: address) -> uint256: view`]


Getter for the last timestamp a specific user voted for a specific gauge.

| Input  | Type      | Description   |
|--------|-----------|---------------|
| `arg0` | `address` | User address  |
| `arg1` | `address` | Gauge address |

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
last_user_vote: public(HashMap[address, HashMap[address, uint256]])  # Last user vote's timestamp for each gauge address
```

</SourceCode>

<Example>

This example returns the last vote timestamp for a specific user and gauge. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function last_user_vote(address arg0, address arg1) view returns (uint256)"]}
  method="last_user_vote"
  args={["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939"]}
  labels={["arg0", "arg1"]}
  contractName="GaugeController"
/>

</Example>


::::

### `vote_user_slopes`
::::description[`GaugeController.vote_user_slopes(arg0: address, arg1: address) -> slope: uint256, power: uint256, end: uint256`]


Getter method for information about the current vote weight of a specific user for a specific gauge. In this variable, information is stored at the time of voting.

| Input | Type     | Description   |
|-------|----------|---------------|
| `arg0`| `address`| User address  |
| `arg1`| `address`| Gauge address |

Returns: slope (`uint256`), allocated voting-power (`uint256`) and veCRV lock end (`uint256`).

<SourceCode>

```vyper
vote_user_slopes: public(HashMap[address, HashMap[address, VotedSlope]])  # user -> gauge_addr -> VotedSlope
```

</SourceCode>

<Example>

This example returns the vote user slope data for a specific user and gauge. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function vote_user_slopes(address arg0, address arg1) view returns (uint256 slope, uint256 power, uint256 end)"]}
  method="vote_user_slopes"
  args={["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939"]}
  labels={["arg0", "arg1"]}
  contractName="GaugeController"
/>

</Example>


::::

### `gauge_relative_weight`
::::description[`GaugeController.gauge_relative_weight(addr: address, time: uint256 = block.timestamp) -> uint256: view`]


Getter for the relative weight of specific gauge at a specific time.

| Input  | Type       | Description |
| ------ | ---------- | ----------- |
| `addr` |  `address` | Gauge address |
| `time` |  `uint256` | Timestamp to check the weight at; Defaults to `block.timestamp` |

Returns: relative gauge weight normalized to 1e18 (`uint256`).

<SourceCode>

```vyper
@external
@view
def gauge_relative_weight(addr: address, time: uint256 = block.timestamp) -> uint256:
    """
    @notice Get Gauge relative weight (not more than 1.0) normalized to 1e18
            (e.g. 1.0 == 1e18). Inflation which will be received by it is
            inflation_rate * relative_weight / 1e18
    @param addr Gauge address
    @param time Relative weight at the specified timestamp in the past or present
    @return Value of relative weight normalized to 1e18
    """
    return self._gauge_relative_weight(addr, time)

@internal
@view
def _gauge_relative_weight(addr: address, time: uint256) -> uint256:
    """
    @notice Get Gauge relative weight (not more than 1.0) normalized to 1e18
            (e.g. 1.0 == 1e18). Inflation which will be received by it is
            inflation_rate * relative_weight / 1e18
    @param addr Gauge address
    @param time Relative weight at the specified timestamp in the past or present
    @return Value of relative weight normalized to 1e18
    """
    t: uint256 = time / WEEK * WEEK
    _total_weight: uint256 = self.points_total[t]

    if _total_weight > 0:
        gauge_type: int128 = self.gauge_types_[addr] - 1
        _type_weight: uint256 = self.points_type_weight[gauge_type][t]
        _gauge_weight: uint256 = self.points_weight[addr][t].bias
        return MULTIPLIER * _type_weight * _gauge_weight / _total_weight

    else:
        return 0
```

</SourceCode>

<Example>

This example returns the relative gauge weight for a specific gauge. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function gauge_relative_weight(address addr) view returns (uint256)"]}
  method="gauge_relative_weight"
  args={["0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939"]}
  labels={["addr"]}
  contractName="GaugeController"
/>

</Example>


::::

### `gauge_relative_weight_write`
::::description[`GaugeController.gauge_relative_weight_write(addr: address, time: uint256 = block.timestamp) -> uint256`]


Function to get the gauge relative weight and also checkpoint the gauge, filling in any missing gauge data for the past weeks. This is a state-changing version of [`gauge_relative_weight`](#gauge_relative_weight).

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `addr` | `address` | Gauge address |
| `time` | `uint256` | Timestamp to check the weight at; defaults to `block.timestamp` |

Returns: relative gauge weight normalized to 1e18 (`uint256`).

<SourceCode>

```vyper
@external
def gauge_relative_weight_write(addr: address, time: uint256 = block.timestamp) -> uint256:
    """
    @notice Get gauge weight normalized to 1e18 and also fill all the unfilled
            values for type and gauge records
    @dev Any address can call, however nothing is recorded if the values are filled already
    @param addr Gauge address
    @param time Relative weight at the specified timestamp in the past or present
    @return Value of relative weight normalized to 1e18
    """
    self._get_weight(addr)
    self._get_total()  # Also calculates get_sum
    return self._gauge_relative_weight(addr, time)
```

</SourceCode>

<Example>

```shell
>>> GaugeController.gauge_relative_weight_write('0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939')
50000000000000000
```

</Example>


::::

### `checkpoint`
::::description[`GaugeController.checkpoint()`]


Function to checkpoint to fill data common for all gauges.

<SourceCode>

```vyper
@external
def checkpoint():
    """
    @notice Checkpoint to fill data common for all gauges
    """
    self._get_total()
```

</SourceCode>

<Example>

```shell
>>> GaugeController.checkpoint()
```

</Example>


::::

### `checkpoint_gauge`
::::description[`GaugeController.checkpoint_gauge(addr: address)`]


Function to checkpoint a specific gauge, filling in any missing weight data.

| Input  | Type      | Description   |
| ------ | --------- | ------------- |
| `addr` | `address` | Gauge address |

<SourceCode>

```vyper
@external
def checkpoint_gauge(addr: address):
    """
    @notice Checkpoint to fill data for both a specific gauge and common for all gauges
    @param addr Gauge address
    """
    self._get_weight(addr)
    self._get_total()
```

</SourceCode>

<Example>

```shell
>>> GaugeController.checkpoint_gauge('0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939')
```

</Example>


::::

### `change_gauge_weight`
::::description[`GaugeController.change_gauge_weight(addr: address, weight: uint256)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to change the gauge weight for a specific gauge.

| Input    | Type      | Description      |
| -------- | --------- | ---------------- |
| `addr`   | `address` | Gauge address    |
| `weight` | `uint256` | New gauge weight |

Emits: `NewGaugeWeight` event.

<SourceCode>

```vyper
event NewGaugeWeight:
    gauge_address: address
    time: uint256
    weight: uint256
    total_weight: uint256

@external
def change_gauge_weight(addr: address, weight: uint256):
    """
    @notice Change weight of gauge `addr` to `weight`
    @param addr `GaugeController` contract address
    @param weight New Gauge weight
    """
    assert msg.sender == self.admin
    self._change_gauge_weight(addr, weight)
```

</SourceCode>

<Example>

```shell
>>> GaugeController.change_gauge_weight('0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939', 1000000000000000000)
```

</Example>


::::

### `get_gauge_weight`
::::description[`GaugeController.get_gauge_weight(addr: address) -> uint256: view`]


Getter for the current gauge weight of gauge `addr`.

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `addr` | `address` | Gauge address |

Returns: gauge weight normalized to 1e18 (`uint256`).

<SourceCode>

```vyper
points_weight: public(HashMap[address, HashMap[uint256, Point]])  # gauge_addr -> time -> Point

@external
@view
def get_gauge_weight(addr: address) -> uint256:
    """
    @notice Get current gauge weight
    @param addr Gauge address
    @return Gauge weight
    """
    return self.points_weight[addr][self.time_weight[addr]].bias
```

</SourceCode>

<Example>

This example returns the current gauge weight for a specific gauge. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function get_gauge_weight(address addr) view returns (uint256)"]}
  method="get_gauge_weight"
  args={["0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939"]}
  labels={["addr"]}
  contractName="GaugeController"
/>

</Example>


::::

### `get_total_weight`
::::description[`GaugeController.get_total_weight() -> uint256: view`]


Getter for the current total weight.

Returns: total weight (`uint256`).

<SourceCode>

```vyper
points_total: public(HashMap[uint256, uint256])  # time -> total weight

@external
@view
def get_total_weight() -> uint256:
    """
    @notice Get current total (type-weighted) weight
    @return Total weight
    """
    return self.points_total[self.time_total]
```

</SourceCode>

<Example>

This example returns the current total weight. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function get_total_weight() view returns (uint256)"]}
  method="get_total_weight"
  contractName="GaugeController"
/>

</Example>


::::

### `get_weights_sum_per_type`
::::description[`GaugeController.get_weights_sum_per_type(type_id: int128) -> uint256: view`]


Getter for the summed weight of gauge type `type_id`.

| Input     | Type     | Description   |
| --------- | -------- | ------------- |
| `type_id` | `int128` | Gauge type ID |

Returns: summed weight (`uint256`).

<SourceCode>

```vyper
points_sum: public(HashMap[int128, HashMap[uint256, Point]])  # type_id -> time -> Point

@external
@view
def get_weights_sum_per_type(type_id: int128) -> uint256:
    """
    @notice Get sum of gauge weights per type
    @param type_id Type id
    @return Sum of gauge weights
    """
    return self.points_sum[type_id][self.time_sum[type_id]].bias
```

</SourceCode>

<Example>

This example returns the summed weight for gauge type 0. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function get_weights_sum_per_type(int128 type_id) view returns (uint256)"]}
  method="get_weights_sum_per_type"
  args={["0"]}
  labels={["type_id"]}
  contractName="GaugeController"
/>

</Example>


::::

---

## Points

GaugeController records points (bias + slope) per gauge in `vote_points`, and scheduled changes in biases and slopes for those points in `vote_bias_changes` and `vote_slope_changes`. New changes are applied at the start of each epoch week.

*A `Point` is composed of a `bias` and a `slope`:*

```vyper
struct Point:
    bias: uint256
    slope: uint256
```

### `points_weight`
::::description[`GaugeController.points_weight(arg0: address, arg1: uint256) -> bias: uint256, slope: uint256: view`]


Getter for the `Point` information of a gauge `arg0`.

| Input  | Type      | Description     |
| ------ | --------- | --------------- |
| `arg0` | `address` | Gauge address   |
| `arg1` | `uint256` | Timestamp       |

Returns: bias (`uint256`) and slope (`uint256`).

<SourceCode>

```vyper
points_weight: public(HashMap[address, HashMap[uint256, Point]])  # gauge_addr -> time -> Point
```

</SourceCode>

<Example>

This example returns the point weight data for a specific gauge at a given timestamp. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function points_weight(address arg0, uint256 arg1) view returns (uint256 bias, uint256 slope)"]}
  method="points_weight"
  args={["0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939", "1700006400"]}
  labels={["arg0", "arg1"]}
  contractName="GaugeController"
/>

</Example>


::::

### `time_weight`
::::description[`GaugeController.time_weight(arg0: address) -> uint256: view`]


Getter for the last scheduled time the gauge weight of gauge `arg0` updates. This should always be the coming Thursday at 00:00 UTC and is updated when a gauge weight is updated.

| Input  | Type      | Description   |
| ------ | --------- | ------------- |
| `arg0` | `address` | Gauge address |

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
time_weight: public(HashMap[address, uint256])  # gauge_addr -> last scheduled time (next week)
```

</SourceCode>

<Example>

This example returns the last scheduled time for a specific gauge. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function time_weight(address arg0) view returns (uint256)"]}
  method="time_weight"
  args={["0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939"]}
  labels={["arg0"]}
  contractName="GaugeController"
/>

</Example>


::::

### `points_sum`
::::description[`GaugeController.points_sum(arg0: int128, arg1: uint256) -> bias: uint256, slope: uint256: view`]


Getter for information from `Point` struct.

| Input  | Type      | Description   |
| ------ | --------- | ------------- |
| `arg0` | `int128`  | Gauge type ID |
| `arg1` | `uint256` | Timestamp     |

Returns: bias (`uint256`) and slope (`uint256`).

<SourceCode>

```vyper
points_sum: public(HashMap[int128, HashMap[uint256, Point]])  # type_id -> time -> Point
```

</SourceCode>

<Example>

This example returns the point sum data for gauge type 0 at a given timestamp. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function points_sum(int128 arg0, uint256 arg1) view returns (uint256 bias, uint256 slope)"]}
  method="points_sum"
  args={["0", "1700006400"]}
  labels={["arg0", "arg1"]}
  contractName="GaugeController"
/>

</Example>


::::

### `time_sum`
::::description[`GaugeController.time_sum(arg0: uint256) -> uint256: view`]


Getter for the last scheduled time (next week).

| Input  | Type      | Description   |
| ------ | --------- | ------------- |
| `arg0` | `uint256` | Gauge type ID |

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
time_sum: public(uint256[1000000000])  # type_id -> last scheduled time (next week)
```

</SourceCode>

<Example>

This example returns the last scheduled time for gauge type 0. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function time_sum(uint256 arg0) view returns (uint256)"]}
  method="time_sum"
  args={["0"]}
  labels={["arg0"]}
  contractName="GaugeController"
/>

</Example>


::::

### `points_total`
::::description[`GaugeController.points_total(arg0: uint256) -> uint256: view`]


Getter for the current future total weight at timestamp `arg0`.

| Input  | Type      | Description   |
| ------ | --------- | ------------- |
| `arg0` | `uint256` | Timestamp of the next gauge weight update |

Returns: total points (`uint256`).

<SourceCode>

```vyper
points_total: public(HashMap[uint256, uint256])  # time -> total weight
```

</SourceCode>

<Example>

This example returns the total weight at a specific timestamp. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function points_total(uint256 arg0) view returns (uint256)"]}
  method="points_total"
  args={["1700006400"]}
  labels={["arg0"]}
  contractName="GaugeController"
/>

</Example>


::::

### `time_total`
::::description[`GaugeController.time_total() -> uint256: view`]


Getter for the last scheduled time when the gauge weights will update.

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
time_total: public(uint256)  # last scheduled time
```

</SourceCode>

<Example>

This example returns the last scheduled time for gauge weight updates. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function time_total() view returns (uint256)"]}
  method="time_total"
  contractName="GaugeController"
/>

</Example>


::::

### `points_type_weight`
::::description[`GaugeController.points_type_weight(arg0: int128, arg1: uint256) -> uint256: view`]


Getter for the weight for gauge type `arg0` at the next update, which is at timestamp `arg1`.

| Input  | Type      | Description   |
| ------ | --------- | ------------- |
| `arg0` | `int128`  | Gauge type ID |
| `arg1` | `uint256` | Timestamp     |

Returns: type weight (`uint256`).

<SourceCode>

```vyper
points_type_weight: public(HashMap[int128, HashMap[uint256, uint256]])  # type_id -> time -> type weight
```

</SourceCode>

<Example>

This example returns the type weight for gauge type 0 at a given timestamp. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function points_type_weight(int128 arg0, uint256 arg1) view returns (uint256)"]}
  method="points_type_weight"
  args={["0", "1700006400"]}
  labels={["arg0", "arg1"]}
  contractName="GaugeController"
/>

</Example>


::::

### `time_type_weight`
::::description[`GaugeController.time_type_weight(arg0: uint256) -> uint256: view`]


Getter for the last scheduled time, when the type weights update.

| Input  | Type      | Description   |
| ------ | --------- | ------------- |
| `arg0` | `uint256` | Type ID |

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
time_type_weight: public(uint256[1000000000])  # type_id -> last scheduled time (next week)
```

</SourceCode>

<Example>

This example returns the last scheduled time for type weight updates. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function time_type_weight(uint256 arg0) view returns (uint256)"]}
  method="time_type_weight"
  args={["0"]}
  labels={["arg0"]}
  contractName="GaugeController"
/>

</Example>


::::

---

## Gauge Types

Each liquidity gauge is assigned a type within the `GaugeController`. Grouping gauges by type allows the DAO to adjust the emissions according to type, making it possible to e.g. end all emissions for a single type.

| Description                                | Gauge Type |
| ------------------------------------------ | :--------: |
| :logos-ethereum: `Ethereum (stable pools)` |     `0`    |
|        :logos-fantom: `Fantom`             |     `1`    |
|       :logos-polygon: `Polygon`            |     `2`    |
| :no_entry_sign: `deprecated`               |     `3`    |
|        :logos-gnosis: `Gnosis`             |     `4`    |
| :logos-ethereum: `Ethereum (crypto pools)` |     `5`    |
| :no_entry_sign: `deprecated`               |     `6`    |
|        :logos-arbitrum: `Arbitrum`         |     `7`    |
|       :logos-avalanche: `Avalance`         |     `8`    |
|         :logos-harmony: `Harmony`          |     `9`    |
|               :moneybag: `Fundraising`     |    `10`    |
|       :logos-optimism: `Optimism`          |    `11`    |
|  :logos-bsc: `BinanceSmartChain`           |    `12`    |

### `gauge_types`
::::description[`GaugeController.gauge_types(_addr: address) -> int128: view`]


Getter for the gauge type of a specific gauge.

| Input   | Type      | Description   |
| ------- | --------- | ------------- |
| `_addr` | `address` | Gauge address |

Returns: gauge type (`int128`).

<SourceCode>

```vyper
gauge_types_: HashMap[address, int128]

@external
@view
def gauge_types(_addr: address) -> int128:
    """
    @notice Get gauge type for address
    @param _addr Gauge address
    @return Gauge type id
    """
    gauge_type: int128 = self.gauge_types_[_addr]
    assert gauge_type != 0

    return gauge_type - 1
```

</SourceCode>

<Example>

This example returns the gauge type for a specific gauge. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function gauge_types(address _addr) view returns (int128)"]}
  method="gauge_types"
  args={["0x4e6bb6b7447b7b2aa268c16ab87f4bb48bf57939"]}
  labels={["_addr"]}
  contractName="GaugeController"
/>

</Example>


::::

### `n_gauge_types`
::::description[`GaugeController.n_gauge_types() -> int128: view`]


Getter for the total number of gauge types. New gauge types can be added via the [`add_type`](#add_type) function.

Returns: total number of types (`int128`).

<SourceCode>

```vyper
n_gauge_types: public(int128)
```

</SourceCode>

<Example>

This example returns the total number of gauge types. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function n_gauge_types() view returns (int128)"]}
  method="n_gauge_types"
  contractName="GaugeController"
/>

</Example>


::::

### `gauge_type_names`
::::description[`GaugeController.gauge_type_names(arg0: int128) -> String[64]: view`]


Getter for the name of a specific gauge type.

| Input   | Type      | Description   |
| ------- | --------- | ------------- |
| `arg0`  | `int128`  | Gauge type index |

Returns: type name (`string`).

<SourceCode>

```vyper
gauge_type_names: public(HashMap[int128, String[64]])
```

</SourceCode>

<Example>

This example returns the name of gauge type 0. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function gauge_type_names(int128 arg0) view returns (string)"]}
  method="gauge_type_names"
  args={["0"]}
  labels={["arg0"]}
  contractName="GaugeController"
/>

</Example>


::::

### `get_type_weight`
::::description[`GaugeController.get_type_weight(type_id: int128) -> uint256: view`]


Getter for the type weight of a specific gauge type.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `type_id` |  `int128` | Gauge type ID |

Returns: type weight (`uint256`).

<SourceCode>

```vyper
@external
@view
def get_type_weight(type_id: int128) -> uint256:
    """
    @notice Get current type weight
    @param type_id Type id
    @return Type weight
    """
    return self.points_type_weight[type_id][self.time_type_weight[type_id]]

@internal
def _get_type_weight(gauge_type: int128) -> uint256:
    """
    @notice Fill historic type weights week-over-week for missed checkins
            and return the type weight for the future week
    @param gauge_type Gauge type id
    @return Type weight
    """
    t: uint256 = self.time_type_weight[gauge_type]
    if t > 0:
        w: uint256 = self.points_type_weight[gauge_type][t]
        for i in range(500):
            if t > block.timestamp:
                break
            t += WEEK
            self.points_type_weight[gauge_type][t] = w
            if t > block.timestamp:
                self.time_type_weight[gauge_type] = t
        return w
    else:
        return 0
```

</SourceCode>

<Example>

This example returns the type weight for gauge type 0. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function get_type_weight(int128 type_id) view returns (uint256)"]}
  method="get_type_weight"
  args={["0"]}
  labels={["type_id"]}
  contractName="GaugeController"
/>

</Example>


::::

### `add_type`
::::description[`GaugeController.add_type(_name: String[64], weight: uint256 = 0)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to add a new gauge type.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `_name` |  `String[64]` | Gauge type name |
| `weight` |  `uint256` | Gauge weight. Defaults to 0 |

Emits: `AddType` event.

<SourceCode>

```vyper
event AddType:
    name: String[64]
    type_id: int128

# Gauge parameters
# All numbers are "fixed point" on the basis of 1e18
n_gauge_types: public(int128)
n_gauges: public(int128)
gauge_type_names: public(HashMap[int128, String[64]])

points_weight: public(HashMap[address, HashMap[uint256, Point]])  # gauge_addr -> time -> Point
changes_weight: HashMap[address, HashMap[uint256, uint256]]  # gauge_addr -> time -> slope
time_weight: public(HashMap[address, uint256])  # gauge_addr -> last scheduled time (next week)

points_sum: public(HashMap[int128, HashMap[uint256, Point]])  # type_id -> time -> Point
changes_sum: HashMap[int128, HashMap[uint256, uint256]]  # type_id -> time -> slope
time_sum: public(uint256[1000000000])  # type_id -> last scheduled time (next week)

points_total: public(HashMap[uint256, uint256])  # time -> total weight
time_total: public(uint256)  # last scheduled time

points_type_weight: public(HashMap[int128, HashMap[uint256, uint256]])  # type_id -> time -> type weight
time_type_weight: public(uint256[1000000000])  # type_id -> last scheduled time (next week)

@external
def add_type(_name: String[64], weight: uint256 = 0):
    """
    @notice Add gauge type with name `_name` and weight `weight`
    @param _name Name of gauge type
    @param weight Weight of gauge type
    """
    assert msg.sender == self.admin
    type_id: int128 = self.n_gauge_types
    self.gauge_type_names[type_id] = _name
    self.n_gauge_types = type_id + 1
    if weight != 0:
        self._change_type_weight(type_id, weight)
        log AddType(_name, type_id)

@internal
def _change_type_weight(type_id: int128, weight: uint256):
    """
    @notice Change type weight
    @param type_id Type id
    @param weight New type weight
    """
    old_weight: uint256 = self._get_type_weight(type_id)
    old_sum: uint256 = self._get_sum(type_id)
    _total_weight: uint256 = self._get_total()
    next_time: uint256 = (block.timestamp + WEEK) / WEEK * WEEK

    _total_weight = _total_weight + old_sum * weight - old_sum * old_weight
    self.points_total[next_time] = _total_weight
    self.points_type_weight[type_id][next_time] = weight
    self.time_total = next_time
    self.time_type_weight[type_id] = next_time

    log NewTypeWeight(type_id, next_time, weight, _total_weight)
```

</SourceCode>

<Example>

This example adds a new gauge type with the name `New Test GaugeType` and a weight of `0`. Adding a new gauge type increases the `n_gauge_types` by `1`. Consequently, the new gauge type will have an ID of `14` (as there are already `13` gauge types before this new addition).

```shell
>>> GaugeController.n_gauge_types()
13

>>> GaugeController.add_type('New Test GaugeType', 0)

>>> GaugeController.n_gauge_types()
14
```

</Example>


::::

### `change_type_weight`
::::description[`GaugeController.change_type_weight(type_id: int128, weight: uint256)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to change the weight for a specific gauge type.

| Input     | Type      | Description   |
| --------- | --------- | ------------- |
| `type_id` | `int128`  | Gauge type ID |
| `weight`  | `uint256` | New gauge type weight |

Emits: `NewTypeWeight` event.

<SourceCode>

```vyper
event NewTypeWeight:
    type_id: int128
    time: uint256
    weight: uint256
    total_weight: uint256

points_weight: public(HashMap[address, HashMap[uint256, Point]])  # gauge_addr -> time -> Point
changes_weight: HashMap[address, HashMap[uint256, uint256]]  # gauge_addr -> time -> slope
time_weight: public(HashMap[address, uint256])  # gauge_addr -> last scheduled time (next week)

points_sum: public(HashMap[int128, HashMap[uint256, Point]])  # type_id -> time -> Point
changes_sum: HashMap[int128, HashMap[uint256, uint256]]  # type_id -> time -> slope
time_sum: public(uint256[1000000000])  # type_id -> last scheduled time (next week)

points_total: public(HashMap[uint256, uint256])  # time -> total weight
time_total: public(uint256)  # last scheduled time

points_type_weight: public(HashMap[int128, HashMap[uint256, uint256]])  # type_id -> time -> type weight
time_type_weight: public(uint256[1000000000])  # type_id -> last scheduled time (next week)

@external
def change_type_weight(type_id: int128, weight: uint256):
    """
    @notice Change gauge type `type_id` weight to `weight`
    @param type_id Gauge type id
    @param weight New Gauge weight
    """
    assert msg.sender == self.admin
    self._change_type_weight(type_id, weight)

@internal
def _change_type_weight(type_id: int128, weight: uint256):
    """
    @notice Change type weight
    @param type_id Type id
    @param weight New type weight
    """
    old_weight: uint256 = self._get_type_weight(type_id)
    old_sum: uint256 = self._get_sum(type_id)
    _total_weight: uint256 = self._get_total()
    next_time: uint256 = (block.timestamp + WEEK) / WEEK * WEEK

    _total_weight = _total_weight + old_sum * weight - old_sum * old_weight
    self.points_total[next_time] = _total_weight
    self.points_type_weight[type_id][next_time] = weight
    self.time_total = next_time
    self.time_type_weight[type_id] = next_time

    log NewTypeWeight(type_id, next_time, weight, _total_weight)
```

</SourceCode>

<Example>

This example changes the weight of a gauge type with ID `14` to `1000000000000000000`.

```shell
>>> GaugeController.get_type_weight(14)
0

>>> GaugeController.change_type_weight(14, 1000000000000000000)

>>> GaugeController.get_type_weight(14)
1000000000000000000
```

</Example>


::::

---

## Contract Info Methods

### `token`
::::description[`GaugeController.token() -> address: view`]


Getter for the Curve DAO Token. This variable can not be changed.

Returns: crv token (`address`).

<SourceCode>

```vyper
token: public(address)  # CRV token

@external
def __init__(_token: address, _voting_escrow: address):
    """
    @notice Contract constructor
    @param _token `ERC20CRV` contract address
    @param _voting_escrow `VotingEscrow` contract address
    """
    assert _token != ZERO_ADDRESS
    ...
    self.token = _token
    ...
```

</SourceCode>

<Example>

This example returns the CRV token address. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function token() view returns (address)"]}
  method="token"
  contractName="GaugeController"
/>

</Example>


::::

### `voting_escrow`
::::description[`GaugeController.voting_escrow() -> address: view`]


Getter for the VotingEscrow contract.

Returns: voting escrow (`address`).

<SourceCode>

```vyper
voting_escrow: public(address)  # Voting escrow

@external
def __init__(_token: address, _voting_escrow: address):
    """
    @notice Contract constructor
    @param _token `ERC20CRV` contract address
    @param _voting_escrow `VotingEscrow` contract address
    """
    ...
    assert _voting_escrow != ZERO_ADDRESS
    ...
    self.voting_escrow = _voting_escrow
```

</SourceCode>

<Example>

This example returns the VotingEscrow contract address. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function voting_escrow() view returns (address)"]}
  method="voting_escrow"
  contractName="GaugeController"
/>

</Example>


::::

---

## Contract Ownership

Admin ownership can be commited by calling `commit_transfer_ownership`. Changes then need to be applied. The current `admin` is the OwnershipAgent, which would require a DAO vote to change it.

### `admin`
::::description[`GaugeController.admin() -> address: view`]


Getter for the admin of the contract.

Returns: admin (`address`).

<SourceCode>

```vyper
admin: public(address)  # Can and will be a smart contract

@external
def __init__(_token: address, _voting_escrow: address):
    """
    @notice Contract constructor
    @param _token `ERC20CRV` contract address
    @param _voting_escrow `VotingEscrow` contract address
    """
    ...

    self.admin = msg.sender

    ...
```

</SourceCode>

<Example>

This example returns the admin address of the contract. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function admin() view returns (address)"]}
  method="admin"
  contractName="GaugeController"
/>

</Example>


::::

### `future_admin`
::::description[`GaugeController.future_admin() -> address: view`]


Getter for the future admin of the contract. 

Returns: future admin (`address`).

<SourceCode>

```vyper
future_admin: public(address)  # Can and will be a smart contract
```

</SourceCode>

<Example>

This example returns the future admin address of the contract. The value is fetched live from the blockchain.

<ContractCall
  address="0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB"
  abi={["function future_admin() view returns (address)"]}
  method="future_admin"
  contractName="GaugeController"
/>

</Example>


::::

### `commit_transfer_ownership`
::::description[`GaugeController.commit_transfer_ownership(addr: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to commit the ownership of the contract to `addr`.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `addr` |  `address` | new admin address |

Emits: `CommitOwnership` event.

<SourceCode>

```vyper
event CommitOwnership:
    admin: address

future_admin: public(address)  # Can and will be a smart contract

@external
def commit_transfer_ownership(addr: address):
    """
    @notice Transfer ownership of GaugeController to `addr`
    @param addr Address to have ownership transferred to
    """
    assert msg.sender == self.admin  # dev: admin only
    self.future_admin = addr
    log CommitOwnership(addr)
```

</SourceCode>

<Example>

This example commits the ownership of the contract to `0xd8da6bf26964af9d7eed9e03e53415d37aa96045`.

```shell
>>> GaugeController.admin()
'0x40907540d8a6C65c637785e8f8B742ae6b0b9968'

>>> GaugeController.commit_transfer_ownership("0xd8da6bf26964af9d7eed9e03e53415d37aa96045")

>>> GaugeController.future_admin()
'0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
```

</Example>


::::

### `apply_transfer_ownership`
::::description[`GaugeController.apply_transfer_ownership()`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to apply the new ownership.

Emits: `ApplyOwnership` event.

<SourceCode>

```vyper
event ApplyOwnership:
    admin: address

@external
def apply_transfer_ownership():
    """
    @notice Apply pending ownership transfer
    """
    assert msg.sender == self.admin  # dev: admin only
    _admin: address = self.future_admin
    assert _admin != ZERO_ADDRESS  # dev: admin not set
    self.admin = _admin
    log ApplyOwnership(_admin)
```

</SourceCode>

<Example>

This example applies the new ownership of the contract to `0xd8da6bf26964af9d7eed9e03e53415d37aa96045` (see the example above).

```shell
>>> GaugeController.admin()
'0x40907540d8a6C65c637785e8f8B742ae6b0b9968'

>>> GaugeController.apply_transfer_ownership()

>>> GaugeController.admin()
'0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
```

</Example>


::::
