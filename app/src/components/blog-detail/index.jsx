/* eslint-disable no-param-reassign */
import React, { useMemo, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import parse from 'html-react-parser'
import moment from 'moment'
import { useRouter } from 'next/router'
import { get, isEmpty } from 'lodash'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { getFile } from '@states/fileManagement'
import { BlogCardDetailStyled } from './buildInComponent.styled'

const { Body: CardBody, Title: CardTitle } = Card
const defaultAvatar =
  'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
export default function BlogComponent() {
  const { blogDetail } = useSelector(state => state.blog)
  const router = useRouter()
  const dispatch = useDispatch()
  const { currentFile } = useSelector(state => state.fileManagement)

  useEffect(() => {
    const { thumbnailImage } = blogDetail
    if (thumbnailImage && thumbnailImage.pathName) {
      dispatch(getFile({ pathName: [thumbnailImage.pathName] }))
    }
  }, [blogDetail.thumbnailImage])

  const transformIframe = useMemo(() => {
    if (blogDetail.content) {
      const firstStep = blogDetail.content.replaceAll(
        '<oembed url',
        '<oembed src'
      )
      let secondStep = firstStep.replaceAll('oembed', 'iframe')
      if (secondStep.includes('youtube.com/watch')) {
        secondStep = secondStep.replaceAll(
          'youtube.com/watch?v=',
          'youtube.com/embed/'
        )
      }
      return secondStep.replaceAll(
        '<iframe',
        '<iframe frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen'
      )
    }
    return ''
  }, [blogDetail])

  const authorName = useMemo(() => {
    let formatAuthorName = ''
    if (
      blogDetail.author &&
      blogDetail.author.firstName &&
      blogDetail.author.lastName
    ) {
      formatAuthorName = `${blogDetail.author.firstName} ${blogDetail.author.lastName}`
    } else {
      formatAuthorName = blogDetail.author?.username
    }
    formatAuthorName =
      formatAuthorName &&
      formatAuthorName.replace(/(^\w{1})|(\s+\w{1})/g, letter =>
        letter.toUpperCase()
      )
    return formatAuthorName
  }, [blogDetail.author])

  const shortName = useMemo(() => {
    if (!blogDetail.author) return null
    if (blogDetail.author?.firstName && blogDetail.author?.lastName) {
      return `${blogDetail.author?.firstName[0]}${blogDetail.author?.lastName[0]}`.toUpperCase()
    }
    return blogDetail.author?.email[0]?.toUpperCase()
  }, [blogDetail.author])

  const formatCategoryName = useMemo(() => {
    if (blogDetail.categoryId) {
      const format = blogDetail.categoryId.name.replace(
        /(^\w{1})|(\s+\w{1})/g,
        letter => letter.toLowerCase()
      )
      return format.replaceAll(/ /g, '_')
    }
    return ''
  }, [blogDetail.categoryId])

  const getImageFromCloud = useMemo(() => {
    if (!isEmpty(currentFile) && get(blogDetail, 'thumbnailImage.pathName')) {
      return currentFile[blogDetail.thumbnailImage.pathName]
    }
    return ''
  }, [currentFile, blogDetail.thumbnailImage])

  return (
    <BlogCardDetailStyled>
      <div className="header-image">
        {/* <img alt={blogDetail.thumbnailImage?.name} src={getImageFromCloud} /> */}
        <LazyLoadImage
          alt={blogDetail.thumbnailImage?.name}
          src={getImageFromCloud}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = '/images/image-default.png'
          }}
          effect="blur"
          placeholderSrc="/images/image-default.png"
        />
      </div>

      <div className="content-wrapper">
        <div className="author-wrapper">
          <div className="author-avatar">
            {blogDetail.author && blogDetail.author.avatar ? (
              <span className="avatar rounded-circle">
                <img alt={blogDetail.author?.username} src={defaultAvatar} />
              </span>
            ) : (
              <span className="avatar rounded-circle bg-danger">
                {shortName}
              </span>
            )}
          </div>
          <div className="mt-2 author-info">
            By
            <span
              className="blog-author-name"
              // role="presentation"
              // onClick={() => router.push(`/blogs/author/${author.id}`)}
            >
              {authorName}
            </span>
            at
            <span className="blog-created-date">
              {/* 3 month ago */}
              {moment(blogDetail.created_at).fromNow()}
            </span>
          </div>
        </div>

        <CardBody>
          <CardTitle>{blogDetail.title}</CardTitle>

          <div
            className="category-tag"
            role="presentation"
            onClick={() =>
              router.push(`/blogs?category=${blogDetail.categoryId.id}`)
            }
          >
            #{formatCategoryName}
          </div>

          <div className="mt-4 text-muted">
            {transformIframe && parse(transformIframe)}
          </div>
        </CardBody>
      </div>
    </BlogCardDetailStyled>
  )
}
