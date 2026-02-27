# Integration Docs
This section is targeted at external third parties interested in integrating Curve into their systems. Curve provides various contracts that simplify the integration process, making the lives of integrators much easier and more efficient.

*For integrators, the following contracts may be of great use:*


-   :fontawesome-solid-address-book: **Address Provider**---

    The `AddressProvider` contract acts as an **entry point for Curve's various registries**, deployed across all chains where Curve infrastructure is present. It maps all relevant Curve contracts across different chains.

    [→ `AddressProviderNG.vy`](./address-provider.md)

-    **Meta Registry**---

    The `MetaRegistry` contract serves as a Curve Finance Pool Registry Aggregator, providing an on-chain API that consolidates various properties of Curve pools by **integrating multiple registries into a single contract**.

    [→ `MetaRegistry.vy`](./metaregistry.md)

-   :fontawesome-solid-retweet: **Rate Provider**---

    The `RateProvider` contract **provides exchange rates for token swaps**using different Curve AMMs that are recognized within the `MetaRegistry`.

    [→ `RateProvider.vy`](./rate-provider.md)


---


## **Guides***Below are some basic guides and examples. More will be added soon.*

### **Fetching Pools**[](./metaregistry.md#fetching-liquidity-pools) Discover how to check on-chain pools containing two specific assets.
