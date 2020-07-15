import React, { useState, useCallback } from "react"
import { darken, lighten } from "polished"
import { backupMain } from "./backup"
import styled from "styled-components"
import { getUidFromUsername } from "./io/fetch"
import { Mode, BackupEvent } from "./types"

const maxRollerLengeth = 480

const RollerContainer = styled.div`
  font-size: 14px;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-self: center;
  align-content: center;
  max-width: 420px;
`

const Char = styled.span`
  width: 14px;
  height: 21px;
`

const Button = styled.button`
  color: rgba(0, 0, 0, 0.72);
  margin-left: 16px;
  cursor: pointer;
  border-radius: 12px;
  padding: 12px 16px;
  background: ${(props) => props.theme.mainColor};
  transition-property: box-shadow, background;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
  box-shadow: 10px 10px 24px ${(props) => darken(0.05, props.theme.mainColor)},
    -10px -10px 24px ${(props) => lighten(0.05, props.theme.mainColor)};
  &:hover {
    background: ${(props) => lighten(0.012, props.theme.mainColor)};
    box-shadow: 12px 12px 32px ${(props) => darken(0.16, props.theme.mainColor)},
      -12px -12px 32px ${(props) => lighten(0.16, props.theme.mainColor)};
  }
  &:active {
    background: ${(props) => lighten(0.03, props.theme.mainColor)};
  }
`

const Input = styled.input`
  padding: 12px;
  border-radius: 12px;
  background: ${(props) => darken(0.02, props.theme.mainColor)};
  box-shadow: inset 6px 6px 12px
      ${(props) => darken(0.05, props.theme.mainColor)},
    inset -6px -6px 12px ${(props) => lighten(0.03, props.theme.mainColor)};
  border: none;
  &:focus {
    box-shadow: inset 6px 6px 12px
        ${(props) => darken(0.08, props.theme.mainColor)},
      inset -6px -6px 12px ${(props) => lighten(0.05, props.theme.mainColor)};
  }
`

const StatusTextMap: Record<BackupEvent, string> = {
  [BackupEvent.fetchUidStart]: "正在获取UID……",
  [BackupEvent.prefetchStart]: "穿梭机启动中……",
  [BackupEvent.prefetchFinish]: "穿梭机启动中……",
  [BackupEvent.fetchStart]: "穿梭机已经启动，请坐和放宽……",
  [BackupEvent.fetchFinish]: "穿梭机已经启动，请坐和放宽……",
  [BackupEvent.postFetchStart]: "结果验算中……",
  [BackupEvent.postFetchFinish]: "woohoo！备份成功！",
}

const InfoText = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.64);
  margin-top: 16px;
  text-align: center;
  position: fixed;
  right: 0;
  left: 0;
`

export const Backup = ({
  uid,
  setCurrentUID,
  setMode,
}: {
  uid?: string
  setCurrentUID(x: string): void
  setMode(x: Mode): void
}) => {
  const [username, setUsername] = useState<string>("")
  const [buffer, setBuffer] = useState<string[]>([])
  const [status, setStatus] = useState<BackupEvent>()
  const [error, setError] = useState<string>()
  const printer = useCallback((chars: string[]) => {
    setBuffer((prev) => prev.concat(chars))
  }, [])

  const toDisplay: string[] = []
  for (
    let i = buffer.length - 1;
    i >= buffer.length - maxRollerLengeth && i >= 0;
    i--
  ) {
    toDisplay[i % maxRollerLengeth] = buffer[i]
  }
  const activeIndex = (buffer.length - 1) % maxRollerLengeth

  return (
    <>
      {error ? (
        <InfoText>{`不好意思，${error}`}</InfoText>
      ) : status !== undefined ? (
        <InfoText>{StatusTextMap[status]}</InfoText>
      ) : null}

      {(status || 0) <= BackupEvent.fetchUidStart && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 60,
            flexGrow: 1,
          }}
        >
          {
            // Only show input field for first time user
            !uid && (
              <Input
                placeholder="输入你的微博昵称"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
              />
            )
          }
          <Button
            disabled={!username && !uid}
            onClick={async () => {
              try {
                setError(undefined)
                setStatus(BackupEvent.fetchUidStart)
                const uidToUse = uid || (await getUidFromUsername(username))
                await backupMain(uidToUse, {
                  printer,
                  onEvent: (e) => {
                    e === BackupEvent.postFetchFinish && setCurrentUID(uidToUse)
                    setStatus(e)
                  },
                })
              } catch (e) {
                console.error(e)
                setError(e.toString())
              }
            }}
          >
            {uid ? "更新备份" : "开始备份"}
          </Button>
        </div>
      )}

      {!!status && status >= BackupEvent.prefetchStart && (
        <>
          {status !== BackupEvent.postFetchFinish && (
            <RollerContainer>
              {toDisplay.map((c, i) => (
                <Char
                  key={i}
                  style={{
                    opacity: i <= activeIndex ? 1 - (activeIndex - i) / 100 : 0,
                  }}
                >
                  {c}
                </Char>
              ))}
            </RollerContainer>
          )}
          {status === BackupEvent.postFetchFinish && (
            <div
              style={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                paddingBottom: 48,
              }}
            >
              <Button
                onClick={() => {
                  setMode(Mode.browse)
                }}
              >
                开始浏览
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}
