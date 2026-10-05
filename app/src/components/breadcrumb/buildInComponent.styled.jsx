import styled from 'styled-components'

const BreadcrumbStyled = styled.div`
  background: ${props =>
    props.backgroundColor ? props.backgroundColor : '#efefef'};
  width: 100%;
  padding-left: 20%;
  padding-right: 10%;
  @media screen and (max-width: 800px) {
    padding: 0 5%;
  }

  .breadcrumb {
    .breadcrumb-item {
      &.active {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        @media screen and (max-width: 1154px) {
          width: 30em;
        }
        @media screen and (max-width: 836) {
          width: 30em;
        }
        @media screen and (max-width: 652px) {
          width: 20em;
        }
        @media screen and (max-width: 473px) {
          width: 16em;
        }
        @media screen and (max-width: 402px) {
          width: 10em;
        }
      }
    }
  }
`

export { BreadcrumbStyled }
