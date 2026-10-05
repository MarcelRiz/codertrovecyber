import React from 'react'
import { useSelector } from 'react-redux'
import withAuthenticated from '@src/hoc/withAuthenticated'
import DefaultLayout from '@src/layout/default'
import MarketplaceDetail from '@components/marketplace-detail'

function PageMarketplaceDetail() {
  const { marketplaceDetail } = useSelector(state => state.marketplace)

  return (
    <>
      <DefaultLayout
        title={marketplaceDetail ? marketplaceDetail.title : ''}
        isHome={false}
        breadcrumbs={[
          {
            url: '/marketplaces',
            text: 'Marketplace',
          },
        ]}
      >
        <div>
          <MarketplaceDetail />
        </div>
      </DefaultLayout>
    </>
  )
}

export default withAuthenticated(PageMarketplaceDetail)
