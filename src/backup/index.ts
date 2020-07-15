import { log, PrintBuffer } from "./utils/log"
import { fetchUserLoop } from "./fetch-user"
import { fixNextId } from "./fix-next-id"
import { ensureDir, loadNextIDs } from "../io/file"
import { paths } from "../config"
import { BackupEvent } from "../types"

interface Options {
  onEvent(event: BackupEvent): void
  printer(x: string[]): void
}

export async function backupMain(uid: string, { onEvent, printer }: Options) {
  const printBuffer = new PrintBuffer(printer)
  await ensureDir(paths.posts)
  log("Checking integrity for user", uid)
  onEvent(BackupEvent.prefetchStart)
  await fixNextId({ uid })
  log("Integrity check finished")
  onEvent(BackupEvent.prefetchFinish)

  const realNextIDs = (await loadNextIDs()) || {}
  onEvent(BackupEvent.fetchStart)
  const result = await fetchUserLoop({
    uid,
    realNextIDs,
    printer: printBuffer.add,
  })
  onEvent(BackupEvent.fetchFinish)
  log(result)

  log(`Checking integrity for user ${uid} (after fetch)`)
  onEvent(BackupEvent.postFetchStart)
  await fixNextId({ uid })
  log("Integrity check finished")
  onEvent(BackupEvent.postFetchFinish)
}
