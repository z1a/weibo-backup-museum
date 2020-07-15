import React, { FC, useState, useEffect } from "react"
import styled from "styled-components"
import { darken, lighten } from "polished"
import { loadUserPosts } from "../io/file"
import { Pic } from "./pic"
import { MuseumPost, WeiboUser } from "../types"

interface PostContainerProps {
  nested?: boolean
}

const PostC = styled.div<PostContainerProps>`
  font-size: 1em;
  margin: ${(props) => (props.nested ? "16px 0 0 0" : "24px 0px")};
  padding: 16px;
  border-radius: 12px;
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
`

const Pics = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const processText = (t: string) =>
  t
    // Force opening in a new OS native window
    .replace(/<a /g, '<a target="_blank" class="postLink" ')
    // Replace local to remote
    .replace(/href=('|")\//g, "href=$1https://m.weibo.cn/")

interface PostProps {
  htmlText: string
  retweetID?: string
  retweetUserID?: string
  nested?: boolean
  pics?: string[]
  // Below for displaying user name
  users: Record<string, WeiboUser>
  uid: string
}

export const Post: FC<PostProps> = ({
  uid,
  users,
  htmlText,
  retweetID,
  retweetUserID,
  nested,
  pics,
}) => {
  let processed = processText(htmlText)
  // Add retweeter's name
  nested &&
    (processed = `<a target="_blank" class="postLink" href="https://m.weibo.cn/u/${users[uid].id}">@${users[uid].screen_name}</a> ${processed}`)
  const [retweet, setRetweet] = useState<MuseumPost>()
  useEffect(() => {
    if (retweetID && retweetUserID) {
      loadUserPosts(retweetUserID).then(
        (posts) => posts && setRetweet(posts[retweetID])
      )
    }
  }, [retweetID, retweetUserID])
  return (
    <PostC nested={nested}>
      <div dangerouslySetInnerHTML={{ __html: processed }} />
      {pics && (
        <Pics>
          {pics.map((url) => {
            return <Pic key={url} url={url} />
          })}
        </Pics>
      )}
      {retweet && (
        <Post
          htmlText={retweet?.text}
          nested
          pics={
            retweet.pics ? retweet.pics.map((pic) => pic.large.url) : undefined
          }
          users={users}
          uid={retweetUserID!}
        />
      )}
    </PostC>
  )
}
