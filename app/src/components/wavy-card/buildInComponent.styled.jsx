import styled from 'styled-components'
import { Card } from 'react-bootstrap'

const StyledWavyCard = styled(Card)`
  width: 31.3%;
  margin: 1%;
  display: inline-block;

  .wavy-card {
    border-radius: 4%;
    aspect-ratio: 300/175;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('/images/haikei/layered-waves-haikei.svg');

    display: flex;
    flex-direction: column;

    .wavy-card-header {
      height: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .wavy-info {
        height: 60%;
        margin-left: 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .wavy-process {
          color: #fff;
          /* margin-bottom: 30%; */
        }
        .wavy-createdAt {
          color: #718096;
        }
      }

      .wavy-evaluate {
        margin-right: 10%;
        .wavy-evaluate-circle {
          border-radius: 50% !important;
          background-color: #171347;
          &.checked {
            background-color: #52c419;
          }
          &.noticed {
            background-color: #f8ad16;
            font-size: 2rem;
          }

          position: relative;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          font-size: 1rem;
          font-weight: 600;
          height: 5.5vh;
          width: 5.5vh;
        }
      }
    }

    .wavy-content {
      margin: 2% 5%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 600;
    }
  }
`
export { StyledWavyCard }
