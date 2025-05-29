# Managing a Loan

To perform the actions on this page, you must have an existing loan. The options below are only available for active loans.

Users can manage their loans in the following ways:

- [Add](#adding-collateral) or [remove](#removing-collateral) collateral
- [Borrow more](#borrow-more) crvUSD
- [Repay](#partial-repayment) (partially or fully)


!!!warning "Loan Management in Liquidation"
    When a loan is in liquidation, you cannot add or remove collateral. The only available actions are repaying debt (partially or fully) or self-liquidating your loan. For more information on managing a loan in liquidation, see here.


To manage your loan, navigate to the [Markets Overview](https://curve.fi/crvusd/ethereum/markets/), connect your wallet and select the according market. The UI displays your current loans health and debt in the overview.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/active_markets_light.png" 
    style={{ width: "800px" }} 
    className="only-light" 
    alt="Active Markets Overview Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/active_markets_dark.png" 
    style={{ width: "800px" }} 
    className="only-dark" 
    alt="Active Markets Overview Dark Theme" 
  />
</figure>


---


# **Adding Collateral**

Go to the [Markets Dashboard](https://curve.fi/crvusd/ethereum/markets/) and select the market where you want to add more collateral.

!!!warning "Adding Collateral while being in Liquidation is not possible"
    Adding collateral is not possible when your loan is in liquidation. To get out of liquidation, see [here].

Switch from the `Loan` to the `Collateral` tab and specify the amount of collateral you want to add and confirm the transaction.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/add_light.png" 
    style={{ width: "400px" }} 
    className="only-light" 
    alt="Add Collateral Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/add_dark.png" 
    style={{ width: "400px" }} 
    className="only-dark" 
    alt="Add Collateral Dark Theme" 
  />
</figure>


**Effect of Adding More Collateral**

Adding more collateral to your loan has a **positive effect on its health and liquidation range**. It increases your loan's health and moves the liquidation range further down, keeping you further away from liquidation.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/new_range_add_light.png" 
    style={{ width: "700px" }} 
    className="only-light" 
    alt="New Range After Adding Collateral Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/new_range_add_dark.png" 
    style={{ width: "700px" }} 
    className="only-dark" 
    alt="New Range After Adding Collateral Dark Theme" 
  />
</figure>


--- 


# **Removing Collateral**

Go to the [Markets Dashboard](https://curve.fi/crvusd/ethereum/markets/) and select the market where you want to remove collateral from.

!!!warning "Removing Collateral while being in Liquidation is not possible"
    Removing collateral from your loan is not possible when you are in liquidation. To get out of liquidation, see [here].

Switch from the `Loan` to the `Collateral` tab and select "Remove". Then specify the amount of collateral you want to remove and confirm the transaction.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/remove_light.png" 
    style={{ width: "400px" }} 
    className="only-light" 
    alt="Remove Collateral Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/remove_dark.png" 
    style={{ width: "400px" }} 
    className="only-dark" 
    alt="Remove Collateral Dark Theme" 
  />
</figure>

**Effect of Removing Collateral**

Removing collateral from your loan has a **negative effect on its health and liquidation range**. It decreases your loan's health and moves the liquidation range further up, bringing your closer to liquidation.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/new_range_remove_light.png" 
    style={{ width: "700px" }} 
    className="only-light" 
    alt="New Range After Removing Collateral Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/new_range_remove_dark.png" 
    style={{ width: "700px" }} 
    className="only-dark" 
    alt="New Range After Removing Collateral Dark Theme" 
  />
</figure>


---


# **Borrow More**

Go to the [Markets Dashboard](https://curve.fi/crvusd/ethereum/markets/) and select the market where you want to borrow more crvUSD.

!!!warning "Borrowing more in Liquidation"
    Borrowing more crvUSD in liquidation is not possible. To get out of liquidation, see [here].

Specify the amount of crvUSD you want to borrow. You also have the option to add more collateral at the same time — allowing you to increase both your loan amount and your collateral in a single step.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/borrow_more_light.png" 
    style={{ width: "400px" }} 
    className="only-light" 
    alt="Borrow More Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/borrow_more_dark.png" 
    style={{ width: "400px" }} 
    className="only-dark" 
    alt="Borrow More Dark Theme" 
  />
</figure>


**Effect of Borrowing More**

Borrowing more crvUSD is only possible if the loan is not in liquidation. Borrowing more crvUSD will decrease the loans health and move up the liquidation range, bringing you closer to liquidation.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/new_range_more_light.png" 
    style={{ width: "700px" }} 
    className="only-light" 
    alt="New Range After Borrowing More Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/new_range_more_dark.png" 
    style={{ width: "700px" }} 
    className="only-dark" 
    alt="New Range After Borrowing More Dark Theme" 
  />
</figure>


---


# **Partial Repayment**

Debt can be repaid fully or partially. Repayment is always possible, whether the loan is in liquidation or not, but it will have different effects on the liquidation range.

Go to the [Markets Dashboard](https://curve.fi/crvusd/ethereum/markets/) and select the market where you want to partially repay some debt.

<figure>
  <img 
    src="../../../static/images/crvusd/guides/loan-management/partial_repay_light.png" 
    style={{ width: "400px" }} 
    className="only-light" 
    alt="Partial Repayment Light Theme" 
  />
  <img 
    src="../../../static/images/crvusd/guides/loan-management/partial_repay_dark.png" 
    style={{ width: "400px" }} 
    className="only-dark" 
    alt="Partial Repayment Dark Theme" 
  />
</figure>



- ## **Not in Liquidation**

    Repaying debt when the loan is not in liquidation improves the health of the loan and moves the liquidation range down, brining the loan further away from liquidation.

    <figure>
        <img 
          src="../../../static/images/crvusd/guides/loan-management/new_range_partial_light.png" 
          style={{ width: "600px" }} 
          className="only-light" 
          alt="New Range After Partial Repayment Light Theme" 
        />
        <img 
          src="../../../static/images/crvusd/guides/loan-management/new_range_partial_dark.png" 
          style={{ width: "600px" }} 
          className="only-dark" 
          alt="New Range After Partial Repayment Dark Theme" 
        />
    </figure>


- ## **In Liquidation**

    Repaying debt while being in liquidation will increase your health, but NOT move the liquidation range. No matter how much you repay, it will never move your liquidation range up or down but will only increase your health.

    !!!warning "Liquidation Range will NOT move!"
        Your liquidation range will not move if you repay debt while you're in it — not even if you repay 99% of your debt.
