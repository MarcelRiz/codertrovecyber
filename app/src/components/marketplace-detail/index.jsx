/* eslint-disable no-param-reassign */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import parse from 'html-react-parser'
import { get, isEmpty } from 'lodash'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { getMarketplaceById } from '@states/marketplace'
import { getFile } from '@states/fileManagement'
import { MarketplaceDetailStyled } from './buildInComponent.styled'

export default function BlogComponent() {
  const { marketplaceDetail } = useSelector(state => state.marketplace)
  const { currentFile } = useSelector(state => state.fileManagement)
  const dispatch = useDispatch()
  const router = useRouter()
  const { query } = router

  useEffect(() => {
    if (query.id) {
      dispatch(getMarketplaceById(query.id))
    }
  }, [query])

  useEffect(() => {
    const thumbnailImage = marketplaceDetail?.thumbnailImage
    if (thumbnailImage && thumbnailImage.pathName) {
      dispatch(getFile({ pathName: [thumbnailImage.pathName] }))
    }
  }, [marketplaceDetail])

  const getImageFromCloud = useMemo(() => {
    const thumbnailImage = marketplaceDetail?.thumbnailImage
    if (!isEmpty(currentFile) && get(thumbnailImage, 'pathName')) {
      return currentFile[thumbnailImage.pathName]
    }
    return ''
  }, [marketplaceDetail, currentFile])

  return (
    <MarketplaceDetailStyled>
      <div className="detail-image">
        <LazyLoadImage
          alt={marketplaceDetail?.thumbnailImage?.name}
          src={getImageFromCloud}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = '/images/image-default.png'
          }}
          effect="blur"
          placeholderSrc="/images/image-default.png"
        />
      </div>
      <div className="detail-content">
        <div className="title">{marketplaceDetail.title || ''}</div>
        <div className="content">
          {marketplaceDetail.content
            ? parse(marketplaceDetail.content.replaceAll('\n', '<br/>'))
            : ''}
        </div>
        <div
          role="presentation"
          className="marketplace-btn"
          onClick={() => window.open(marketplaceDetail?.bookingLink, '_blank')}
        >
          Book a consultation
        </div>
      </div>
    </MarketplaceDetailStyled>
  )
}
