import styled from 'styled-components'

const MarketplaceStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1em 5%;

  .card {
    width: 30%;
    min-width: 10em;
    margin-left: 2%;

    @media screen and (max-width: 768px) {
      width: 45%;
      margin-left: 4%;
    }
    @media screen and (max-width: 425px) {
      width: 100%;
      margin-left: 4%;
    }

    .header-image {
      /* height: 20vh; */
      height: 28vh;
      border-radius: 0.75rem 0.75rem 0 0;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
        min-height: 28vh;
      }

      .lazy-load-image-background {
        width: 100%;
        &.blur {
          filter: blur(15px);

          > img {
            opacity: 0;
          }
        }

        &.lazy-load-image-loaded {
          filter: blur(0);
          transition: filter 0.3s;

          > img {
            opacity: 1;
            transition: opacity 0.3s;
          }
        }
      }
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      /* height: 50%; */

      .card-body {
        padding: 1em;

        .card-title {
          text-align: center;
          cursor: pointer;
          margin-bottom: 0.5em;
          color: #3cb690;
          font-weight: bold;
          &:hover {
            color: #00918b;
          }

          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }

      .marketplace-card-footer {
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        text-align: center;
        font-size: large;

        border-radius: 0 0 0.75rem 0.75rem;
        background-color: #3cb690;
        color: #fff;

        &:hover {
          cursor: pointer;
          color: #dff5f4;
        }
      }
    }
  }
`
export { MarketplaceStyled }
