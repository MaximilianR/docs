import React from 'react'
import Head from '@docusaurus/Head'
import BrowserOnly from '@docusaurus/BrowserOnly'

function EmissionsLoading() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#a5a4ce',
      fontFamily: 'System, monospace',
      color: 'white',
      fontSize: 14,
    }}>
      Loading Protocol Map...
    </div>
  )
}

export default function EmissionsPage() {
  return (
    <>
      <Head>
        <title>CRV Emissions Map | Curve Docs</title>
        <meta name="description" content="Interactive visual map of Curve's CRV emission cycle — gauge voting, weekly epochs, and emission distribution" />
        <meta property="og:title" content="CRV Emissions Map" />
        <meta property="og:description" content="Interactive visualization of Curve's weekly CRV emission cycle — gauge weight voting, Thursday snapshots, and emission distribution to gauges." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://docs.curve.finance/emissions" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="CRV Emissions Map" />
        <meta name="twitter:description" content="Interactive visualization of Curve's weekly CRV emission cycle — gauge weight voting, Thursday snapshots, and emission distribution to gauges." />
      </Head>
      <BrowserOnly fallback={<EmissionsLoading />}>
        {() => {
          const ProtocolMap = require('@site/src/components/ProtocolMap').default
          return <ProtocolMap tab="emissions" />
        }}
      </BrowserOnly>
    </>
  )
}
