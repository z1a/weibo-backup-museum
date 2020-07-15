import React, { FC, HTMLAttributes } from "react"

interface Props extends HTMLAttributes<SVGElement> {
  path: string
}

export const SVG: FC<Props> = ({ path, ...props }) => (
  <svg height="24" viewBox="0 0 24 24" width="24" {...props}>
    <path d={path} />
  </svg>
)
