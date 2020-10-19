from typing import Any
from transformers import (
    TrainingArguments,
    TextDataset,
    DataCollatorForLanguageModeling,
    AutoTokenizer,
    AutoModelForCausalLM,
    Trainer,
)


tokenizer: Any = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model: Any = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
file_path = "./data.txt"


training_args = TrainingArguments(
    output_dir="./results",  # output directory
    num_train_epochs=3,  # total # of training epochs
    per_device_train_batch_size=16,  # batch size per device during training
    per_device_eval_batch_size=64,  # batch size for evaluation
    warmup_steps=500,  # number of warmup steps for learning rate scheduler
    weight_decay=0.01,  # strength of weight decay
    logging_dir="./logs",  # directory for storing logs
)

# build datasets
dataset = TextDataset(
    tokenizer=tokenizer,
    file_path=file_path,
    block_size=-1,
    overwrite_cache=False,
    cache_dir=None,
)
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer, mlm=False, mlm_probability=0.15
)

model.resize_token_embeddings(len(tokenizer))

# init trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    prediction_loss_only=True,
)

trainer.train()
trainer.save_model()