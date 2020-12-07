const remote: typeof import("electron").remote = window.globalThis.require(
  "electron"
).remote
const path: typeof import("path") = remote.require("path")
const cp: typeof import("child_process") = remote.require("child_process")
const fs: typeof import("fs") = remote.require("fs")
const shell: typeof import("shelljs") = remote.require("shelljs")

export { remote, path, cp, fs, shell }

export enum Author {
  Bot = "Bot",
  User = "You",
}

export type Message = {
  author: Author
  body: string
}
