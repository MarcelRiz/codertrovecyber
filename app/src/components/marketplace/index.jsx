/* eslint-disable no-param-reassign */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useCallback } from 'react'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { get, isEmpty } from 'lodash'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { getMarketplaces } from '@states/marketplace'
import { getFile } from '@states/fileManagement'
import SkeletonComponent from '@components/shared/skeleton'
import { MarketplaceStyled } from './buildInComponent.styled'

const { Body: CardBody, Title: CardTitle } = Card
export default function BlogComponent() {
  const { marketplaces, loading } = useSelector(state => state.marketplace)
  const { currentFile } = useSelector(state => state.fileManagement)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(getMarketplaces())
  }, [])

  const requestGoogleImage = useCallback(thumbnailImage => {
    if (thumbnailImage && thumbnailImage.pathName) {
      dispatch(getFile({ pathName: [thumbnailImage.pathName] }))
    }
  }, [])

  useEffect(() => {
    if (marketplaces && marketplaces.length > 0) {
      marketplaces.map(marketplace =>
        requestGoogleImage(marketplace?.thumbnailImage)
      )
    }
  }, [marketplaces])

  const getImageFromCloud = useCallback(
    thumbnailImage => {
      if (!isEmpty(currentFile) && get(thumbnailImage, 'pathName')) {
        return currentFile[thumbnailImage.pathName]
      }
      return ''
    },
    [currentFile]
  )

  return loading ? (
    <SkeletonComponent
      loading={loading}
      paragraph={{ rows: 15, width: '60%' }}
      margin="2% 8%"
    >
      <span />
    </SkeletonComponent>
  ) : (
    <MarketplaceStyled>
      {Array.isArray(marketplaces) &&
        marketplaces.length > 0 &&
        marketplaces.map(marketplace => (
          <Card key={marketplace.id} className="hover-shadow-lg">
            <div
              role="presentation"
              className="header-image"
              onClick={() => router.push(`/marketplaces/${marketplace?.id}`)}
            >
              <LazyLoadImage
                alt={marketplace?.thumbnailImage?.name}
                src={getImageFromCloud(marketplace?.thumbnailImage)}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = '/images/image-default.png'
                }}
                placeholderSrc="/images/image-default.png"
                effect="blur"
                threshold={200}
              />
            </div>

            <div className="content-wrapper">
              <CardBody>
                <CardTitle
                  role="presentation"
                  onClick={() =>
                    router.push(`/marketplaces/${marketplace?.id}`)
                  }
                >
                  {marketplace?.title}
                </CardTitle>
              </CardBody>
              <div
                role="presentation"
                className="marketplace-card-footer"
                onClick={() => window.open(marketplace?.bookingLink, '_blank')}
              >
                Book a consultation
              </div>
            </div>
          </Card>
        ))}
    </MarketplaceStyled>
  )
}
