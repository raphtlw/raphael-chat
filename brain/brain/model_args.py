# Args to allow for easy convertion of python script to notebook
class Args:
    def __init__(self):
        self.output_dir = "output"
        self.model_type = "gpt2"
        self.model_name_or_path = "microsoft/DialoGPT-small"
        self.config_name = "microsoft/DialoGPT-small"
        self.tokenizer_name = "microsoft/DialoGPT-small"
        self.cache_dir = "cached"
        self.block_size = 512
        self.do_train = True
        self.do_eval = True
        self.evaluate_during_training = False
        self.per_gpu_train_batch_size = 4
        self.per_gpu_eval_batch_size = 4
        self.gradient_accumulation_steps = 1
        self.learning_rate = 5e-5
        self.weight_decay = 0.0
        self.adam_epsilon = 1e-8
        self.max_grad_norm = 1.0
        self.num_train_epochs = 3
        self.max_steps = -1
        self.warmup_steps = 0
        self.logging_steps = 1000
        self.save_steps = 3500
        self.save_total_limit = None
        self.eval_all_checkpoints = False
        self.no_cuda = False
        self.overwrite_output_dir = True
        self.overwrite_cache = True
        self.should_continue = False
        self.seed = None
        self.local_rank = -1
        self.fp16 = False
        self.fp16_opt_level = "O1"


args = Args()