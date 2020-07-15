import React, { useEffect, useState, FC, useRef } from "react"
import { loadUserPosts, loadUsers } from "./io/file"
import { Post } from "./view/post"
import { MuseumPost, WeiboUser } from "./types"
import { useEventListener } from "./view/use-event-listener"
import { MAX_POSTS, POSTS_LOAD_SIZE } from "./config"

interface Props {
  uid: string
  reversed: boolean
}

export const Browse: FC<Props> = ({ uid, reversed }) => {
  const [posts, setPosts] = useState<Record<string, MuseumPost>>()
  const [users, setUsers] = useState<Record<string, WeiboUser>>()
  // [m, n] that displays the posts from index `m` to `n - 1` (including `n - 1`)
  const [[startIndex, endIndex], setDisplayRange] = useState<[number, number]>([
    0,
    0,
  ])
  const loadingRef = useRef(false)
  useEffect(() => {
    loadUserPosts(uid).then(setPosts)
    loadUsers().then(setUsers)
  }, [uid])

  const totalCount = Object.keys(posts || {}).length
  useEffect(() => {
    setDisplayRange([0, Math.min(POSTS_LOAD_SIZE, totalCount)])
  }, [totalCount])
  useEffect(() => {
    loadingRef.current = false
  }, [startIndex, endIndex])
  useEventListener(
    "scroll",
    (ev) => {
      const elm = ev.target as HTMLDivElement
      const distanceToTop = elm.scrollTop
      const distanceToBottom =
        elm.scrollHeight - elm.scrollTop - elm.offsetHeight
      if (
        !loadingRef.current &&
        distanceToBottom < 1200 &&
        endIndex < totalCount
      ) {
        // Prevent multiple triggers while loading
        loadingRef.current = true
        const newEnd = Math.min(totalCount, endIndex + POSTS_LOAD_SIZE)
        const newStart = Math.max(0, newEnd - MAX_POSTS)
        setDisplayRange([newStart, newEnd])
      }
      if (!loadingRef.current && distanceToTop < 1200 && startIndex > 0) {
        // Prevent multiple triggers while loading
        loadingRef.current = true
        const newStart = Math.max(0, startIndex - POSTS_LOAD_SIZE)
        const newEnd = Math.min(totalCount, newStart + MAX_POSTS)
        setDisplayRange([newStart, newEnd])
      }
    },
    document.getElementById("modal-container")
  )

  let ids = Object.keys(posts || {}).sort()
  ids = reversed ? ids.reverse() : ids
  ids = ids.slice(startIndex, endIndex)

  return posts && users ? (
    <>
      {ids.map((id) => (
        <Post
          users={users}
          key={id}
          htmlText={posts[id].text}
          retweetID={posts[id].museum_retweeted_status_id}
          retweetUserID={posts[id].museum_retweeted_user_id}
          pics={
            posts[id].pics
              ? posts[id].pics?.map((pic) => pic?.large?.url)
              : undefined
          }
          uid={posts[id].museum_user_id}
        />
      ))}
    </>
  ) : null
}
