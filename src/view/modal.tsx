import React, { FC } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"

const Container = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`

interface ModalProps {
  id?: string
  onClose(): void
}

export const Modal: FC<ModalProps> = ({
  children,
  onClose,
  id = "modal-container",
}) => {
  const content = (
    <Container
      onClick={(e) => {
        e.target === e.currentTarget && onClose()
      }}
    >
      {children}
    </Container>
  )
  return createPortal(content, document.getElementById(id)!)
}
