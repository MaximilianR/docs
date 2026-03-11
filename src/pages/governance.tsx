import React from 'react'
import Head from '@docusaurus/Head'
import BrowserOnly from '@docusaurus/BrowserOnly'

function GovernanceLoading() {
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

export default function GovernancePage() {
  return (
    <>
      <Head>
        <title>Governance Map | Curve Docs</title>
        <meta name="description" content="Interactive visual map of Curve's governance system — CRV, veCRV, gauges, and DAO voting" />
      </Head>
      <BrowserOnly fallback={<GovernanceLoading />}>
        {() => {
          const ProtocolMap = require('@site/src/components/ProtocolMap').default
          return <ProtocolMap tab="governance" />
        }}
      </BrowserOnly>
    </>
  )
}
