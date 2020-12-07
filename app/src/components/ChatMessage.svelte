<script lang="ts">
  import type { Message } from "../global"
  import { Author } from "../global"

  export let message: Message

  const isBot = message.author === Author.Bot
</script>

<style>
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 0.5rem 0rem;
  }
  .author {
    color: grey;
    font-size: 0.9rem;
  }
  .msg-body {
    padding: 0.8rem 0.8rem;
    background-color: var(--primary-color);
    border-radius: 0px 10px 10px 10px;
    width: fit-content;
    max-width: 70vw;
    color: white;
    margin-top: 0.2rem;
  }
  .msg-body p {
    font-size: 0.95rem;
    word-wrap: break-word;
    text-align: left;
    white-space: pre-line;
  }
  .inner {
    display: flex;
    flex-direction: column;
  }
  .bot {
    justify-content: flex-start;
    text-align: left;
  }
  .user {
    justify-content: flex-end;
    text-align: right;
  }
</style>

<div class="main {isBot ? 'bot' : 'user'}">
  <div class="inner">
    <p class="author">{message.author}</p>
    <div
      class="msg-body"
      style="
      border-radius: {isBot ? '0px 10px 10px 10px' : '10px 0px 10px 10px'};
      background-color: {!isBot && 'var(--secondary-color)'};
      color: {!isBot && 'black'}">
      <p>{message.body}</p>
    </div>
  </div>
</div>
