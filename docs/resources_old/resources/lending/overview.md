Curve Lending allows users to borrow crvUSD against any collateral token or to borrow any token against crvUSD, while benefiting from the **soft-liquidation mechanism** provided by [LLAMMA](https://docs.curve.fi/crvUSD/amm/).  This innovative approach to overcollateralized loans enhances risk management and user experience for borrowers.  Additionally, Curve Lending allows users to **generate interest through lending (supplying) their assets** to be borrowed by others.

:::warning "Collateral in Lending Markets *DO NOT* back crvUSD"
    The collateral used in Curve Lending markets does not back crvUSD. **All crvUSD within Curve Lending is supplied by users**.  Conversely, minting new crvUSD requires high-quality crypto collateral approved by the DAO.  The **crvUSD minting system is separate from the lending markets**. *[See here for more differences between Curve Lending and minting crvUSD](./faq.md#whats-the-difference-between-minting-crvusd-and-lending-markets)*.
:::

:::danger "Curve Lending Risk Disclaimer"
    Full risk disclaimer on using Curve Lending can be found [here](../risks-security/risks/lending.md)
:::

<div class="grid cards" markdown>

-   :fontawesome-solid-money-bill-1: **Borrowers**

    ---

    Borrowers are the ones **borrowing assets**. To do so, they create a loan and put up some collateral. In exchange for borrowing, they pay a certain [Borrow Interest Rate (Borrow APY)](#borrow-rate).

    [:octicons-arrow-right-24: How to Borrow](./how-to-borrow.md)

-   :material-bank: **Lenders**

    ---

    Lenders **supply their assets so they can be loaned to borrowers**. To do so, they deposit their assets into a [Vault](https://ethereum.org/en/developers/docs/standards/tokens/erc-4626/). In exchange for supplying their assets, they are awarded a [Lending Interest Rate](#lend-rate).

    [:octicons-arrow-right-24: How to Supply (Lend)](./how-to-supply.md)

</div>

---

# **Overview**


*Let's take a look at a single market to see the basics of how it works:*

![Simple market illustration](../images/lending/single_market.svg#only-light)
![Simple market illustration](../images/lending/single_market_dark.svg#only-dark)

*Let's breakdown the different entities and their roles in this market:*

| Entity | Role |
|:--|:--|
| <img src="../images/lending/llama_head.svg" alt="Business Llama" style={{height: '50px'}} /> | **Business Llama** | Business Llama represents the lending market and smart contracts in the system.  This llama uses CRV as collateral, and lends out crvUSD.  Business Llama **charges interest on crvUSD users borrow (Borrow APY)**, and **pays interest to lenders who supply crvUSD (Lend APY)**. |
| <img src="../images/lending/bob_head.svg" alt="Bob" style={{height: '50px'}} /> | **Bob** | Bob always thinks the market will crash, so he **supplies his crvUSD** and Business Llama **lends it out and pays Bob interest (Lend APY)**. |
| <img src="../images/lending/alice_head.svg" alt="Alice" style={{height: '50px'}} /> | **Alice** | Alice wants to go trade meme coins but doesn't want to sell her CRV, so she **deposits CRV and uses it as collateral to borrow crvUSD**.  She feels safe knowing she's better protected here with LLAMMA and soft-liquidations than other lending markets.  She is **charged the Borrow APY on her debt** while the loan is open.  |
| <div><img src="../images/lending/charlie_head.svg" alt="Charlie" style={{height: '50px'}} /><img src="../images/lending/daisy_head.svg" alt="Daisy" style={{height: '50px'}} /></div> | **Charlie** & **Daisy** | Charlie and Daisy are just talking to the wrong Business Llama (lending market).  All Curve Lending Markets are one-way, and isolated. They need to go and find the Business Llama that lends out CRV with crvUSD collateral. (Business llama with the red background [here](#markets)) |

