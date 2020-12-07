<style>
  .chat-bubble {
    background-color: #e6f8f1;
    padding: 16px 28px;
    -webkit-border-radius: 20px;
    -webkit-border-top-left-radius: 2px;
    -moz-border-radius: 20px;
    -moz-border-radius-topleft: 2px;
    border-radius: 20px;
    border-top-left-radius: 2px;
    display: inline-block;
  }
  .typing {
    align-items: center;
    display: flex;
    height: 17px;
  }
  .typing .dot {
    animation: mercuryTypingAnimation 1.8s infinite ease-in-out;
    background-color: #6cad96;
    border-radius: 50%;
    height: 7px;
    margin-right: 4px;
    vertical-align: middle;
    width: 7px;
    display: inline-block;
  }
  .typing .dot:nth-child(1) {
    animation-delay: 200ms;
  }
  .typing .dot:nth-child(2) {
    animation-delay: 300ms;
  }
  .typing .dot:nth-child(3) {
    animation-delay: 400ms;
  }
  .typing .dot:last-child {
    margin-right: 0;
  }

  @keyframes mercuryTypingAnimation {
    0% {
      transform: translateY(0px);
      background-color: #6cad96;
    }
    28% {
      transform: translateY(-7px);
      background-color: #9ecab9;
    }
    44% {
      transform: translateY(0px);
      background-color: #b5d9cb;
    }
  }
</style>

<div class="chat-bubble">
  <div class="typing">
    <div class="dot" />
    <div class="dot" />
    <div class="dot" />
  </div>
</div>
