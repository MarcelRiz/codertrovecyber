/* eslint-disable no-param-reassign */
import React, { useMemo, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { useRouter } from 'next/router'
import moment from 'moment'
import { isEmpty, get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { getFile } from '@states/fileManagement'
import { BlogCardStyled } from './buildInComponent.styled'

const { Body: CardBody, Title: CardTitle } = Card
const defaultAvatar =
  'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
export default function BlogComponent({
  authorName,
  title,
  thumbnailImage,
  author,
  blogId,
  description,
  createdAt,
  category,
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { currentFile } = useSelector(state => state.fileManagement)

  useEffect(() => {
    if (thumbnailImage && thumbnailImage.pathName) {
      dispatch(getFile({ pathName: [thumbnailImage.pathName] }))
    }
  }, [thumbnailImage])

  const shortName = useMemo(() => {
    if (!author) return null
    if (author?.firstName && author?.lastName) {
      return `${author?.firstName[0]}${author?.lastName[0]}`.toUpperCase()
    }
    return author?.email[0]?.toUpperCase()
  }, [author])

  const formatAuthorName = useMemo(() => {
    if (authorName) {
      return authorName.replace(/(^\w{1})|(\s+\w{1})/g, letter =>
        letter.toUpperCase()
      )
    }
    return ''
  }, [authorName])

  const formatCategoryName = useMemo(() => {
    if (category) {
      const format = category.name.replace(/(^\w{1})|(\s+\w{1})/g, letter =>
        letter.toLowerCase()
      )
      return format.replaceAll(/ /g, '_')
    }
    return ''
  }, [category.name])

  const getImageFromCloud = useMemo(() => {
    if (!isEmpty(currentFile) && get(thumbnailImage, 'pathName')) {
      return currentFile[thumbnailImage.pathName]
    }
    return ''
  }, [currentFile])

  return (
    <BlogCardStyled hasImage={thumbnailImage?.name}>
      <div
        className="header-image"
        role="presentation"
        onClick={() => router.push(`/blogs/${blogId}`)}
      >
        {/* <img alt={thumbnailImage?.name} src={getImageFromCloud} /> */}
        <LazyLoadImage
          alt={thumbnailImage?.name}
          src={getImageFromCloud}
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
        <div className="author-avatar">
          {author && author.avatar ? (
            <span className="avatar rounded-circle">
              <img alt={author.username} src={defaultAvatar} />
            </span>
          ) : (
            <span className="avatar rounded-circle bg-danger">{shortName}</span>
          )}
        </div>
        <CardBody>
          <CardTitle
            role="presentation"
            onClick={() => router.push(`/blogs/${blogId}`)}
          >
            {title}
          </CardTitle>
          <div
            className="category-tag"
            role="presentation"
            onClick={() => router.push(`/blogs?category=${category.id}`)}
          >
            #{formatCategoryName}
          </div>

          <div className="mt-1 text-muted">{description}</div>
          <div className="mt-2 blog-card-footer">
            By
            <span
              className="blog-author-name"
              // role="presentation"
              // onClick={() => router.push(`/blogs/author/${author.id}`)}
            >
              {formatAuthorName}
            </span>
            at
            <span className="blog-created-date">
              {moment(createdAt).fromNow()}
            </span>
          </div>
        </CardBody>
      </div>
    </BlogCardStyled>
  )
}
