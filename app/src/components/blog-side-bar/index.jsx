import React, { useEffect, useCallback, useState } from 'react'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getBlogCategories } from '@states/blog'
import { BlogCardSideBarStyled } from './buildInComponent.styled'

const { Body: CardBody, Title: CardTitle } = Card
export default function BlogComponent({ isCategory = true, blogDetail }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { categories } = useSelector(state => state.blog)
  const { query } = router
  const [, mimicForceUpdate] = useState(false)

  useEffect(() => {
    dispatch(getBlogCategories())
    mimicForceUpdate()
  }, [])

  const formatCategoryItem = useCallback(
    category => {
      let isHighLight = ''
      if (
        !isCategory &&
        blogDetail &&
        blogDetail.categoryId?.id &&
        category.id === blogDetail.categoryId.id
      ) {
        isHighLight = 'item-highlight'
      }
      if (
        isCategory &&
        query &&
        query.category &&
        Number(query.category) === category.id
      ) {
        isHighLight = 'item-highlight'
      }
      return isHighLight
    },
    [blogDetail, isCategory, query]
  )

  const dispatchRouter = useCallback(
    cateId => {
      if (isCategory && cateId && Number(query.category) === cateId) {
        router.push('/blogs')
      } else {
        router.push(`/blogs?category=${cateId}`)
      }
    },
    [query, blogDetail, isCategory]
  )

  return (
    <BlogCardSideBarStyled className="blog-right-side-bar">
      <CardBody>
        <CardTitle
          className="blog-category-title"
          role="presentation"
          onClick={() => router.push('/blogs')}
        >
          Categories
        </CardTitle>
        <div className="category-title">
          {categories.length > 0 &&
            categories.map(category => (
              <div
                className={`category-item ${formatCategoryItem(category)}`}
                key={category.id}
                role="presentation"
                onClick={() => dispatchRouter(category.id)}
              >
                {category.name}
              </div>
            ))}
        </div>
      </CardBody>
    </BlogCardSideBarStyled>
  )
}
