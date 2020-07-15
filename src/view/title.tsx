import React from "react"
import styled from "styled-components"
import { SVG } from "./svg"
import { svgPaths } from "../assets/svg-paths"
import { remote } from "electron"
import { Mode } from "../types"

const TitleBarC = styled.div`
  -webkit-app-region: drag;
  width: 100%;
  height: 48px;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(16px);
  display: flex;
  position: fixed;
`

const ButtonBase = styled.button`
  -webkit-app-region: no-drag;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.12);
  }
`

const IconButton = styled(ButtonBase)`
  height: 48px;
  width: 48px;
`

interface ButtonProps {
  active?: boolean
}

const Button = styled(ButtonBase)<ButtonProps>`
  padding: 16px 24px;
  background-color: ${({ active }) =>
    active ? "rgba(255, 255, 255, 0.24)" : "transparent"};
`

export const TitleBar = ({
  mode,
  setMode,
  reversed,
  setReversed,
}: {
  mode: Mode
  setMode(mode: Mode): void
  reversed: boolean
  setReversed(x: boolean): void
}) => {
  return (
    <TitleBarC>
      <Button
        active={mode === Mode.backup}
        onClick={() => {
          setMode(Mode.backup)
        }}
      >
        备份
      </Button>
      <Button
        active={mode === Mode.browse}
        onClick={() => {
          setMode(Mode.browse)
        }}
      >
        浏览
      </Button>
      <Button
        style={{ marginLeft: "auto" }}
        onClick={() => {
          setReversed(!reversed)
        }}
      >
        {reversed ? "倒序" : "正序"}
      </Button>
      <IconButton
        onClick={() => {
          remote.getCurrentWindow().close()
        }}
      >
        <SVG path={svgPaths.close} />
      </IconButton>
    </TitleBarC>
  )
}
