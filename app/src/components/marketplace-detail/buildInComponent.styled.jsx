import styled from 'styled-components'

const MarketplaceDetailStyled = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0;
  padding: 0 3em;
  @media screen and (max-width: 800px) {
    flex-wrap: wrap;
    padding: 0 1em;
  }

  .detail-image {
    img {
      width: 58vw;
      overflow: hidden;
      @media screen and (max-width: 800px) {
        width: 100%;
      }
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
        transition: filter 3s;

        > img {
          opacity: 1;
          transition: opacity 3s;
        }
      }
    }
  }

  .detail-content {
    margin-left: 1vw;
    background-color: #f7f3ee;
    padding: 2em 2em;
    width: 100%;

    .title {
      color: #3cb690;
      font-weight: bold;
      font-size: xx-large;
    }
    .content {
      margin-top: 2vh;
      margin-bottom: 3vh;
      font-weight: 600;
    }
    .marketplace-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      text-align: center;
      font-size: large;

      background-color: #3cb690;
      border-radius: 0.3rem;
      height: 2.5em;
      width: 40%;
      min-width: 10em;
      color: #fff;

      &:hover {
        cursor: pointer;
        color: #dff5f4;
      }
    }
  }
`
export { MarketplaceDetailStyled }
