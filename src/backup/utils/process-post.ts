import { MuseumPost, WeiboPost, WeiboUser } from "../../types"
import { parseTime } from "./parse-time"

type ProcessPost = (
  mblog: WeiboPost
) => {
  posts: Record<string, MuseumPost>
  users: Record<string, WeiboUser>
}

export const processPost: ProcessPost = (mblog) => {
  const { user, retweeted_status, ...others } = mblog
  // User can be null for deleted post.
  const userID = user?.id
  const museumPost: MuseumPost = {
    museum_created_at_unix: parseTime(mblog.created_at).valueOf(),
    museum_user_id: userID,
    museum_retweeted_status_id: retweeted_status
      ? retweeted_status.id
      : undefined,
    museum_retweeted_user_id: retweeted_status
      ? retweeted_status.user?.id
      : undefined,
    ...others,
  }
  const processedRetweeted = retweeted_status
    ? processPost(retweeted_status)
    : undefined

  return {
    posts: {
      ...(processedRetweeted && processedRetweeted.posts),
      [museumPost.id]: museumPost,
    },
    users: {
      ...(processedRetweeted && processedRetweeted.users),
      ...(user && { [userID]: user }),
    },
  }
}
