/* eslint-disable @typescript-eslint/no-var-requires */

import { app, BrowserWindow, dialog, shell as eShell } from "electron"
import * as path from "path"
import * as shell from "shelljs"
import * as fs from "fs"
import * as agent from "superagent"
import * as semver from "semver"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit()
}

const brainPath = path.join(app.getAppPath(), "public", "brain")

function createWindow() {
  // Cross platform solution for icons
  let icon: string
  if (process.platform === "linux") {
    icon = path.join(app.getAppPath(), "public", "icons", "png", "512x512.png")
  } else if (process.platform === "win32") {
    icon = path.join(app.getAppPath(), "public", "icons", "win", "icon.ico")
  } else if (process.platform === "darwin") {
    icon = path.join(app.getAppPath(), "public", "icons", "mac", "icon.icns")
  }

  const mainWindow = new BrowserWindow({
    height: 500,
    width: 400,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
    },
    icon,
  })

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"))
}

async function initWindow() {
  // Check for updates
  ;(async () => {
    const packageJson = await agent.get(
      "https://rawcdn.githack.com/raphtlw/raphael-chat/b0f0d4345a1c2adc0f923feda722ebcaf3fdd709/app/package.json"
    )
    const repoVersion = packageJson.body.version
    const currentVersion = app.getVersion()
    console.log(`Repository app version: ${repoVersion}`)
    console.log(`Current app version: ${currentVersion}`)
    if (semver.gt(repoVersion, currentVersion)) {
      console.log(`Current version is less than repo version`)
      dialog
        .showMessageBox(undefined, {
          message: "New update found",
          buttons: ["OK", "Download"],
        })
        .then(res => {
          if (res.response === 1) {
            eShell.openExternal("https://raphtlw.now.sh/raphael-chat")
          }
        })
    }
  })()

  if (!shell.which("python3")) {
    // Check if Python 3 is installed
    dialog.showMessageBoxSync(undefined, {
      title: "Python 3 is not installed",
      message: "Please install Python from https://www.python.org/downloads/",
    })
    eShell.openExternal("https://www.python.org/downloads/")
    app.quit()
  } else if (!shell.which("poetry")) {
    // Check if poetry is installed
    dialog.showMessageBoxSync(undefined, {
      title: "Poetry is not installed",
      message:
        "Please install poetry from https://python-poetry.org/docs/#installation",
    })
    eShell.openExternal("https://python-poetry.org/docs/#installation")
    app.quit()
  } else if (!fs.existsSync(path.join(brainPath, ".venv"))) {
    // Install dependencies
    shell.cd(brainPath)
    const poetryInstallCommand = shell.exec("poetry install", {
      silent: false,
      async: true,
    })
    poetryInstallCommand.stdout.on("end", () => {
      createWindow()
    })
  } else {
    createWindow()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", initWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Hot reloading
try {
  require("electron-reloader")(module)
} catch (_) {}
