import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"

import { Browse } from "./browse-page"
import { loadConfig, mergeJson, ensureDir } from "./io/file"
import { TitleBar } from "./view/title"
import { Mode } from "./types"
import { Backup } from "./backup-page"
import { paths } from "./config"

const Container = styled.div`
  height: 100%;
  padding: 48px 48px 0px 48px;
  background: ${(props) => props.theme.mainColor};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
`

export const App = () => {
  const [uid, setUid] = useState<string>()
  const [mode, setMode] = useState<Mode>()
  const [reversed, setReversed] = useState(true)
  useEffect(() => {
    const task = async () => {
      await ensureDir(paths.posts)
      const museumConfig = await loadConfig()
      if (museumConfig) {
        setUid(museumConfig.currentUID)
        setMode(Mode.browse)
      } else {
        setMode(Mode.backup)
      }
    }
    task()
  }, [])

  const setCurrentUID = useCallback((uid: string) => {
    // Stores current UID permanently
    mergeJson(paths.museumConfig, { currentUID: uid })
    // So when the user goes back to the backup page, it can use the updated props
    setUid(uid)
  }, [])

  return mode === undefined ? null : (
    <>
      <TitleBar
        mode={mode}
        setMode={setMode}
        reversed={reversed}
        setReversed={setReversed}
      />
      <Container
        // The dom element for modal portals.
        id="modal-container"
      >
        {mode === Mode.backup && (
          <Backup uid={uid} setCurrentUID={setCurrentUID} setMode={setMode} />
        )}
        {mode === Mode.browse && uid && (
          <Browse uid={uid} reversed={reversed} />
        )}
      </Container>
    </>
  )
}
