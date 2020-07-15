import React from "react"
import { render } from "react-dom"
import { ThemeProvider, StyleSheetManager } from "styled-components"
import { defaultTheme } from "./theme/theme"
import { GlobalStyle } from "./theme/global-style"
import { App } from "./app"

const Root = () => (
  // https://styled-components.com/docs/api#stylesheetmanager
  <StyleSheetManager disableVendorPrefixes>
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StyleSheetManager>
)

render(<Root />, document.getElementById("root"))
