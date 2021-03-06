from typing import Any, Dict, List
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
)
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import os
import random
import torch.cuda, torch.quantization, torch.nn


tokenizer: Any = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model: Any = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
app = FastAPI()

print(f"CUDA is available: {torch.cuda.is_available()}")

if model.device.type == "cpu" and not torch.cuda.is_available():
    print("Quantizing model")
    model = torch.quantization.quantize_dynamic(
        model, {torch.nn.Linear, torch.nn.Embedding, torch.nn.Conv1d}, inplace=True
    )
# else:
#     print("Moving model to GPU")
#     model.to("cuda:0")

print("LOADING_COMPLETE")

max_turns_history = 2

turns = []

while True:
    if max_turns_history == 0:
        turns = []
        continue

    user_message = input("USER > ")

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

    print(f"Prompt: {prompt}")

    # generate bot messages
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    bot_outputs = model.generate(
        input_ids,
        min_length=1,
        max_length=256,
        num_beams=3,
        early_stopping=False,
        no_repeat_ngram_size=2,
        num_return_sequences=1,
        repetition_penalty=1.0,
        length_penalty=1.4,
        do_sample=True,
        use_cache=True,
        top_k=40,
        temperature=0.7,
        top_p=0.6,
    )

    bot_message: str = tokenizer.decode(bot_outputs[0], skip_special_tokens=False)
    bot_message = bot_message[len(prompt) :][: -len(tokenizer.eos_token)]

    print(f"BOT > {bot_message}")
    turn["bot_messages"].append(bot_message)