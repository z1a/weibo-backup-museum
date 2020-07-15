import { createGlobalStyle } from "styled-components"
import { darken } from "polished"

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    margin: 0;
    height: inherit;
    font-family: -apple-system, system-ui, Microsoft YaHei;
    color: rgba(0, 0, 0, 0.8);
  }

  #root {
    height: inherit;
  }

  a.postLink {
    color: ${(props) => darken(0.4, props.theme.mainColor)};
    text-decoration: none;
    &:hover {
      color: ${(props) => darken(0.2, props.theme.mainColor)};
    }
  }

  button {
    font-family: inherit;
    background-color: transparent;
    border: none;
    &:focus {
      outline: none;
    }
    padding: 0;
  }

  input {
    font-family: inherit;
    &:focus {
      outline: none;
    }
  }
`
