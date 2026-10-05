import React from 'react'
import { Clock as IconClock, Check as IconCheck } from 'react-feather'
import { StyledWavyCard } from './buildInComponent.styled'

export default function BlogComponent() {
  return (
    <>
      <StyledWavyCard className="hover-shadow-lg">
        <div className="wavy-card">
          <div className="wavy-card-header">
            <span className="wavy-info">
              <span className="wavy-process">
                <b>In Process</b>
              </span>
              <span className="wavy-createdAt">
                <IconClock />
                20/01/2022 10:03
              </span>
            </span>
            <span className="wavy-evaluate">
              <span className="wavy-evaluate-circle">...</span>
            </span>
          </div>
          <div className="wavy-content">
            http://testphp.vulnweb.com/dasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </div>
        </div>
      </StyledWavyCard>

      <StyledWavyCard className="hover-shadow-lg">
        <div className="wavy-card">
          <div className="wavy-card-header">
            <span className="wavy-info">
              <span className="wavy-process">
                <b>Completed</b>
              </span>
              <span className="wavy-createdAt">
                <IconClock />
                20/01/2022 10:03
              </span>
            </span>
            <span className="wavy-evaluate">
              <span className="wavy-evaluate-circle checked">
                <IconCheck size={30} />
              </span>
            </span>
          </div>
          <div className="wavy-content">
            http://testphp.vulnweb.com/dasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </div>
        </div>
      </StyledWavyCard>

      <StyledWavyCard className="hover-shadow-lg">
        <div className="wavy-card">
          <div className="wavy-card-header">
            <span className="wavy-info">
              <span className="wavy-process">
                <b>Completed</b>
              </span>
              <span className="wavy-createdAt">
                <IconClock />
                20/01/2022 10:03
              </span>
            </span>
            <span className="wavy-evaluate">
              <span className="wavy-evaluate-circle noticed">!</span>
            </span>
          </div>
          <div className="wavy-content">
            http://testphp.vulnweb.com/dasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </div>
        </div>
      </StyledWavyCard>
    </>
  )
}
