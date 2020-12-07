<script lang="ts">
  import type { ChildProcessWithoutNullStreams } from "child_process"
  import { onMount } from "svelte"
  import { ChatInput, Header, ChatMessage, TypingMessage } from "./components"
  import type { Message } from "./global"
  import { Author, remote, path, cp, fs, shell } from "./global"

  let messages: Message[] = []
  let modelLoaded = false
  let pyProcess: ChildProcessWithoutNullStreams
  let chatElem: HTMLDivElement
  let typing = false

  onMount(async () => {
    console.log(
      `brain directory exists: ${fs.existsSync(
        path.join(remote.app.getAppPath(), "public", "brain")
      )}`
    )
    // shell.exec(
    //   `${path.join(
    //     remote.app.getAppPath(),
    //     "public",
    //     "brain",
    //     ".venv",
    //     "bin",
    //     "python"
    //   )} ${path.join(remote.app.getAppPath(), "public", "brain", "brain.py")}`,
    //   { async: true }
    // )
    pyProcess = cp.spawn(
      path.join(
        remote.app.getAppPath(),
        "public",
        "brain",
        ".venv",
        "bin",
        "python"
      ),
      [path.join(remote.app.getAppPath(), "public", "brain", "brain.py")]
    )
    addMessage(
      Author.Bot,
      `
      Loading model into GPU/CPU...

      Please note that this may take a long time because the model size is extremely huge!`
        .replace(/^ {4}/gm, "")
        .trimStart()
    )
    pyProcess.stdout.on("data", (data: Buffer) => {
      const message = data.toString("utf8")
      console.log(message)
      if (message.includes("LOADING_COMPLETE")) {
        console.log("Model loaded")
        modelLoaded = true
        addMessage(Author.Bot, "Model loading complete!")
      } else if (message.includes("BOT > ")) {
        const botResponse = message.split("\n")[1].replace("BOT > ", "")
        addMessage(Author.Bot, botResponse)
        typing = false
      }
    })
  })

  function addMessage(author: Author, message: string) {
    messages = [...messages, { author: author, body: message }]
    requestAnimationFrame(() => window.scrollTo(0, document.body.scrollHeight))
  }

  /**
   * Post a message to the python script
   */
  function sendMessage(text: string) {
    if (modelLoaded === true) {
      typing = true
      addMessage(Author.User, text)
      pyProcess.stdin.write(`${text}\n`)
    }
  }
</script>

<style>
  :global(:root) {
    --primary-color: #3366ff;
    --secondary-color: #f7f9fc;
  }

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .chat {
    flex: 1;
    padding: 10px;
  }
</style>

<main>
  <Header />

  <div class="chat" bind:this={chatElem}>
    {#each messages as message}
      <ChatMessage {message} />
    {/each}
    {#if typing}
      <TypingMessage />
    {/if}
  </div>

  <ChatInput onSubmit={sendMessage} />
</main>
