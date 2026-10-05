import React from 'react'

import withAuthenticated from '@src/hoc/withAuthenticated'
import DefaultLayout from '@src/layout/default'
import MarketplaceComponent from '@components/marketplace'
import PageTitle from '@src/components/page-title'

function PageMarketplace() {
  return (
    <>
      <DefaultLayout title="Marketplace" isHome={false} backLink="/">
        <PageTitle title="Marketplace" />
        <div>
          <MarketplaceComponent />
        </div>
      </DefaultLayout>
    </>
  )
}

export default withAuthenticated(PageMarketplace)
