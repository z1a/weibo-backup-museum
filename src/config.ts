import { remote } from "electron"
import { resolve } from "path"

const { app } = remote
const appPath = app.getPath("documents")

export const paths = {
  posts: resolve(appPath, "./weibo-museum/data/posts"),
  users: resolve(appPath, "./weibo-museum/data/users.json"),
  nextIDs: resolve(appPath, "./weibo-museum/data/real-next-ids.json"),
  assets: resolve(appPath, "./weibo-museum/assets"),
  museumConfig: resolve(appPath, "./weibo-museum/data/museum-config.json"),
}

export const DEBUG = true
export const THROTTLE = 1000
export const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15"

// Max amount of posts that can be dislpayed in the browse page
// 500 posts uses around 1GB of memory
export const MAX_POSTS = 500
// How many posts to load at once
export const POSTS_LOAD_SIZE = 100
