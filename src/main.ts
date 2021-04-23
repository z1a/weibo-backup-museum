import {} from "react"
import { app, BrowserWindow, shell } from "electron"

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      // TODO: Check if it is necessary to disable it
      nodeIntegration: true,
      // TODO: Check if it is necessary to disable it
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })

  // and load the index.html of the app.
  win.loadFile(`${__dirname}/index.html`)

  // Use OS native browser to open external links
  win.webContents.on("new-window", (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })
}

// TODO: Check https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = false

app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
