import { join, dirname } from "path"
import { promises } from "fs"
import { paths } from "../config"
import { ensureDir } from "./file"

/**
 * Fetch a static asset, such as an image, and save it to the disk.
 * If the file already exists on the disk, its path will be directly returned.
 */
export async function museumFetch(url: string) {
  const urlObj = new URL(url)
  const localFilePath = join(paths.assets, urlObj.hostname, urlObj.pathname)
  try {
    await promises.access(localFilePath)
    // console.log("Using local file", url)
    return localFilePath
  } catch {}
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    await ensureDir(dirname(localFilePath))
    await promises.writeFile(localFilePath, Buffer.from(arrayBuffer))
    // console.log("successfully wrote to", localFilePath)
    return localFilePath
  } catch (err) {
    console.error("Unable to fetch and save", err)
    throw err
  }
}

export async function getUidFromUsername(username: string) {
  const response = await fetch(`https://m.weibo.cn/n/${username}`)
  const parts = response.url.split("/")
  // User doesn't exist
  if (parts[parts.length - 2] === "n") {
    throw Error("用户不存在")
  }
  return parts[parts.length - 1]
}
