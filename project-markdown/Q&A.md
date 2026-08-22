# ❓ Mamun Command Center - LLM Fundamentals Q&A Bank

Below is the complete reference list of LLM & AI Core Concepts Questions & Answers.

---

### Q1: What does LLM stand for?
- **Category**: Fundamentals
- **Question**: What does LLM stand for?
- **Answer**: Large Language Model

### Q2: What is the basic task of a language model?
- **Category**: Fundamentals
- **Question**: What is the basic task of a language model?
- **Answer**: Predict the next token

### Q3: What is a token?
- **Category**: Tokenization
- **Question**: What is a token?
- **Answer**: A unit of text processed by a language model

### Q4: Why is text tokenized?
- **Category**: Tokenization
- **Question**: Why is text tokenized?
- **Answer**: To convert text into units that can be represented numerically

### Q5: Are tokens always complete words?
- **Category**: Tokenization
- **Question**: Are tokens always complete words?
- **Answer**: No

### Q6: What is an embedding?
- **Category**: Vectors & Embeddings
- **Question**: What is an embedding?
- **Answer**: A numerical/vector representation of a token

### Q7: What is the purpose of an embedding space?
- **Category**: Vectors & Embeddings
- **Question**: What is the purpose of an embedding space?
- **Answer**: To represent tokens as numerical vectors with meaningful relationships

### Q8: What is the main objective of LLM pretraining?
- **Category**: Pretraining
- **Question**: What is the main objective of LLM pretraining?
- **Answer**: Next-token prediction

### Q9: What does autoregressive generation mean?
- **Category**: Generation & Inference
- **Question**: What does autoregressive generation mean?
- **Answer**: Generating each next token based on previously generated tokens

### Q10: What architecture is used by GPT-style models?
- **Category**: Architecture
- **Question**: What architecture is used by GPT-style models?
- **Answer**: Transformer

### Q11: What is the most important mechanism in a Transformer?
- **Category**: Architecture
- **Question**: What is the most important mechanism in a Transformer?
- **Answer**: Attention

### Q12: What does self-attention do?
- **Category**: Architecture
- **Question**: What does self-attention do?
- **Answer**: Allows tokens to interact with and attend to other tokens in the context

### Q13: Why is attention important?
- **Category**: Architecture
- **Question**: Why is attention important?
- **Answer**: It allows the model to determine which parts of the context are relevant

### Q14: What is a Transformer block?
- **Category**: Architecture
- **Question**: What is a Transformer block?
- **Answer**: A repeated neural-network unit containing components such as attention and feed-forward layers

### Q15: What is the purpose of positional information?
- **Category**: Architecture
- **Question**: What is the purpose of positional information?
- **Answer**: To provide information about the order of tokens

### Q16: Why do Transformers need positional information?
- **Category**: Architecture
- **Question**: Why do Transformers need positional information?
- **Answer**: Attention alone does not inherently encode token order

### Q17: What is the context window?
- **Category**: LLM Memory
- **Question**: What is the context window?
- **Answer**: The maximum amount of token context the model can process at once

### Q18: What happens when the context window is exceeded?
- **Category**: LLM Memory
- **Question**: What happens when the context window is exceeded?
- **Answer**: The model cannot directly attend to tokens outside the available context

### Q19: What is a parameter in an LLM?
- **Category**: Model Training
- **Question**: What is a parameter in an LLM?
- **Answer**: A learned numerical value/weight in the neural network

### Q20: What happens to parameters during training?
- **Category**: Model Training
- **Question**: What happens to parameters during training?
- **Answer**: They are adjusted to improve the model's predictions

### Q21: What is the loss function used for?
- **Category**: Optimization
- **Question**: What is the loss function used for?
- **Answer**: Measuring how wrong the model's predictions are

### Q22: What does minimizing loss accomplish?
- **Category**: Optimization
- **Question**: What does minimizing loss accomplish?
- **Answer**: It improves the model's predictions on the training objective

### Q23: What is gradient descent?
- **Category**: Optimization
- **Question**: What is gradient descent?
- **Answer**: An optimization method used to update model parameters

### Q24: What is backpropagation?
- **Category**: Optimization
- **Question**: What is backpropagation?
- **Answer**: The process of calculating gradients used to update model parameters

### Q25: What is pretraining?
- **Category**: Training Lifecycle
- **Question**: What is pretraining?
- **Answer**: Training a model on a large amount of data to learn general language patterns and capabilities

### Q26: Why is massive training data useful?
- **Category**: Training Lifecycle
- **Question**: Why is massive training data useful?
- **Answer**: It exposes the model to a wide variety of language patterns and information

### Q27: Does pretraining make an LLM perfectly knowledgeable?
- **Category**: LLM Limitations
- **Question**: Does pretraining make an LLM perfectly knowledgeable?
- **Answer**: No

### Q28: Does an LLM literally store a copy of every webpage in its parameters?
- **Category**: LLM Limitations
- **Question**: Does an LLM literally store a copy of every webpage in its parameters?
- **Answer**: No

### Q29: What does the model learn from training data?
- **Category**: Training Lifecycle
- **Question**: What does the model learn from training data?
- **Answer**: Statistical patterns and representations

### Q30: What is a neural network?
- **Category**: Deep Learning
- **Question**: What is a neural network?
- **Answer**: A computational model composed of interconnected mathematical operations/parameters

### Q31: What is an LLM's vocabulary?
- **Category**: Tokenization
- **Question**: What is an LLM's vocabulary?
- **Answer**: The set of tokens that the tokenizer can represent

### Q32: What is tokenization?
- **Category**: Tokenization
- **Question**: What is tokenization?
- **Answer**: Converting raw text into tokens

### Q33: What is detokenization?
- **Category**: Tokenization
- **Question**: What is detokenization?
- **Answer**: Converting tokens back into readable text

### Q34: Why can tokenization affect model performance?
- **Category**: Tokenization
- **Question**: Why can tokenization affect model performance?
- **Answer**: Different tokenizations change how efficiently text is represented

### Q35: What is a tokenizer?
- **Category**: Tokenization
- **Question**: What is a tokenizer?
- **Answer**: A system that converts text into tokens and tokens back into text

### Q36: What is inference?
- **Category**: Execution
- **Question**: What is inference?
- **Answer**: Using a trained model to generate predictions/output

### Q37: What is training?
- **Category**: Execution
- **Question**: What is training?
- **Answer**: Adjusting model parameters using data and an optimization process

### Q38: What is the difference between training and inference?
- **Category**: Execution
- **Question**: What is the difference between training and inference?
- **Answer**: Training changes parameters; inference uses the trained parameters

### Q39: What is sampling?
- **Category**: Decoding & Sampling
- **Question**: What is sampling?
- **Answer**: Selecting the next token from a probability distribution

### Q40: What does temperature control?
- **Category**: Decoding & Sampling
- **Question**: What does temperature control?
- **Answer**: The randomness/variability of generation

### Q41: What generally happens when temperature is increased?
- **Category**: Decoding & Sampling
- **Question**: What generally happens when temperature is increased?
- **Answer**: Output becomes more diverse/random

### Q42: What generally happens when temperature is decreased?
- **Category**: Decoding & Sampling
- **Question**: What generally happens when temperature is decreased?
- **Answer**: Output becomes more deterministic

### Q43: What is a probability distribution over tokens?
- **Category**: Decoding & Sampling
- **Question**: What is a probability distribution over tokens?
- **Answer**: The model's estimated probabilities for possible next tokens

### Q44: What is a logit?
- **Category**: Decoding & Sampling
- **Question**: What is a logit?
- **Answer**: An unnormalized score produced by the model before converting scores into probabilities

### Q45: What function commonly converts logits into probabilities?
- **Category**: Decoding & Sampling
- **Question**: What function commonly converts logits into probabilities?
- **Answer**: Softmax

### Q46: What is the most likely next token called?
- **Category**: Decoding & Sampling
- **Question**: What is the most likely next token called?
- **Answer**: The token with the highest predicted probability

### Q47: What is greedy decoding?
- **Category**: Decoding & Sampling
- **Question**: What is greedy decoding?
- **Answer**: Always selecting the highest-probability next token

### Q48: What is hallucination?
- **Category**: LLM Safety & Hallucination
- **Question**: What is hallucination?
- **Answer**: Generating information that is incorrect, fabricated, or unsupported

### Q49: Why do LLMs hallucinate?
- **Category**: LLM Safety & Hallucination
- **Question**: Why do LLMs hallucinate?
- **Answer**: They are optimized to generate likely continuations rather than inherently verify truth

### Q50: Does fluent language guarantee factual accuracy?
- **Category**: LLM Safety & Hallucination
- **Question**: Does fluent language guarantee factual accuracy?
- **Answer**: No

### Q51: What is post-training?
- **Category**: Alignment & Post-Training
- **Question**: What is post-training?
- **Answer**: Training performed after pretraining to improve behavior, instruction following, and alignment

### Q52: What is instruction tuning?
- **Category**: Alignment & Post-Training
- **Question**: What is instruction tuning?
- **Answer**: Training a model to better follow human instructions

### Q53: What does RLHF stand for?
- **Category**: Alignment & Post-Training
- **Question**: What does RLHF stand for?
- **Answer**: Reinforcement Learning from Human Feedback

### Q54: What is the purpose of RLHF?
- **Category**: Alignment & Post-Training
- **Question**: What is the purpose of RLHF?
- **Answer**: Aligning model behavior with human preferences

### Q55: What is a reward model?
- **Category**: Alignment & Post-Training
- **Question**: What is a reward model?
- **Answer**: A model that estimates how desirable a response is according to learned preferences

### Q56: What is alignment?
- **Category**: Alignment & Post-Training
- **Question**: What is alignment?
- **Answer**: Making model behavior better match intended human goals and preferences

### Q57: Why is post-training important?
- **Category**: Alignment & Post-Training
- **Question**: Why is post-training important?
- **Answer**: It makes pretrained models more useful, controllable, and aligned with user instructions

### Q58: What is instruction following?
- **Category**: Alignment & Post-Training
- **Question**: What is instruction following?
- **Answer**: The ability of a model to produce responses appropriate to a user's instructions

### Q59: What is reinforcement learning?
- **Category**: Machine Learning
- **Question**: What is reinforcement learning?
- **Answer**: Learning through rewards or penalties associated with actions

### Q60: What is the role of human preferences in RLHF?
- **Category**: Alignment & Post-Training
- **Question**: What is the role of human preferences in RLHF?
- **Answer**: They provide signals about which model outputs are preferred

### Q61: What is reasoning in LLMs?
- **Category**: Reasoning & Logic
- **Question**: What is reasoning in LLMs?
- **Answer**: Performing multi-step processing to arrive at an answer

### Q62: Why can reasoning models use more tokens?
- **Category**: Reasoning & Logic
- **Question**: Why can reasoning models use more tokens?
- **Answer**: They may perform additional internal/visible computation before producing the final answer

### Q63: What is test-time compute?
- **Category**: Reasoning & Logic
- **Question**: What is test-time compute?
- **Answer**: Computational resources used while generating an answer

### Q64: What is tool use by an LLM?
- **Category**: Tools & Agents
- **Question**: What is tool use by an LLM?
- **Answer**: Using external tools such as calculators, search, code execution, or APIs

### Q65: Why are tools useful for LLMs?
- **Category**: Tools & Agents
- **Question**: Why are tools useful for LLMs?
- **Answer**: They extend the model's capabilities beyond what it can reliably do internally

### Q66: Can an LLM use a calculator as a tool?
- **Category**: Tools & Agents
- **Question**: Can an LLM use a calculator as a tool?
- **Answer**: Yes

### Q67: Can an LLM use external search as a tool?
- **Category**: Tools & Agents
- **Question**: Can an LLM use external search as a tool?
- **Answer**: Yes

### Q68: What is an API?
- **Category**: Integration & APIs
- **Question**: What is an API?
- **Answer**: An interface that allows software systems to communicate with each other

### Q69: What is tool calling?
- **Category**: Tools & Agents
- **Question**: What is tool calling?
- **Answer**: The model requesting an external tool to perform a specific operation

### Q70: What is retrieval-augmented generation (RAG)?
- **Category**: RAG Systems
- **Question**: What is retrieval-augmented generation (RAG)?
- **Answer**: Generating responses using information retrieved from an external knowledge source

### Q71: Why can RAG reduce hallucination?
- **Category**: RAG Systems
- **Question**: Why can RAG reduce hallucination?
- **Answer**: It can provide relevant external information for the model to use

### Q72: Does RAG guarantee that an answer is correct?
- **Category**: RAG Systems
- **Question**: Does RAG guarantee that an answer is correct?
- **Answer**: No

### Q73: What is an AI agent?
- **Category**: AI Agents
- **Question**: What is an AI agent?
- **Answer**: A system that can use models, tools, and actions to accomplish tasks

### Q74: What is the difference between an LLM and an AI agent?
- **Category**: AI Agents
- **Question**: What is the difference between an LLM and an AI agent?
- **Answer**: An LLM generates predictions/text, while an agent can use the model together with tools and actions

### Q75: What is multimodality?
- **Category**: Multimodal AI
- **Question**: What is multimodality?
- **Answer**: The ability to process or generate multiple types of data such as text, images, audio, or video

### Q76: Can modern AI models process more than text?
- **Category**: Multimodal AI
- **Question**: Can modern AI models process more than text?
- **Answer**: Yes

### Q77: What is a GPU?
- **Category**: Hardware & Compute
- **Question**: What is a GPU?
- **Answer**: A processor highly suited to the parallel mathematical operations used in neural networks

### Q78: Why are GPUs important for LLMs?
- **Category**: Hardware & Compute
- **Question**: Why are GPUs important for LLMs?
- **Answer**: They efficiently perform the large-scale parallel computations required for training and inference

### Q79: Why does training large LLMs require substantial computing resources?
- **Category**: Hardware & Compute
- **Question**: Why does training large LLMs require substantial computing resources?
- **Answer**: Large models and datasets require enormous numbers of mathematical operations

### Q80: What is model scaling?
- **Category**: Scaling Laws
- **Question**: What is model scaling?
- **Answer**: Increasing factors such as model size, data, or compute to improve capabilities

### Q81: What is a foundation model?
- **Category**: Model Architecture
- **Question**: What is a foundation model?
- **Answer**: A broadly pretrained model that can serve as the basis for many downstream applications

### Q82: What is fine-tuning?
- **Category**: Model Adaptation
- **Question**: What is fine-tuning?
- **Answer**: Further training a pretrained model for a particular behavior, task, or domain

### Q83: How does fine-tuning differ from pretraining?
- **Category**: Model Adaptation
- **Question**: How does fine-tuning differ from pretraining?
- **Answer**: Fine-tuning adapts an already pretrained model, while pretraining establishes broad capabilities

### Q84: What is an open-weight model?
- **Category**: Open Source AI
- **Question**: What is an open-weight model?
- **Answer**: A model whose learned weights are made available to users

### Q85: What is a closed model?
- **Category**: Open Source AI
- **Question**: What is a closed model?
- **Answer**: A model whose underlying weights or implementation are not fully publicly available

### Q86: Why is inference cost important?
- **Category**: Cost & Efficiency
- **Question**: Why is inference cost important?
- **Answer**: Generating responses requires computational resources and therefore costs money/energy

### Q87: Why can larger models be more expensive to run?
- **Category**: Cost & Efficiency
- **Question**: Why can larger models be more expensive to run?
- **Answer**: They generally require more computation and memory

### Q88: What is quantization?
- **Category**: Compression & Quantization
- **Question**: What is quantization?
- **Answer**: Representing model values with lower numerical precision to reduce memory and computation

### Q89: What is the main benefit of quantization?
- **Category**: Compression & Quantization
- **Question**: What is the main benefit of quantization?
- **Answer**: Reduced memory usage and potentially faster/cheaper inference

### Q90: What is the overall LLM development pipeline?
- **Category**: Lifecycle Pipeline
- **Question**: What is the overall LLM development pipeline?
- **Answer**: Data → Tokenization → Pretraining → Post-training/Alignment → Inference/Use

### Q91: What is the fundamental prediction unit of an LLM?
- **Category**: Fundamentals
- **Question**: What is the fundamental prediction unit of an LLM?
- **Answer**: A token

### Q92: Does an LLM directly predict complete answers in one step?
- **Category**: Fundamentals
- **Question**: Does an LLM directly predict complete answers in one step?
- **Answer**: No

### Q93: How is a long response generated?
- **Category**: Autoregressive Generation
- **Question**: How is a long response generated?
- **Answer**: By repeatedly predicting one token after another

### Q94: What happens after a token is generated during autoregressive generation?
- **Category**: Autoregressive Generation
- **Question**: What happens after a token is generated during autoregressive generation?
- **Answer**: It becomes part of the context for predicting the next token

### Q95: Why can LLMs produce different answers to the same prompt?
- **Category**: Sampling & Randomness
- **Question**: Why can LLMs produce different answers to the same prompt?
- **Answer**: Probabilistic sampling can select different tokens

### Q96: What is the central idea behind modern LLMs?
- **Category**: Fundamentals
- **Question**: What is the central idea behind modern LLMs?
- **Answer**: Learning statistical representations of language through large-scale training and using them to predict/generate tokens
