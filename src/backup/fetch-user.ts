import { fetchPostsSinceID } from "./utils/api"
import { processPost } from "./utils/process-post"
import { MuseumPost } from "../types"
import { log } from "./utils/log"
import { mergeJson, loadUserPosts, getUserPostsPath } from "../io/file"
import { paths } from "../config"

export async function fetchUserLoop({
  uid,
  sinceID,
  realNextIDs,
  printer,
}: {
  uid: string
  sinceID?: string
  /**
   * See details in `fix-next-id.ts`
   */
  realNextIDs: Record<string, string>
  printer?(text: string): void
}) {
  const { cards, nextID } = await fetchPostsSinceID({ uid, sinceID })

  // Process andt merge data
  const mblogs = cards.filter((c) => c.card_type === 9).map((c) => c.mblog)

  // Print user contents to screen
  if (sinceID && printer) {
    mblogs.forEach((mblog) => {
      const textToPrint = mblog.text.split("//")[0].split("<")[0]
      printer(textToPrint)
    })
  }

  const { posts, users } = mblogs
    // Add next ID
    .map((mblog, index) => {
      if (index === mblogs.length - 1) {
        if (nextID) {
          // Use the next ID returned from the server
          mblog.museum_next_id = nextID
        } else {
          mblog.museum_is_earliest_post = true
        }
      } else {
        mblog.museum_next_id = mblogs[index + 1].id
      }
      return mblog
    })
    .map(processPost)
    .reduce(
      (acc, { users, posts }) => ({
        posts: { ...acc.posts, ...posts },
        users: { ...acc.users, ...users },
      }),
      { users: {}, posts: {} }
    )

  // Write to files
  const postsPerUser: Record<string, Record<string, MuseumPost>> = {}
  Object.entries(posts).forEach(([_k, post]) => {
    postsPerUser[post.museum_user_id] = postsPerUser[post.museum_user_id] || {}
    postsPerUser[post.museum_user_id][post.id] = post
  })
  for (const [currentUID, posts] of Object.entries(postsPerUser)) {
    await mergeJson(getUserPostsPath(currentUID), posts)
  }
  await mergeJson(paths.users, users)

  // Check if we need to continue
  if (nextID) {
    const allPost = (await loadUserPosts(uid))!

    /**
     * Helper function that finds the next post using `realNextIDs`
     */
    const getNextPost = (id: string) => {
      const key = `${uid}-${id}`
      if (allPost.hasOwnProperty(id)) {
        return allPost[id]
      } else if (
        realNextIDs.hasOwnProperty(key) &&
        allPost.hasOwnProperty(realNextIDs[key])
      ) {
        return allPost[realNextIDs[key]]
      }
      return null
    }

    // Skip existing posts
    let idToFetch = nextID
    let isEnd = false
    let count = 0
    while (idToFetch) {
      const nextPost = getNextPost(idToFetch)
      if (nextPost) {
        if (nextPost.museum_is_earliest_post) {
          isEnd = true
          break
        }
        // Next post already fetched
        if (nextPost.museum_next_id) {
          count++
          idToFetch = nextPost.museum_next_id
        } else {
          // Continue fetching
          break
        }
      } else {
        break
      }
    }
    count && log(`Skipped ${count} already fetched posts`)

    // Fetch next page
    try {
      !isEnd &&
        (await fetchUserLoop({ uid, sinceID: idToFetch, realNextIDs, printer }))
    } catch (e) {
      console.error(e)
    }
  }

  return `All posts fetched for user ${uid}`
}
