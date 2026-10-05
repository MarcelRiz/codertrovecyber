import React from 'react'
import withAuthenticated from '@src/hoc/withAuthenticated'
import DefaultLayout from '@src/layout/default'
import BlogComponent from '@components/blog'
import BreadcrumbComponent from '@components/breadcrumb'

function PageBlogs() {
  return (
    <>
      <DefaultLayout title="Blogs">
        <BreadcrumbComponent title="Blogs" />
        <BlogComponent />
      </DefaultLayout>
    </>
  )
}

export default withAuthenticated(PageBlogs)
