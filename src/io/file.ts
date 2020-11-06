import { promises } from "fs"
import { paths } from "../config"
import { MuseumPost, WeiboUser, MuseumConfig } from "../types"

export const getUserPostsPath = (uid: string) => `${paths.posts}/${uid}.json`

/**
 * https://github.com/jprichardson/node-fs-extra/tree/master/lib/path-exists
 */
export function pathExists(path: string) {
  return promises.access(path).then(
    () => true,
    () => false
  )
}

export async function ensureDir(path: string) {
  const exists = await pathExists(path)
  return exists ? Promise.resolve() : promises.mkdir(path, { recursive: true })
}

/**
 * If the file doesn't exist, `undefined` or `fallback` will be returned.
 */
async function readJsonSafe(file: string, fallback?: unknown) {
  try {
    const text = await promises.readFile(file, "utf8")
    return JSON.parse(text) as unknown
  } catch (e) {
    console.error(`Error reading the json ${file}`)
    console.error(e)
    return fallback
  }
}

export async function loadUsers() {
  return (await readJsonSafe(paths.users)) as
    | Record<string, WeiboUser>
    | undefined
}

export async function loadUserPosts(uid: string) {
  return (await readJsonSafe(getUserPostsPath(uid))) as
    | Record<string, MuseumPost>
    | undefined
}

export async function loadNextIDs() {
  return (await readJsonSafe(paths.nextIDs)) as
    | Record<string, string>
    | undefined
}

export async function loadConfig() {
  return (await readJsonSafe(paths.museumConfig)) as MuseumConfig | undefined
}

/**
 * Merge the content of `object` into `file`
 */
export async function mergeJson(file: string, object: object) {
  const original = (await readJsonSafe(file)) as object
  return promises.writeFile(
    file,
    JSON.stringify({ ...original, ...object }, null, 2)
  )
}

export async function getUsernameFromUID(uid: string) {
  const users = await loadUsers()
  return users?.[uid]?.screen_name
}
