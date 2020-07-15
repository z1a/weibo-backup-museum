import { buildURL } from "./build-url"
import { baseFetch } from "./base-fetch"
import { WeiboPage } from "../../types"

/**
 * - Usually, the first card's id will be same as `sinceID`,
 * but it can be wrong if the post is old.
 * - If `sinceID` is undefined, fetch the first page.
 */
export async function fetchPostsSinceID({
  uid,
  sinceID,
  // As of 2020-07-04, the max effective count is 25
  count = 25,
}: {
  uid: string
  sinceID?: string
  count?: number
}) {
  const url = buildURL("https://m.weibo.cn/api/container/getIndex", {
    type: "uid",
    value: uid,
    containerid: `107603${uid}`,
    since_id: sinceID,
    count,
  })
  const payload = await baseFetch(url)
  const {
    data: { cards, cardlistInfo },
  }: WeiboPage = await payload.json()

  return { cards, nextID: cardlistInfo?.since_id }
}
