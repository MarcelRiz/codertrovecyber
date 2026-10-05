import React from 'react'
import withAuthenticated from '@src/hoc/withAuthenticated'
import DefaultLayout from '@src/layout/default'
import BlogComponent from '@components/blog'
import BreadcrumbComponent from '@components/breadcrumb'
import { useSelector } from 'react-redux'

function PageBlogs() {
  const { blogDetail } = useSelector(state => state.blog)

  return (
    <>
      <DefaultLayout title="Blog">
        <BreadcrumbComponent
          title={blogDetail.title}
          breakCrumbs={[
            {
              text: 'Blogs',
              url: '/blogs',
            },
          ]}
        />
        <BlogComponent />
      </DefaultLayout>
    </>
  )
}

export default withAuthenticated(PageBlogs)
