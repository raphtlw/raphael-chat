/* eslint-disable @typescript-eslint/no-var-requires */

import { app, BrowserWindow, dialog, shell as eShell } from "electron"
import * as path from "path"
import * as shell from "shelljs"
import * as fs from "fs"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit()
}

const brainPath = path.join(app.getAppPath(), "public", "brain")

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 500,
    width: 400,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
    },
  })

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"))
}

function initWindow() {
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
