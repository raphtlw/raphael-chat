<script lang="ts">
  export let onSubmit: (text: string) => void
  let messageText: string

  function handleSubmit() {
    onSubmit(messageText)
    messageText = ""
  }
</script>

<style>
  form * {
    transition: filter ease 0.4s, border ease 0.4s;
  }
  form {
    position: sticky;
    bottom: 0;
    display: flex;
    flex-direction: row;
    padding: 0.8rem;
    width: 100%;
  }
  .chat-input-message {
    padding: 0.6rem 1rem;
    outline: none;
    border: 1px solid #e4e9f2;
    width: 100%;
    border-radius: 5px 0px 0px 5px;
    background-color: #f7f9fc;
  }
  .chat-input-message:hover {
    filter: brightness(96%);
  }
  .chat-input-message:focus {
    border: 1px solid #3366ff;
  }
  .chat-send-btn {
    background-color: #3366ff;
    cursor: pointer;
    padding: 0 0.6rem;
    border-radius: 0px 5px 5px 0px;
  }
  .chat-send-btn:hover {
    filter: brightness(95%);
  }
  .send-icon {
    transform: scale(0.85) translateY(2px);
  }
</style>

<form on:submit|preventDefault={handleSubmit}>
  <input
    bind:value={messageText}
    type="text"
    placeholder="Enter your message..."
    class="chat-input-message" />
  <button type="submit" class="chat-send-btn"><svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="send-icon"><line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" /></svg></button>
</form>
