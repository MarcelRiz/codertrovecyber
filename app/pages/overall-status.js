import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import DefaultLayout from '../src/layout/default'
import PageTitle from '../src/components/page-title'
import Main from '../src/components/main'
import OverallStatusTable from '../src/components/overall-status-table'
import OverallStatusTableDetail from '../src/components/overall-status-table-detail'
import DepartmentOverallTable from '../src/components/department-overall-status'
import withAuthenticated from '../src/hoc/withAuthenticated'
import withRole from '../src/hoc/withRole'
import { USER_ROLE } from '../src/constants'

function PageOverallStatus() {
  const [ isViewIndividualStats, setIsViewIndividualStats] = useState(true)
  const { companySummary } = useSelector(state => state.auth)
  const router = useRouter()

  const isOverallStatusDetail = useMemo(() => {
    const { pathname, query } = router
    if (pathname.includes('overall-status') && query && query.userId) {
      return true
    }
    return false
  }, [router])

  const setupHeaderContent = useMemo(() => {
    const { pathname, query } = router
    if (pathname.includes('overall-status') && query && query.userId) {
      return {
        title: 'Overall Status Detail',
        breadcrumbs: [
          {
            url: '/overall-status',
            text: 'Overall Status',
          },
        ]
      }
    }
    return {
      title: 'Overall Status'
    }
  }, [router])

  const changeView = useCallback(() => {
    setIsViewIndividualStats(prev => !prev)
  }, [])

  const getUserName = useMemo(() => {
    const { pathname, query } = router
    if (
      companySummary.overall && companySummary.overall.length > 0
      && pathname.includes('overall-status') && query && query.userId
    ) {
      const selectedUser = companySummary.overall.find(user => user.userId === Number(query.userId))
      return `- ${selectedUser.firstName} ${selectedUser.lastName}`
    }
    return ''
  }, [companySummary.overall, router])

  return (
    <DefaultLayout
      isHome={false}
      {...setupHeaderContent}
    >
      <PageTitle title={`${setupHeaderContent.title} ${getUserName}`}>
        {!isOverallStatusDetail && <div className="text-center mr-3">
          <OverlayTrigger
            key="right"
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip id="tooltip-right">
                { isViewIndividualStats? 'View departments stats' : 'View individual stats'}
              </Tooltip>
            }
          >
            <Button
              variant="neutral"
              className="rounded-pill btn-icon btn-icon-only"
              onClick={changeView}
            >
              <span className="btn-inner--icon">
                <FontAwesomeIcon icon={faExchangeAlt} />
              </span>
            </Button>
          </OverlayTrigger>
        </div>}
      </PageTitle>
      { isViewIndividualStats ? <Main>
        {
          isOverallStatusDetail
          ? <OverallStatusTableDetail/>
          : <OverallStatusTable />
        }
      </Main> : <Main>
        <DepartmentOverallTable />
      </Main>}
    </DefaultLayout>
  )
}

export default withRole(
  withAuthenticated(PageOverallStatus),
  USER_ROLE.CLIENT
)
