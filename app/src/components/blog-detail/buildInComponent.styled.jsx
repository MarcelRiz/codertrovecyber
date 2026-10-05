import styled from 'styled-components'

const BlogCardDetailStyled = styled.div`
  .header-image {
    max-height: 33vh;
    overflow: hidden;

    img {
      border-radius: 0.75rem 0.75rem 0 0;
      width: 100%;
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

  .content-wrapper {
    border-radius: 0 0 0.75rem 0.75rem;

    .author-wrapper {
      display: flex;
      cursor: pointer;
      flex-wrap: wrap;

      .author-avatar {
        margin-right: 1em;
      }
      .author-info {
        display: flex;
        gap: 1%;
        width: 80%;
      }
      .blog-author-name {
        color: #3cb690;
      }
    }

    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 2em;
    @media screen and (max-width: 768) {
      padding: 1em;
    }

    .card-body {
      padding: 1.75rem 0;
      padding-top: 1rem;
      .card-title {
        margin-bottom: 0.2em;
        color: #3cb690;
        font-weight: bold;
        font-size: xx-large;
      }

      .category-tag {
        display: inline-block;
        cursor: pointer;

        &:hover {
          padding: 0 0.5em;
          border-radius: 0.75rem;
          background-color: #6c757d;
          color: #fff;
        }
      }
    }
  }
`
export { BlogCardDetailStyled }
