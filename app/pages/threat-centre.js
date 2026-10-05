import React from 'react'
import { Badge, Tab, Tabs } from 'react-bootstrap'
import { List as IconList, File as IconFile } from 'react-feather'
import { useSelector } from 'react-redux'
import DefaultLayout from '../src/layout/default'
import PageTitle from '../src/components/page-title'
import Main from '../src/components/main'
import ActionItems from '../src/components/action-items'
import Reports from '../src/components/reports'
import withAuthenticated from '../src/hoc/withAuthenticated'
import withRole from '../src/hoc/withRole'
import { ACTION_ITEM_STATE, USER_ROLE } from '../src/constants'
import BannerScheduleMeeting from '../src/components/banner-schedule-meeting'

function PageActionCentre() {
  const { reports } = useSelector(state => state.reports)
  const user = useSelector(state => state?.auth?.session?.user)
  const companyUserActionItems = user?.companyUserActionItems

  /**
   * check if user completed all assessment (security audit)
   */
  /*
  const assessmentCompleted = useMemo(() => {
    const groupIds = questionGroups.map(item => item.id)
    const userGroupIds = userQuestionGroups.map(item => item.questionGroup)
    const notCompletedIds = groupIds.filter(
      item => !userGroupIds.includes(item)
    )

    return !(notCompletedIds.length > 0)
  }, [questionGroups, userQuestionGroups])
  */

  return (
    <DefaultLayout title="Threat Centre" isHome={false} backLink="/">
      <PageTitle title="Threat Centre" />

      <Main>
        <Tabs defaultActiveKey="action-items">
          <Tab
            eventKey="action-items"
            title={
              <div>
                <IconList size={14} className="mr-2" />
                Threat Items{' '}
                <Badge className="ml-2" variant="danger">
                  {
                    companyUserActionItems?.filter(
                      item => item.state === ACTION_ITEM_STATE.UNRESOLVED
                    ).length
                  }
                </Badge>
              </div>
            }
          >
            <BannerScheduleMeeting />
            <ActionItems unresolved />
          </Tab>
          <Tab
            eventKey="threatsEliminated"
            title={
              <div>
                <IconList size={14} className="mr-2" />
                Threats Eliminated{' '}
                <Badge className="ml-2" variant="success">
                  {
                    companyUserActionItems?.filter(
                      item => item.state !== ACTION_ITEM_STATE.UNRESOLVED
                    ).length
                  }
                </Badge>
              </div>
            }
          >
            <ActionItems unresolved={false} />
          </Tab>
          <Tab
            eventKey="reports"
            title={
              <div>
                <IconFile size={14} className="mr-2" />
                Reports{' '}
                {reports.length > 0 && (
                  <Badge className="ml-2" variant="success">
                    {reports.length}
                  </Badge>
                )}
              </div>
            }
          >
            <Reports />
          </Tab>
        </Tabs>
      </Main>
    </DefaultLayout>
  )
}

export default withRole(withAuthenticated(PageActionCentre), USER_ROLE.CLIENT)
