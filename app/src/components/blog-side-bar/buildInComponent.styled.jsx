import styled from 'styled-components'
import { Card } from 'react-bootstrap'

const BlogCardSideBarStyled = styled(Card)`
  margin-bottom: 1em;
  .card-title {
    border-bottom: 1px solid #718096;
    cursor: pointer;
  }

  .category-title {
    margin-bottom: 0.4em;

    .category-item {
      &:hover {
        color: #00918b;
        font-weight: bold;
      }
      cursor: pointer;
      &.item-highlight {
        color: #02918b;
        font-weight: bold;
      }
    }

    @media screen and (max-width: 425px) {
      display: flex;
      flex-wrap: wrap;
      gap: 1em;
    }
  }
`

export { BlogCardSideBarStyled }
