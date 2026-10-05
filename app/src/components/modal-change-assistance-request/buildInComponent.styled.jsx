/* eslint-disable no-nested-ternary */
import styled from 'styled-components'
import { Button } from 'react-bootstrap'

const StyledButton = styled(Button)`
  &.chat-container {
    position: fixed;
    right: 1.5em;
    bottom: 1.5em;
    z-index: 1;
    overflow: hidden;
    padding: 0.6em 1.2em;
    font-size: 0.875rem;

    .chat-content {
      display: flex;
      gap: 0.5em;
    }
  }
`
export { StyledButton }
