import React, { useEffect, useState } from 'react'
import { Pagination } from 'react-bootstrap'

const PaginationOwn = ({ itemPerPage, totalItems, pageChange }) => {
  const [page, setPage] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const getPage = () => {
      const pageCount = Math.ceil(totalItems / itemPerPage)
      const current = currentPage
      const delta = 3
      const range = []

      for (let index = Math.max(2, currentPage - delta); index <= Math.min(pageCount - 1, current + delta); index += 1) {
        range.push(index)
      }

      if (current - delta > 2) {
        range.unshift('...')
      }
      if (current + delta < pageCount - 1 && pageCount > 3) {
        range.push('...')
      }
      range.unshift(1)
      range.push(pageCount)
      setPage(range)
    }
    getPage()
  }, [currentPage])

  const changePage = (current) => {
    setCurrentPage(current)
    pageChange(current)
  }

  const nextPage = () => {
    if(currentPage < Math.ceil(totalItems / itemPerPage)) {
      const index = currentPage + 1
      setCurrentPage(index)
      pageChange(index)
    }
  }

  const prevPage = () => {
    if(currentPage > 1) {
      const index = currentPage - 1
      setCurrentPage(index)
      pageChange(index)
    }
  }

  return (
    <>
      <Pagination className="mx-auto">
        <Pagination.Prev  onClick={() => prevPage()} />
        {
          page.map((item) => {
            if (item !== '...') {
              if(currentPage === item) {
                return <Pagination.Item active key={`page_${item}`}>{item}</Pagination.Item>
              }
              return <Pagination.Item onClick={() => changePage(item)} key={`page_${item}`}>{item}</Pagination.Item>
            }
            return <Pagination.Ellipsis />
          })
        }
        <Pagination.Next onClick={() => nextPage()} />
      </Pagination>
    </>
  )
}

export default PaginationOwn