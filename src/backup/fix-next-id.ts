import { MuseumPost } from "../types"
import { log } from "./utils/log"
import { fetchPostsSinceID } from "./utils/api"
import { parseTime } from "./utils/parse-time"
import { paths } from "../config"
import {
  loadUserPosts,
  mergeJson,
  getUserPostsPath,
  loadNextIDs,
} from "../io/file"

async function fetchRealPostID(uid: string, postID: string) {
  const { cards } = await fetchPostsSinceID({ uid, sinceID: postID, count: 10 })
  return cards[0].mblog.id
}

/**
 * Sometimes the `nextID` returned from the server
 * points to a post that doesn't exist, or has another ID.
 * In such cases, we need a mapping between `nextID` to the
 * real ID in our database.
 *
 * This function builds the mapping for a single user.
 */
export async function fixNextId({ uid }: { uid: string }) {
  const realNextIDs = (await loadNextIDs()) || {}
  const posts = (await loadUserPosts(uid)) || {}

  for (const k in posts) {
    const post = posts[k]
    const {
      museum_next_id: nextID,
      museum_created_at_unix,
      museum_is_earliest_post,
      id,
    } = post
    const key = `${uid}-${nextID}`

    if (!nextID) {
      if (museum_is_earliest_post) {
        continue
      }

      // The post is not marked as the earliest post, and doesn't have a next ID.
      // It is probably fetched before as someone's retweet.
      log(
        `Post ${id} is not marked as the earliest post, and doesn't have a next ID. Checking if earlier post exists...`
      )

      // Try to fetch older posts
      const { cards } = await fetchPostsSinceID({ uid, sinceID: id, count: 10 })

      if (
        cards[0] &&
        parseTime(cards[0].mblog.created_at).valueOf() <= museum_created_at_unix
      ) {
        // There are older posts
        log(`Post ${id} is not the earliest post.`)
      } else {
        log(`Post ${id} is the earliest post. Adding the flag.`)
        const newPost: MuseumPost = {
          ...post,
          museum_is_earliest_post: true,
        }
        await mergeJson(getUserPostsPath(uid), {
          [id]: newPost,
        })
      }
      return
    }

    if (!posts.hasOwnProperty(nextID)) {
      const realNextID = realNextIDs[key]
      if (realNextID) {
        if (!posts.hasOwnProperty(realNextID)) {
          log(
            `${realNextID} is not found in ${uid}.json. Probably is it not fetched yet.`
          )
        }
      } else {
        log(`Fetching the real next ID for ${nextID}...`)
        const realNextID = await fetchRealPostID(uid, nextID)
        await mergeJson(paths.nextIDs, { [key]: realNextID })
        log(`Real next ID updated: ${nextID} => ${realNextID}`)
      }
    }
  }
}
