import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import BlogCard from '@components/blog-card'
import BlogSideBar from '@components/blog-side-bar'
import BlogDetail from '@components/blog-detail'
import SkeletonComponent from '@components/shared/skeleton'
import { getBlogs, getBlogById } from '@states/blog'
import { BlogStyled } from './buildInComponent.styled'

export default function BlogComponent() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { blogs, blogDetail, loading } = useSelector(state => state.blog)
  const [isCategory, setIsCategory] = useState(true)

  const sideEffect = useCallback(() => {
    const { query } = router

    if (query.id) {
      dispatch(getBlogById(query.id))
      setIsCategory(!isCategory)
    }
    if (query.category) {
      dispatch(getBlogs({ categoryId: query.category }))
      setIsCategory(true)
      // dispatch(getBlogs({ authorId: 1, categoryId: 3 }))
    }
    if (isEmpty(query)) {
      dispatch(getBlogs({}))
      setIsCategory(true)
    }
  }, [router])

  useEffect(() => {
    sideEffect()
  }, [sideEffect])

  const renderBlogCards = useMemo(() => {
    if (Array.isArray(blogs) && blogs.length > 0) {
      return blogs.map(blog => (
        <BlogCard
          key={blog.id}
          title={blog.title}
          authorName={blog.authorName}
          thumbnailImage={blog.thumbnailImage}
          author={blog.author}
          category={blog.categoryId}
          blogId={blog.id}
          description={blog.description}
          createdAt={blog.created_at}
        />
      ))
    }

    return (
      loading && (
        <SkeletonComponent
          loading={loading}
          paragraph={{ rows: 20, width: '100%' }}
          margin="2% 5%"
          amount={6}
        />
      )
    )
  }, [blogs, loading])

  return (
    <BlogStyled
      className="blog-styled"
      // blogHeight={blogs.length < 3 || !isCategory}
    >
      <span className="blog-span-space" />
      <div className="blog-feed">
        {isCategory && renderBlogCards}
        {!isCategory && <BlogDetail />}
      </div>
      <div className="blog-side-bar-wrapper">
        <BlogSideBar isCategory={isCategory} blogDetail={blogDetail} />
      </div>
    </BlogStyled>
  )
}
