import styled from 'styled-components'
import { Card } from 'react-bootstrap'

const BlogCardStyled = styled(Card)`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;

  ${props => props.hasImage && {}}
  .header-image {
    height: ${props => (props.hasImage ? '20vh' : 0)};
    border-radius: 0.75rem 0.75rem 0 0;
    overflow: hidden;
    cursor: pointer;

    img {
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
    flex-direction: row;
    border-radius: 0.75rem;
    background-color: white;

    margin-bottom: 0.4em;

    .author-avatar {
      margin-top: 1.2em;
      min-width: 4em;
      display: flex;
      justify-content: center;
    }

    .card-body {
      padding: 1em;
      .card-title {
        cursor: pointer;
        margin-bottom: 0.5em;
        color: #3cb690;
        font-weight: bold;
        font-size: x-large;
        &:hover {
          color: #00918b;
        }
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

    .blog-card-footer {
      display: flex;
      gap: 0.5%;

      .blog-author-name {
        color: #3cb690;
      }
    }
  }
`
export { BlogCardStyled }
