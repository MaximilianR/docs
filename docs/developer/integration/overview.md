import DocCard, { DocCardGrid } from '@site/src/components/DocCard'

# Integration Docs
This section is targeted at external third parties interested in integrating Curve into their systems. Curve provides various contracts that simplify the integration process, making the lives of integrators much easier and more efficient.

*For integrators, the following contracts may be of great use:*

<DocCardGrid>
  <DocCard title="AddressProviderNG.vy" icon="vyper" link="./address-provider" linkText="AddressProviderNG.vy">

The `AddressProvider` contract acts as an **entry point for Curve's various registries**, deployed across all chains where Curve infrastructure is present. It maps all relevant Curve contracts across different chains.

  </DocCard>
  <DocCard title="MetaRegistry.vy" icon="vyper" link="./meta-registry" linkText="MetaRegistry.vy">

The `MetaRegistry` contract serves as a Curve Finance Pool Registry Aggregator, providing an on-chain API that consolidates various properties of Curve pools by **integrating multiple registries into a single contract**.

  </DocCard>
  <DocCard title="RateProvider.vy" icon="vyper" link="./rate-provider" linkText="RateProvider.vy">

The `RateProvider` contract **provides exchange rates for token swaps** using different Curve AMMs that are recognized within the `MetaRegistry`.

  </DocCard>
</DocCardGrid>


---


## Guides*Below are some basic guides and examples. More will be added soon.*

### Fetching Pools

[](./meta-registry.md#finding-pools) Discover how to check on-chain pools containing two specific assets.
