import React from 'react'
import Head from '@docusaurus/Head'
import BrowserOnly from '@docusaurus/BrowserOnly'

function FeeArchitectureLoading() {
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

export default function FeeArchitecturePage() {
  return (
    <>
      <Head>
        <title>Fee Architecture Map | Curve Docs</title>
        <meta name="description" content="Interactive visual map of Curve's fee architecture" />
      </Head>
      <BrowserOnly fallback={<FeeArchitectureLoading />}>
        {() => {
          const ProtocolMap = require('@site/src/components/ProtocolMap').default
          return <ProtocolMap tab="fees" />
        }}
      </BrowserOnly>
    </>
  )
}
