from typing import Any
from transformers import (
    AutoTokenizer,
    TFAutoModelForCausalLM,
)

# from fastapi import FastAPI, WebSocket
# from pydantic import BaseModel
import asyncio
import websockets
import uvicorn
import os

tokenizer: Any = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model: Any = TFAutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
# file_path = "./data.txt"
max_turns_history = 1
# app = FastAPI()


# training_args = TFTrainingArguments(
#     output_dir="./results",  # output directory
#     num_train_epochs=3,  # total # of training epochs
#     per_device_train_batch_size=16,  # batch size per device during training
#     per_device_eval_batch_size=64,  # batch size for evaluation
#     warmup_steps=500,  # number of warmup steps for learning rate scheduler
#     weight_decay=0.01,  # strength of weight decay
#     logging_dir="./logs",  # directory for storing logs
# )

# # build datasets
# dataset = TextDataset(
#     tokenizer=tokenizer,
#     file_path=file_path,
#     block_size=-1,
#     overwrite_cache=False,
#     cache_dir=None,
# )
# data_collator = DataCollatorForLanguageModeling(
#     tokenizer=tokenizer, mlm=False, mlm_probability=0.15
# )

# model.resize_token_embeddings(len(tokenizer))

# # init trainer
# trainer = TFTrainer(
#     model=model,
#     data_collator=data_collator,
#     args=training_args,
#     train_dataset=dataset,
#     prediction_loss_only=True,
# )

# trainer.train()
# trainer.save_model()

# print("Output:\n" + 100 * "-")
# for i, output in enumerate(outputs):
#     print("{}: {}".format(i, tokenizer.decode(output, skip_special_tokens=True)))


# class RootBody(BaseModel):
#     prompt: str


# @app.websocket("/")
async def root(websocket, path):
    turns = []

    while True:
        user_message = await websocket.recv()

        print(f"User >>> {user_message}")
        if max_turns_history == 0:
            turns = []
            continue
        # A single turn is a group of user messages and bot responses right after
        turn = {"user_messages": [], "bot_messages": []}
        turns.append(turn)
        turn["user_messages"].append(user_message)
        # Merge turns into a single prompt (don't forget delimiter)
        prompt = ""
        from_index = (
            max(len(turns) - max_turns_history - 1, 0) if max_turns_history >= 0 else 0
        )
        for turn in turns[from_index:]:
            # Each turn begins with user messages
            for user_message in turn["user_messages"]:
                prompt += user_message + tokenizer.eos_token
            for bot_message in turn["bot_messages"]:
                prompt += bot_message + tokenizer.eos_token

        # generate bot messages
        input_ids = tokenizer.encode(prompt, return_tensors="tf")

        bot_outputs = model.generate(
            input_ids,
            min_length=1,
            max_length=128,
            num_beams=1,
            early_stopping=False,
            no_repeat_ngram_size=2,
            num_return_sequences=1,
            repetition_penalty=1.2,
            length_penalty=1.0,
            do_sample=True,
            use_cache=True,
            top_k=40,
            temperature=0.7,
            top_p=0.6,
        )

        bot_message: str = tokenizer.decode(bot_outputs[0], skip_special_tokens=False)
        bot_message = bot_message[len(prompt) :][: -len(tokenizer.eos_token)]

        print(f"Bot >>> {bot_message}")

        await websocket.send(bot_message)
        turn["bot_messages"].append(bot_message)


if __name__ == "__main__":
    try:
        # uvicorn.run(
        #     app,
        #     host="0.0.0.0",
        #     port=os.getenv("PORT", 80),
        #     reload=False,
        #     access_log=True,
        # )
        start_server = websockets.serve(root, "0.0.0.0", 80)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except TypeError as err:
        print("Logging error")
