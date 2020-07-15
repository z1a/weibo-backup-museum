import React, { useState, useEffect, FC } from "react"
import { museumFetch } from "../io/fetch"
import styled from "styled-components"
import { darken } from "polished"
import { Modal } from "./modal"

const Img = styled.img`
  cursor: pointer;
  border-radius: 8px;
  margin: 16px 16px 0 0;
  height: 128px;
  width: 128px;
  object-fit: cover;
  transition: box-shadow 0.3s ease-out;
  box-shadow: 4px 4px 12px ${(props) => darken(0.12, props.theme.mainColor)};
  &:hover {
    box-shadow: 6px 6px 20px ${(props) => darken(0.24, props.theme.mainColor)};
  }
`

const FullImg = styled.img`
  max-height: 80%;
  max-width: 80%;
`

interface PicProps {
  url: string
}

export const Pic: FC<PicProps> = ({ url }) => {
  const [img, setImg] = useState("")
  const [open, setOpen] = useState(false)
  useEffect(() => {
    museumFetch(url).then(setImg, () => {})
  }, [url])

  return img ? (
    <>
      <Img
        src={img}
        onClick={() => {
          setOpen(true)
        }}
      />
      {open && (
        <Modal
          onClose={() => {
            setOpen(false)
          }}
        >
          <FullImg src={img} />
        </Modal>
      )}
    </>
  ) : null
}
