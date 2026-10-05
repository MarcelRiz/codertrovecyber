import styled from 'styled-components'

const BlogStyled = styled.div`
  /* height: ${props => (props.blogHeight ? '100vh' : 'auto')}; */
  width: auto;
  background: #efefef;
  /* background: #718096; */

  display: flex;
  flex-direction: row;
  justify-content: center;
  /* padding: 2em 0; */
  padding-bottom: 2em;
  /* margin: 2em 0; */
  gap: 1em;

  @media screen and (max-width: 425px) {
    flex-wrap: wrap-reverse;
  }

  .blog-span-space {
    flex-shrink: 40;

    width: 20%;
    @media screen and (max-width: 800px) {
      width: 0;
    }
  }

  .blog-feed {
    /* background-color: #3cb690; */
    flex-grow: 3;
    width: 50%;

    @media screen and (max-width: 800px) {
      width: auto;
    }
  }
  .blog-side-bar-wrapper {
    /* background-color: #b26ab7; */
    width: 20%;
    margin-right: 10%;

    @media screen and (max-width: 800px) {
      margin-right: 2%;
      width: auto;
    }
    @media screen and (max-width: 425px) {
      width: 100%;
      margin-right: 0;
    }
  }
`
export { BlogStyled }
