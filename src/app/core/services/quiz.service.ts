import { Injectable, signal, computed, inject, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuizQuestion, QuizResult } from '../models/quiz.model';
import { AuthService } from './auth.service';

const API_BASE_URL = 'http://localhost:3000';
const QUIZ_HISTORY_KEY = 'mcc_quiz_history_v1';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  // SET 1 QUESTIONS: Q&A Bank (96 Questions)
  readonly set1Questions: QuizQuestion[] = [
    { id: 'q1', category: 'Fundamentals', question: 'What does LLM stand for?', correctAnswer: 'Large Language Model', options: ['Large Language Model', 'Low-Level Memory', 'Linear Learning Method', 'Logic Language Matrix'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q2', category: 'Fundamentals', question: 'What is the basic task of a language model?', correctAnswer: 'Predict the next token', options: ['Predict the next token', 'Execute SQL queries', 'Translate code to binary', 'Compress database tables'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q3', category: 'Tokenization', question: 'What is a token?', correctAnswer: 'A unit of text processed by a language model', options: ['A unit of text processed by a language model', 'An API authentication key', 'A database primary key', 'A GPU core thread'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q4', category: 'Tokenization', question: 'Why is text tokenized?', correctAnswer: 'To convert text into units that can be represented numerically', options: ['To convert text into units that can be represented numerically', 'To encrypt confidential user data', 'To delete punctuation from documents', 'To speed up network transmissions'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q5', category: 'Tokenization', question: 'Are tokens always complete words?', correctAnswer: 'No', options: ['No', 'Yes', 'Only in English', 'Only in Python code'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q6', category: 'Vectors & Embeddings', question: 'What is an embedding?', correctAnswer: 'A numerical/vector representation of a token', options: ['A numerical/vector representation of a token', 'A HTML web frame', 'A database indexing algorithm', 'A model training pipeline'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q7', category: 'Vectors & Embeddings', question: 'What is the purpose of an embedding space?', correctAnswer: 'To represent tokens as numerical vectors with meaningful relationships', options: ['To represent tokens as numerical vectors with meaningful relationships', 'To compress raw audio files', 'To store model weights on disk', 'To render CSS web pages'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q8', category: 'Pretraining', question: 'What is the main objective of LLM pretraining?', correctAnswer: 'Next-token prediction', options: ['Next-token prediction', 'Reinforcement learning alignment', 'Manual data labeling', 'Image segmentation'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q9', category: 'Generation & Inference', question: 'What does autoregressive generation mean?', correctAnswer: 'Generating each next token based on previously generated tokens', options: ['Generating each next token based on previously generated tokens', 'Generating all output tokens in parallel simultaneously', 'Reverting to previous training checkpoints', 'Automatically formatting code indentation'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q10', category: 'Architecture', question: 'What architecture is used by GPT-style models?', correctAnswer: 'Transformer', options: ['Transformer', 'Convolutional Neural Network (CNN)', 'Recurrent Neural Network (RNN)', 'Multilayer Perceptron (MLP)'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q11', category: 'Architecture', question: 'What is the most important mechanism in a Transformer?', correctAnswer: 'Attention', options: ['Attention', 'Convolution', 'Max Pooling', 'Gradient Descent'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q12', category: 'Architecture', question: 'What does self-attention do?', correctAnswer: 'Allows tokens to interact with and attend to other tokens in the context', options: ['Allows tokens to interact with and attend to other tokens in the context', 'Compresses vectors into single integers', 'Converts text into speech audio', 'Flushes GPU memory caches'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q13', category: 'Architecture', question: 'Why is attention important?', correctAnswer: 'It allows the model to determine which parts of the context are relevant', options: ['It allows the model to determine which parts of the context are relevant', 'It prevents out-of-memory errors during inference', 'It encrypts user prompts', 'It executes API calls automatically'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q14', category: 'Architecture', question: 'What is a Transformer block?', correctAnswer: 'A repeated neural-network unit containing components such as attention and feed-forward layers', options: ['A repeated neural-network unit containing components such as attention and feed-forward layers', 'A hardware chip installed in servers', 'A database table partition', 'A Python script class'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q15', category: 'Architecture', question: 'What is the purpose of positional information?', correctAnswer: 'To provide information about the order of tokens', options: ['To provide information about the order of tokens', 'To measure model response latency', 'To format markdown text', 'To store file paths'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q16', category: 'Architecture', question: 'Why do Transformers need positional information?', correctAnswer: 'Attention alone does not inherently encode token order', options: ['Attention alone does not inherently encode token order', 'Tokens cannot be converted to vectors without it', 'GPUs require fixed 2D matrices', 'To specify user location coordinates'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q17', category: 'LLM Memory', question: 'What is the context window?', correctAnswer: 'The maximum amount of token context the model can process at once', options: ['The maximum amount of token context the model can process at once', 'The browser window size during chat', 'The total number of parameters in a model', 'The disk cache limit for logs'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q18', category: 'LLM Memory', question: 'What happens when the context window is exceeded?', correctAnswer: 'The model cannot directly attend to tokens outside the available context', options: ['The model cannot directly attend to tokens outside the available context', 'The model crashes and throws a syntax error', 'The model automatically retrains itself', 'The token vocabulary is cleared'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q19', category: 'Model Training', question: 'What is a parameter in an LLM?', correctAnswer: 'A learned numerical value/weight in the neural network', options: ['A learned numerical value/weight in the neural network', 'A URL query string key', 'An environment variable setting', 'A user input prompt'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q20', category: 'Model Training', question: 'What happens to parameters during training?', correctAnswer: 'They are adjusted to improve the model\'s predictions', options: ['They are adjusted to improve the model\'s predictions', 'They are permanently frozen', 'They are converted to ASCII strings', 'They are deleted to save disk space'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q21', category: 'Optimization', question: 'What is the loss function used for?', correctAnswer: 'Measuring how wrong the model\'s predictions are', options: ['Measuring how wrong the model\'s predictions are', 'Calculating GPU memory bandwidth', 'Counting the number of total tokens', 'Generating user API keys'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q22', category: 'Optimization', question: 'What does minimizing loss accomplish?', correctAnswer: 'It improves the model\'s predictions on the training objective', options: ['It improves the model\'s predictions on the training objective', 'It reduces network latency', 'It shrinks the context window size', 'It deletes low quality training data'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q23', category: 'Optimization', question: 'What is gradient descent?', correctAnswer: 'An optimization method used to update model parameters', options: ['An optimization method used to update model parameters', 'A data tokenization algorithm', 'A web scraping framework', 'A loss visualization plot'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q24', category: 'Optimization', question: 'What is backpropagation?', correctAnswer: 'The process of calculating gradients used to update model parameters', options: ['The process of calculating gradients used to update model parameters', 'Retrying a failed HTTP API request', 'Rolling back database transactions', 'Reversing token order in prompt'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q25', category: 'Training Lifecycle', question: 'What is pretraining?', correctAnswer: 'Training a model on a large amount of data to learn general language patterns and capabilities', options: ['Training a model on a large amount of data to learn general language patterns and capabilities', 'Training a model on user specific private emails', 'Quantizing model weights to 4-bit', 'Compiling TypeScript into JavaScript'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q26', category: 'Training Lifecycle', question: 'Why is massive training data useful?', correctAnswer: 'It exposes the model to a wide variety of language patterns and information', options: ['It exposes the model to a wide variety of language patterns and information', 'It reduces GPU hardware cost to zero', 'It guarantees 100% factual accuracy', 'It eliminates the need for tokenizers'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q27', category: 'LLM Limitations', question: 'Does pretraining make an LLM perfectly knowledgeable?', correctAnswer: 'No', options: ['No', 'Yes', 'Only for mathematical calculations', 'Only for historical events'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q28', category: 'LLM Limitations', question: 'Does an LLM literally store a copy of every webpage in its parameters?', correctAnswer: 'No', options: ['No', 'Yes', 'Only open-source websites', 'Only Wikipedia pages'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q29', category: 'Training Lifecycle', question: 'What does the model learn from training data?', correctAnswer: 'Statistical patterns and representations', options: ['Statistical patterns and representations', 'Exact verbatim memory of all files', 'User passwords and private keys', 'Physical world laws'], paperSet: 'set1', level: 'Fundamentals' },
    { id: 'q30', category: 'Deep Learning', question: 'What is a neural network?', correctAnswer: 'A computational model composed of interconnected mathematical operations/parameters', options: ['A computational model composed of interconnected mathematical operations/parameters', 'A fiber-optic internet cable network', 'A database indexing protocol', 'A web server load balancer'], paperSet: 'set1', level: 'Fundamentals' }
  ];

  // SET 2 QUESTIONS: 5-Level AI & LLM Mastery Curriculum (111 Questions)
  readonly set2Questions: QuizQuestion[] = [
    // LEVEL 1: BASIC (20 Questions)
    { id: 's2-l1-1', category: 'AI Basics', question: 'What is Artificial Intelligence (AI)?', correctAnswer: 'Simulation of human intelligence in machines programmed to think and learn', options: ['Simulation of human intelligence in machines programmed to think and learn', 'A physical robot hardware frame', 'A specific programming language', 'A cloud storage server'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-2', category: 'Machine Learning', question: 'What is Machine Learning (ML)?', correctAnswer: 'A subset of AI that enables systems to learn from data without explicit programming', options: ['A subset of AI that enables systems to learn from data without explicit programming', 'A manual data entry process', 'A web design stylesheet', 'A network firewall protocol'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-3', category: 'LLM Basics', question: 'What is a Large Language Model (LLM)?', correctAnswer: 'A deep learning model trained on vast text data to process and generate language', options: ['A deep learning model trained on vast text data to process and generate language', 'A database indexing engine', 'A desktop text editor', 'A graphics rendering unit'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-4', category: 'Neural Networks', question: 'What is a Neural Network?', correctAnswer: 'A computational architecture inspired by biological neurons to model data patterns', options: ['A computational architecture inspired by biological neurons to model data patterns', 'A copper cable internet connection', 'A web server cluster', 'A software licensing model'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-5', category: 'Training', question: 'What is Training Data?', correctAnswer: 'The dataset used to train an AI model to learn patterns and relationships', options: ['The dataset used to train an AI model to learn patterns and relationships', 'The output log of a command prompt', 'The user manual of a software', 'The backup file on disk'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-6', category: 'Tokenization', question: 'What is a Token in LLMs?', correctAnswer: 'The basic atomic unit of text (word, subword, or character) processed by the model', options: ['The basic atomic unit of text (word, subword, or character) processed by the model', 'An authentication session cookie', 'A database row ID', 'A CPU thread identifier'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-7', category: 'Parameters', question: 'What is a Parameter in a Neural Network?', correctAnswer: 'A learned numerical weight in the network adjusted during training', options: ['A learned numerical weight in the network adjusted during training', 'A command line argument flag', 'A user configuration setting', 'A file directory path'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-8', category: 'Model Weights', question: 'What are Model Weights?', correctAnswer: 'The learned parameters saved after training that define the model behavior', options: ['The learned parameters saved after training that define the model behavior', 'The physical mass of the server rack', 'The size of the download installer file', 'The CPU percentage utilization'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-9', category: 'Context Window', question: 'What is a Context Window?', correctAnswer: 'The maximum total token limit a model can read and process in a single invocation', options: ['The maximum total token limit a model can read and process in a single invocation', 'The height and width of the browser window', 'The RAM size of the client computer', 'The number of open chat tabs'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-10', category: 'Prompting', question: 'What is a Prompt?', correctAnswer: 'The input text or instruction provided to guide an AI model response', options: ['The input text or instruction provided to guide an AI model response', 'A terminal command prompt window', 'A system error message popup', 'A software installation wizard'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-11', category: 'Hallucination', question: 'What is AI Hallucination?', correctAnswer: 'Generating incorrect, unverified, or fabricated information with high confidence', options: ['Generating incorrect, unverified, or fabricated information with high confidence', 'Displaying colorful 3D graphics on screen', 'A hardware memory leak error', 'Rerunning an inference request automatically'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-12', category: 'Generative AI', question: 'What is Generative AI?', correctAnswer: 'AI models capable of creating new original content (text, code, images, audio)', options: ['AI models capable of creating new original content (text, code, images, audio)', 'Software that generates static PDF invoices', 'A calculator program', 'A virus scanner utility'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-13', category: 'Inference', question: 'What is Inference in AI?', correctAnswer: 'The execution process of generating predictions/outputs from a trained model', options: ['The execution process of generating predictions/outputs from a trained model', 'Training model weights on a cluster', 'Downloading dataset files from internet', 'Formatting source code files'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-14', category: 'Supervised Learning', question: 'What is Supervised Learning?', correctAnswer: 'Training an AI model using labeled input-output target pairs', options: ['Training an AI model using labeled input-output target pairs', 'Training without any dataset labels', 'Monitoring server hardware temperatures', 'Human supervision of automated robots'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-15', category: 'Unsupervised Learning', question: 'What is Unsupervised Learning?', correctAnswer: 'Training a model on unlabeled data to discover hidden patterns or groupings', options: ['Training a model on unlabeled data to discover hidden patterns or groupings', 'Training with labeled target answers', 'Running models without internet access', 'Deploying apps without user authentication'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-16', category: 'Overfitting', question: 'What is Overfitting?', correctAnswer: 'When a model memorizes training data too closely, performing poorly on new data', options: ['When a model memorizes training data too closely, performing poorly on new data', 'When a model file size exceeds 1 GB', 'When a server runs out of disk storage', 'When a GPU exceeds its thermal limit'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-17', category: 'Bias', question: 'What is AI Bias?', correctAnswer: 'Systematic errors or skewed outputs resulting from unrepresentative training data', options: ['Systematic errors or skewed outputs resulting from unrepresentative training data', 'The electrical voltage supplied to GPUs', 'The speed of model token generation', 'A type of neural network layer'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-18', category: 'Embeddings', question: 'What is an Embedding?', correctAnswer: 'A high-dimensional vector representation of text capturing semantic meaning', options: ['A high-dimensional vector representation of text capturing semantic meaning', 'An embedded HTML iframe', 'A hard drive partition', 'A browser extension'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-19', category: 'Performance', question: 'What is Latency in AI services?', correctAnswer: 'The total time delay between sending a prompt and receiving the response', options: ['The total time delay between sending a prompt and receiving the response', 'The price per 1 million tokens', 'The maximum context window capacity', 'The precision format of parameters'], paperSet: 'set2', level: 'Level 1: Basic' },
    { id: 's2-l1-20', category: 'Evaluation', question: 'What is Ground Truth?', correctAnswer: 'The verified, factual correct answer used as a gold standard benchmark', options: ['The verified, factual correct answer used as a gold standard benchmark', 'The physical location of the server data center', 'The initial prompt string entered by a user', 'The default system temperature setting'], paperSet: 'set2', level: 'Level 1: Basic' },

    // LEVEL 2: INTERMEDIATE (20 Questions)
    { id: 's2-l2-1', category: 'Prompt Engineering', question: 'What is Prompt Engineering?', correctAnswer: 'Designing and refining prompt structures to elicit optimal outputs from LLMs', options: ['Designing and refining prompt structures to elicit optimal outputs from LLMs', 'Writing GPU C++ CUDA kernel code', 'Installing database software', 'Configuring DNS routing tables'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-2', category: 'Prompting Tech', question: 'What is Few-shot Prompting?', correctAnswer: 'Providing a few concrete input-output examples inside the prompt context', options: ['Providing a few concrete input-output examples inside the prompt context', 'Executing a prompt 3 times in a loop', 'Fine-tuning weights on 5 samples', 'Splitting prompts across 2 servers'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-3', category: 'Prompting Tech', question: 'What is Zero-shot Prompting?', correctAnswer: 'Asking the model to complete a task without providing any prior examples in the prompt', options: ['Asking the model to complete a task without providing any prior examples in the prompt', 'Running an inference request with 0 temperature', 'Sending an empty prompt string', 'Training a model with 0 parameters'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-4', category: 'Reasoning Tech', question: 'What is Chain-of-Thought (CoT) Prompting?', correctAnswer: 'Instructing the model to break down its reasoning step-by-step before answering', options: ['Instructing the model to break down its reasoning step-by-step before answering', 'Linking 5 different LLM APIs together', 'Chaining multiple database queries', 'Running parallel thread execution'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-5', category: 'Prompt Orchestration', question: 'What is Prompt Chaining?', correctAnswer: 'Executing multiple prompts sequentially where the output of one feeds into the next', options: ['Executing multiple prompts sequentially where the output of one feeds into the next', 'Combining 10 prompts into a single document', 'Encrypting prompt strings with AES', 'Translating prompts into 3 languages'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-6', category: 'Model Specialization', question: 'What is Fine-tuning?', correctAnswer: 'Further training a pretrained LLM on a specific domain dataset to adapt its behavior', options: ['Further training a pretrained LLM on a specific domain dataset to adapt its behavior', 'Adjusting the volume on an audio speaker', 'Formating JSON responses', 'Filtering spam emails'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-7', category: 'RAG Architecture', question: 'What is Retrieval-Augmented Generation (RAG)?', correctAnswer: 'Enhancing LLM responses using information retrieved from external databases/documents', options: ['Enhancing LLM responses using information retrieved from external databases/documents', 'Retraining the base model every hour', 'Generating random text Continuously', 'Compressing vector embeddings'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-8', category: 'RAG Architecture', question: 'What is Grounding in RAG systems?', correctAnswer: 'Anchoring model responses directly to verified retrieved source documents', options: ['Anchoring model responses directly to verified retrieved source documents', 'Connecting a server to physical electrical ground', 'Restricting API access to localhost', 'Deleting ungrounded database rows'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-9', category: 'AI Agents', question: 'What is an AI Agent?', correctAnswer: 'An autonomous system using LLMs, memory, and tools to complete multi-step goals', options: ['An autonomous system using LLMs, memory, and tools to complete multi-step goals', 'A static desktop search bar', 'A web browser cache cleaner', 'A standard SQL stored procedure'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-10', category: 'System Architecture', question: 'What is a System Prompt?', correctAnswer: 'A foundational instruction defining persona, boundaries, and rules for model behavior', options: ['A foundational instruction defining persona, boundaries, and rules for model behavior', 'A terminal command error message', 'A database connection string', 'A system hardware diagnostics log'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-11', category: 'Multimodal AI', question: 'What does Multimodal AI mean?', correctAnswer: 'The capability to process and generate multiple data types (text, images, audio, video)', options: ['The capability to process and generate multiple data types (text, images, audio, video)', 'Running an app on Windows, Mac, and Linux', 'Using multiple CPU sockets', 'Supporting multiple user accounts'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-12', category: 'API Integration', question: 'What is an API in AI services?', correctAnswer: 'A programmatic interface allowing applications to send prompts and receive model outputs', options: ['A programmatic interface allowing applications to send prompts and receive model outputs', 'An artificial intelligence algorithm', 'A database backup file format', 'A network security protocol'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-13', category: 'Vector Databases', question: 'What is a Vector Database?', correctAnswer: 'A specialized database indexed to perform fast similarity searches on vector embeddings', options: ['A specialized database indexed to perform fast similarity searches on vector embeddings', 'A relational SQL table database', 'A key-value cache like Redis', 'A document storage drive'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-14', category: 'Search Architecture', question: 'What is Semantic Search?', correctAnswer: 'Searching documents based on contextual meaning and intent rather than exact keywords', options: ['Searching documents based on contextual meaning and intent rather than exact keywords', 'Searching for exact regex substring matches', 'Sorting database records by primary key', 'Indexing HTML page titles'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-15', category: 'AI Safety', question: 'What is a Jailbreak in LLMs?', correctAnswer: 'Crafting adversarial prompts to bypass safety guardrails and system restrictions', options: ['Crafting adversarial prompts to bypass safety guardrails and system restrictions', 'Unlocking an iPhone operating system', 'Restarting a crashed server container', 'Opening open-source repository code'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-16', category: 'AI Alignment', question: 'What is AI Alignment?', correctAnswer: 'Ensuring AI outputs and actions conform to human values, safety, and intentions', options: ['Ensuring AI outputs and actions conform to human values, safety, and intentions', 'Aligning text columns in a spreadsheet', 'Centering UI layout components', 'Balancing load across web servers'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-17', category: 'Context Management', question: 'What is Context Rot?', correctAnswer: 'Quality degradation in model responses as context becomes overloaded with noisy data', options: ['Quality degradation in model responses as context becomes overloaded with noisy data', 'Physical disk drive corruption', 'Expiration of user login tokens', 'Memory leakage in Node.js processes'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-18', category: 'Context Management', question: 'What is Memory Decay in Agents?', correctAnswer: 'The loss of earlier conversation details due to context window truncation', options: ['The loss of earlier conversation details due to context window truncation', 'RAM hardware failure in servers', 'Database table auto-deletion', 'Garbage collection in V8 engine'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-19', category: 'Decoding Strategies', question: 'What is Top-p (Nucleus) Sampling?', correctAnswer: 'Selecting tokens from the smallest candidate pool whose cumulative probability exceeds p', options: ['Selecting tokens from the smallest candidate pool whose cumulative probability exceeds p', 'Picking the top 1 most probable token always', 'Sampling tokens with 0 probability', 'Filtering out all non-English tokens'], paperSet: 'set2', level: 'Level 2: Intermediate' },
    { id: 's2-l2-20', category: 'Model Governance', question: 'What is a Model Card?', correctAnswer: 'Documentation detailing a model\'s architecture, performance benchmarks, safety, and intended use', options: ['Documentation detailing a model\'s architecture, performance benchmarks, safety, and intended use', 'A physical GPU expansion card', 'A credit card for paying API bills', 'A license certificate key'], paperSet: 'set2', level: 'Level 2: Intermediate' },

    // LEVEL 3: ADVANCED (21 Questions)
    { id: 's2-l3-1', category: 'Context Engineering', question: 'What is Context Engineering?', correctAnswer: 'Strategically selecting, structuring, pruning, and optimizing tokens inside the context window', options: ['Strategically selecting, structuring, pruning, and optimizing tokens inside the context window', 'Building hardware memory modules', 'Writing HTML template styles', 'Designing database schema indexes'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-2', category: 'Agent Specs', question: 'What is agents.md?', correctAnswer: 'A project configuration file specifying architectural guidelines, workspace rules, and agent behaviors', options: ['A project configuration file specifying architectural guidelines, workspace rules, and agent behaviors', 'A markdown file listing employee names', 'A legacy documentation page', 'A Python package manifest'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-3', category: 'Agent Architecture', question: 'What is the Agent Loop?', correctAnswer: 'The iterative cycle of Perceive → Plan → Execute Tool → Observe Result executed by AI agents', options: ['The iterative cycle of Perceive → Plan → Execute Tool → Observe Result executed by AI agents', 'An infinite WHILE loop bug in code', 'A network packet retry loop', 'A CPU event loop in JavaScript'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-4', category: 'Agentic Workflows', question: 'What is an Agentic Workflow?', correctAnswer: 'A multi-step system where agents plan, invoke tools, inspect outputs, and iteratively refine results', options: ['A multi-step system where agents plan, invoke tools, inspect outputs, and iteratively refine results', 'A standard waterfall project lifecycle', 'A manual code review process', 'A linear cron job script'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-5', category: 'Modern Dev Concepts', question: 'What is Vibe Coding?', correctAnswer: 'Developing software by directing AI agents through high-level natural language intent', options: ['Developing software by directing AI agents through high-level natural language intent', 'Coding while listening to music', 'Pair programming with human developers', 'Writing assembly code manually'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-6', category: 'Agent Execution', question: 'What is YOLO Mode in AI coding assistants?', correctAnswer: 'Running agents autonomously without requiring manual human confirmation for tool calls', options: ['Running agents autonomously without requiring manual human confirmation for tool calls', 'Running a single-shot prompt with 1.5 temperature', 'Testing code only in production', 'Disabling git version control'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-7', category: 'Specialized Agents', question: 'What is a Coding Agent?', correctAnswer: 'An AI agent specialized in navigating codebases, writing code, executing builds, and fixing bugs', options: ['An AI agent specialized in navigating codebases, writing code, executing builds, and fixing bugs', 'A human software engineering consultant', 'An automated code syntax highlighter', 'A git repository web server'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-8', category: 'Tool Execution', question: 'What is Tool Calling / Function Calling?', correctAnswer: 'An LLM\'s capability to output structured JSON arguments to invoke external APIs and scripts', options: ['An LLM\'s capability to output structured JSON arguments to invoke external APIs and scripts', 'Calling a telephone hotline for technical support', 'Executing a shell script manually in terminal', 'Importing a C++ header library'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-9', category: 'Customizations', question: 'What is a Skill in Antigravity/AGY ecosystem?', correctAnswer: 'A modular folder containing instructions, scripts, and workflows that equip agents with new capabilities', options: ['A modular folder containing instructions, scripts, and workflows that equip agents with new capabilities', 'A human developer qualification score', 'A model training hyperparameter', 'A database table column constraint'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-10', category: 'Protocols', question: 'What is MCP (Model Context Protocol)?', correctAnswer: 'An open standard enabling secure, standardized tool and context integration between clients and servers', options: ['An open standard enabling secure, standardized tool and context integration between clients and servers', 'A Master Control Program for hardware chips', 'A Microchip Processing Core specification', 'A Media Streaming Compression Protocol'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-11', category: 'Evaluation', question: 'What is an LLM Benchmark?', correctAnswer: 'A standardized test suite (e.g. MMLU, GSM8K, HumanEval) used to measure model reasoning and coding skills', options: ['A standardized test suite (e.g. MMLU, GSM8K, HumanEval) used to measure model reasoning and coding skills', 'A hardware stress test for GPU fans', 'A financial cost table for API calls', 'A database query latency timer'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-12', category: 'Reasoning Models', question: 'What is a Reasoning Model?', correctAnswer: 'A model architecture optimized to use extra test-time compute to think step-by-step before answering', options: ['A model architecture optimized to use extra test-time compute to think step-by-step before answering', 'A mathematical theorem prover software', 'A standard SQL relational database engine', 'A static rule-based expert system'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-13', category: 'Hyperparameters', question: 'What does Temperature control in LLM generation?', correctAnswer: 'The randomness and creativity of next-token probability selection (0 = deterministic, 1 = creative)', options: ['The randomness and creativity of next-token probability selection (0 = deterministic, 1 = creative)', 'The physical operating temperature of server GPUs', 'The rate of dataset download speed', 'The max token limit of prompt context'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-14', category: 'Model Lifecycles', question: 'What is AI Drift / Model Drift?', correctAnswer: 'Degradation of model performance over time due to evolving real-world data patterns', options: ['Degradation of model performance over time due to evolving real-world data patterns', 'Physical movement of server racks in data centers', 'Clock skew in network timestamps', 'Loss of internet connectivity during inference'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-15', category: 'Training Issues', question: 'What is Catastrophic Forgetting?', correctAnswer: 'When fine-tuning an LLM on new data causes it to lose previously learned skills', options: ['When fine-tuning an LLM on new data causes it to lose previously learned skills', 'When a server loses power during training', 'When a user deletes chat conversation logs', 'When a developer forgets their API password'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-16', category: 'Model Optimization', question: 'What is Quantization?', correctAnswer: 'Compressing model parameters to lower numerical precision (e.g. 16-bit to 4-bit) for faster inference', options: ['Compressing model parameters to lower numerical precision (e.g. 16-bit to 4-bit) for faster inference', 'Calculating quantum mechanics equations', 'Increasing parameter size by 4x', 'Encrypting model checkpoint files'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-17', category: 'Vector Math', question: 'What is Latent Space?', correctAnswer: 'The high-dimensional vector space where internal neural network representations reside', options: ['The high-dimensional vector space where internal neural network representations reside', 'Unused memory space on a hard drive', 'The delay time before an API responds', 'A hidden UI element in CSS'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-18', category: 'Security Architecture', question: 'What is Sandboxing in AI execution?', correctAnswer: 'Running AI-generated code inside an isolated, restricted environment to prevent system damage', options: ['Running AI-generated code inside an isolated, restricted environment to prevent system damage', 'Testing UI designs in a Figma sandbox', 'Storing backup database files in S3', 'Disabling network firewalls for testing'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-19', category: 'API Governance', question: 'What is Rate Limiting?', correctAnswer: 'Throttling the number of API requests allowed within a specific time window to control load', options: ['Throttling the number of API requests allowed within a specific time window to control load', 'Measuring the accuracy rating of model outputs', 'Calculating the hourly billing rate for developers', 'Sorting model responses by speed'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-20', category: 'Safety Systems', question: 'What are Guardrails in AI applications?', correctAnswer: 'Validation layers and input/output filters that enforce safety, privacy, and compliance rules', options: ['Validation layers and input/output filters that enforce safety, privacy, and compliance rules', 'Physical security barriers around server rooms', 'CSS UI borders surrounding text inputs', 'Git repository access permissions'], paperSet: 'set2', level: 'Level 3: Advanced' },
    { id: 's2-l3-21', category: 'Evaluation Tech', question: 'What is Cross-model Review?', correctAnswer: 'Using a separate LLM model to critique, audit, and verify the outputs of another model', options: ['Using a separate LLM model to critique, audit, and verify the outputs of another model', 'Comparing GPU hardware specs from different vendors', 'Merging two git branches from different developers', 'Migrating data between SQL databases'], paperSet: 'set2', level: 'Level 3: Advanced' },

    // LEVEL 4: PRO (20 Questions)
    { id: 's2-l4-1', category: 'Autonomous Dev', question: 'What is Zero-shot Build?', correctAnswer: 'Building a complete, production-ready feature from scratch using a single comprehensive prompt', options: ['Building a complete, production-ready feature from scratch using a single comprehensive prompt', 'Building software without writing any prompt text', 'Deploying code to a server with 0 downtime', 'Writing code without running automated tests'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-2', category: 'Engineering Quality', question: 'What is Production-grade Code?', correctAnswer: 'Code engineered with comprehensive error handling, security, performance, logging, and test coverage', options: ['Code engineered with comprehensive error handling, security, performance, logging, and test coverage', 'Quick demo code written during a hackathon', 'A draft prototype running on localhost', 'Uncompiled source code files'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-3', category: 'Product Strategy', question: 'What is an MVP (Minimum Viable Product)?', correctAnswer: 'A functional product release containing just enough core features to validate user demand', options: ['A functional product release containing just enough core features to validate user demand', 'A Most Valuable Player award in gaming', 'A Maximum Vector Precision algorithm', 'A Model Validation Protocol spec'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-4', category: 'Routing Architecture', question: 'What is a Model Router?', correctAnswer: 'An architectural component that dynamically forwards prompts to the most cost-effective/suitable LLM', options: ['An architectural component that dynamically forwards prompts to the most cost-effective/suitable LLM', 'A physical Wi-Fi router in the office', 'A DNS domain name server switch', 'A database connection balancer'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-5', category: 'Security Threats', question: 'What is Prompt Injection?', correctAnswer: 'An exploit where malicious user inputs trick an LLM into ignoring system rules and executing unauthorized commands', options: ['An exploit where malicious user inputs trick an LLM into ignoring system rules and executing unauthorized commands', 'Injecting CSS styles into web pages', 'Inserting SQL queries into relational tables', 'Injecting dependency packages via npm'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-6', category: 'System Architecture', question: 'What is AI Orchestration?', correctAnswer: 'Managing, chaining, and coordinating multiple models, agents, tools, and workflows seamlessly', options: ['Managing, chaining, and coordinating multiple models, agents, tools, and workflows seamlessly', 'Playing classical music during coding', 'Managing server container hardware racks', 'Writing automated shell scripts'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-7', category: 'Autonomous Feedback', question: 'What is a Ralph Loop in autonomous agents?', correctAnswer: 'An automated loop where an agent runs tests, inspects errors, and continuously refines code until clean success', options: ['An automated loop where an agent runs tests, inspects errors, and continuously refines code until clean success', 'A famous algorithm named after Ralph', 'A circular reference error in JavaScript', 'A continuous integration server reboot'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-8', category: 'Software Architecture', question: 'What is Technical Debt?', correctAnswer: 'The long-term cost of additional rework created by choosing fast shortcuts over clean architecture', options: ['The long-term cost of additional rework created by choosing fast shortcuts over clean architecture', 'Financial debt incurred from buying servers', 'Unpaid API bills on cloud platforms', 'The size of codebase files on disk'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-9', category: 'Human Integration', question: 'What is Human-in-the-loop (HITL)?', correctAnswer: 'Incorporating human intervention, review, or approval steps within an automated AI pipeline', options: ['Incorporating human intervention, review, or approval steps within an automated AI pipeline', 'Connecting a human brain directly to a computer', 'Manual typing of source code', 'User registration via email'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-10', category: 'AI Degradation', question: 'What is Model Collapse?', correctAnswer: 'Degradation of model capabilities caused by recursively training new models on synthetic AI-generated data', options: ['Degradation of model capabilities caused by recursively training new models on synthetic AI-generated data', 'A server crash during inference', 'Deletion of model parameters from disk', 'Out-of-memory errors on GPUs'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-11', category: 'Deployment Strategy', question: 'What is Shadow Deployment?', correctAnswer: 'Routing real production traffic to a new candidate model in parallel without serving its outputs to end users', options: ['Routing real production traffic to a new candidate model in parallel without serving its outputs to end users', 'Deploying an application secretly at midnight', 'Running server containers in dark mode', 'Deploying code without security reviews'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-12', category: 'Experimentation', question: 'What is A/B Testing in LLMs?', correctAnswer: 'Splitting user traffic between two model variants or prompts to compare performance metrics', options: ['Splitting user traffic between two model variants or prompts to compare performance metrics', 'Testing code on two different computers', 'Comparing C++ vs Rust performance', 'Testing Alpha vs Beta software builds'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-13', category: 'Security Auditing', question: 'What is Red Teaming?', correctAnswer: 'Adversarial testing where security experts simulate real attacks to identify vulnerabilities and jailbreaks', options: ['Adversarial testing where security experts simulate real attacks to identify vulnerabilities and jailbreaks', 'Building red-themed UI dashboards', 'Dividing engineering teams into two colors', 'Testing hardware cables in servers'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-14', category: 'Monitoring', question: 'What is Observability in AI systems?', correctAnswer: 'Instruments to measure, log, and trace internal model state, token usage, latency, and failure modes', options: ['Instruments to measure, log, and trace internal model state, token usage, latency, and failure modes', 'Visualizing 3D vector graphs on screen', 'Watching video camera streams', 'Inspecting raw dataset files'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-15', category: 'Cost Optimization', question: 'What are Unit Economics in AI applications?', correctAnswer: 'Analyzing cost per token and cost per user transaction to ensure profitability and financial sustainability', options: ['Analyzing cost per token and cost per user transaction to ensure profitability and financial sustainability', 'The price of buying 1 GPU chip', 'The monthly electricity bill of a server rack', 'The salary cost of 1 software engineer'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-16', category: 'Vendor Strategy', question: 'What is Vendor Lock-in?', correctAnswer: 'High dependency on a single proprietary AI platform, making migration to alternatives difficult', options: ['High dependency on a single proprietary AI platform, making migration to alternatives difficult', 'Locking a server cabinet key', 'Signing a 10-year hardware lease', 'Encrypting API keys on disk'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-17', category: 'Privacy & Security', question: 'What is Data Leakage in AI?', correctAnswer: 'Unintended exposure of sensitive training data or private context tokens in model responses', options: ['Unintended exposure of sensitive training data or private context tokens in model responses', 'Network data packet loss during transfer', 'Database corruption on hard drive', 'Leaking liquid cooling fluid in servers'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-18', category: 'Evaluation Suites', question: 'What is an Eval (Evaluation Suite)?', correctAnswer: 'An automated test suite measuring LLM output accuracy, safety, alignment, and regression metrics', options: ['An automated test suite measuring LLM output accuracy, safety, alignment, and regression metrics', 'A JavaScript `eval()` function execution', 'Evaluating employee performance reviews', 'A math calculator function'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-19', category: 'DevOps & Resilience', question: 'What is a Rollback Strategy?', correctAnswer: 'A planned procedure to quickly restore a previous stable model version or prompt configuration if an issue occurs', options: ['A planned procedure to quickly restore a previous stable model version or prompt configuration if an issue occurs', 'Rolling back a git commit locally', 'Reversing the order of prompt tokens', 'Restoring a deleted file from trash'], paperSet: 'set2', level: 'Level 4: Pro' },
    { id: 's2-l4-20', category: 'Prompt Governance', question: 'What is Context Engineering Debt?', correctAnswer: 'Accumulated inefficiencies from bloated, unmaintained system prompts and messy context window usage', options: ['Accumulated inefficiencies from bloated, unmaintained system prompts and messy context window usage', 'Financial debts owed to cloud token providers', 'Legacy code written in old programming languages', 'Disk space wasted by temporary log files'], paperSet: 'set2', level: 'Level 4: Pro' },

    // LEVEL 5: ECOSYSTEM (30 Questions)
    { id: 's2-l5-1', category: 'Frameworks', question: 'What is LangChain?', correctAnswer: 'A framework for building applications with LLMs using prompt templates, chains, and integrations', options: ['A framework for building applications with LLMs using prompt templates, chains, and integrations', 'A blockchain cryptocurrency protocol', 'A programming language compiler', 'A database ORM library'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-2', category: 'Frameworks', question: 'What is LangGraph?', correctAnswer: 'A library for building stateful, multi-actor LLM agent applications using graph-based control flow', options: ['A library for building stateful, multi-actor LLM agent applications using graph-based control flow', 'A graph plotting library for Python', 'A GraphQL database server', 'A network topology mapper'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-3', category: 'Frameworks', question: 'What is LlamaIndex?', correctAnswer: 'A data framework for connecting custom data sources and documents to LLMs for RAG applications', options: ['A data framework for connecting custom data sources and documents to LLMs for RAG applications', 'A database index optimization tool', 'A specialized Llama model architecture', 'A text tokenization library'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-4', category: 'Autonomous Agents', question: 'What is AutoGPT?', correctAnswer: 'An open-source project attempting autonomous goal execution by breaking tasks into sub-steps and tool calls', options: ['An open-source project attempting autonomous goal execution by breaking tasks into sub-steps and tool calls', 'An automatic code syntax fixer', 'An automated GPT fine-tuning pipeline', 'A paid subscription tier for OpenAI'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-5', category: 'Multi-Agent Frameworks', question: 'What is CrewAI?', correctAnswer: 'A framework for orchestrating collaborative teams of role-playing autonomous AI agents', options: ['A framework for orchestrating collaborative teams of role-playing autonomous AI agents', 'A social network app for AI researchers', 'A video game multiplayer engine', 'A cloud hosting platform'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-6', category: 'Extensibility', question: 'What is a Plugin in AI systems?', correctAnswer: 'An extension module adding custom tools, skills, or data integrations to an LLM application', options: ['An extension module adding custom tools, skills, or data integrations to an LLM application', 'A browser extension for blocking ads', 'A hardware cable connector', 'A database driver module'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-7', category: 'Dev Tooling', question: 'What is a Toolchain?', correctAnswer: 'A set of connected software utilities used sequentially to perform complex engineering or AI tasks', options: ['A set of connected software utilities used sequentially to perform complex engineering or AI tasks', 'A hardware tool chest', 'A collection of API keys', 'A list of git repository links'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-8', category: 'Classical ML', question: 'What is Random Forest?', correctAnswer: 'An ensemble machine learning algorithm combining multiple decision trees to improve predictions', options: ['An ensemble machine learning algorithm combining multiple decision trees to improve predictions', 'A random number generator algorithm', 'A database tree index structure', 'A cloud server clustering protocol'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-9', category: 'Classical ML', question: 'What is a Decision Tree?', correctAnswer: 'A flowchart-like model that splits data into branches based on feature conditions to make predictions', options: ['A flowchart-like model that splits data into branches based on feature conditions to make predictions', 'A directory tree file structure', 'A git commit history graph', 'A neural network activation function'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-10', category: 'Classical ML', question: 'What is Gradient Boosting?', correctAnswer: 'An ensemble technique building trees sequentially, each trained to correct errors of previous trees', options: ['An ensemble technique building trees sequentially, each trained to correct errors of previous trees', 'Boosting GPU clock frequency during training', 'Increasing learning rate exponentially', 'Quantizing vector embeddings'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-11', category: 'Classical ML Tasks', question: 'What is Regression in Machine Learning?', correctAnswer: 'Predicting a continuous numerical value (e.g. price, temperature) based on input features', options: ['Predicting a continuous numerical value (e.g. price, temperature) based on input features', 'Categorizing data into discrete labels', 'Grouping similar data points without labels', 'Rolling back code to a previous commit'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-12', category: 'Classical ML Tasks', question: 'What is Classification in Machine Learning?', correctAnswer: 'Categorizing data points into predefined discrete classes or label categories', options: ['Categorizing data points into predefined discrete classes or label categories', 'Predicting continuous floating point numbers', 'Generating synthetic text sentences', 'Sorting database tables by index'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-13', category: 'Classical ML Tasks', question: 'What is Clustering in Machine Learning?', correctAnswer: 'An unsupervised technique grouping similar data points together based on vector distance', options: ['An unsupervised technique grouping similar data points together based on vector distance', 'Clustering servers in a server farm', 'Group messaging in chat applications', 'Merging multiple git branches'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-14', category: 'Classical ML', question: 'What is a Support Vector Machine (SVM)?', correctAnswer: 'A supervised algorithm that finds an optimal hyperplane boundary separating different classes', options: ['A supervised algorithm that finds an optimal hyperplane boundary separating different classes', 'A virtual machine running Linux', 'A GPU hardware accelerator', 'A database connection pool'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-15', category: 'Classical ML', question: 'What is K-Nearest Neighbors (KNN)?', correctAnswer: 'A non-parametric algorithm classifying data points based on proximity to nearest training samples', options: ['A non-parametric algorithm classifying data points based on proximity to nearest training samples', 'A networking protocol for mesh routers', 'A key-value cache database', 'A neural network optimizer'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-16', category: 'NLP Fundamentals', question: 'What is an Abstract Syntax Tree (AST)?', correctAnswer: 'A tree representation of the structural syntactic hierarchy of source code or language', options: ['A tree representation of the structural syntactic hierarchy of source code or language', 'A folder structure on disk', 'A database B-tree index', 'A neural network layer diagram'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-17', category: 'NLP Fundamentals', question: 'What is Tokenization in NLP?', correctAnswer: 'Segmenting text into discrete units (tokens) suitable for model embedding and training', options: ['Segmenting text into discrete units (tokens) suitable for model embedding and training', 'Generating authentication API keys', 'Encrypting passwords on disk', 'Deleting whitespace characters'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-18', category: 'NLP Tasks', question: 'What is Named Entity Recognition (NER)?', correctAnswer: 'Identifying and classifying key entities (names, dates, locations, organizations) in text', options: ['Identifying and classifying key entities (names, dates, locations, organizations) in text', 'Renaming variables in source code', 'Formatting database column names', 'Scanning files for virus signatures'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-19', category: 'NLP Tasks', question: 'What is Part-of-Speech (POS) Tagging?', correctAnswer: 'Labeling words in text with their grammatical role (noun, verb, adjective, adverb)', options: ['Labeling words in text with their grammatical role (noun, verb, adjective, adverb)', 'Tagging git commits with version numbers', 'Adding tags to HTML elements', 'Categorizing blog posts into topics'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-20', category: 'NLP Datasets', question: 'What is a Text Corpus?', correctAnswer: 'A large, structured collection of texts used for linguistic analysis and training language models', options: ['A large, structured collection of texts used for linguistic analysis and training language models', 'A dead body of deprecated source code', 'A hardware server mainboard', 'A binary executable file'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-21', category: 'Deep Learning Arch', question: 'What is a Transformer in AI?', correctAnswer: 'The neural network architecture based on self-attention mechanisms powering modern LLMs', options: ['The neural network architecture based on self-attention mechanisms powering modern LLMs', 'An electrical power transformer in data centers', 'A data migration tool between SQL databases', 'A code transpiler converting TS to JS'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-22', category: 'Transformer Arch', question: 'What is an Attention Mechanism?', correctAnswer: 'A neural component enabling models to dynamically weigh the relevance of all tokens in a sequence', options: ['A neural component enabling models to dynamically weigh the relevance of all tokens in a sequence', 'A user notification system in UI', 'A CPU interrupt handler in OS', 'A log monitoring dashboard'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-23', category: 'Transformer Arch', question: 'What is the Encoder-Decoder architecture?', correctAnswer: 'A dual-component model where Encoder processes input context and Decoder generates output sequences', options: ['A dual-component model where Encoder processes input context and Decoder generates output sequences', 'A video file compression format', 'An encryption-decryption algorithm pair', 'A network router protocol'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-24', category: 'Neural Optimization', question: 'What is Backpropagation?', correctAnswer: 'The algorithm computing loss gradients backward through neural layers to update model weights', options: ['The algorithm computing loss gradients backward through neural layers to update model weights', 'Retrying a failed HTTP request', 'Reversing a git commit', 'Rolling back a database transaction'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-25', category: 'Neural Optimization', question: 'What is Gradient Descent?', correctAnswer: 'An iterative optimization algorithm adjusting weights in the direction of steepest loss reduction', options: ['An iterative optimization algorithm adjusting weights in the direction of steepest loss reduction', 'A gradual drop in GPU temperature', 'Decreasing download speed over time', 'A visual color gradient effect in CSS'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-26', category: 'Training Concepts', question: 'What is an Epoch in model training?', correctAnswer: 'One complete pass of the training algorithm through the entire dataset', options: ['One complete pass of the training algorithm through the entire dataset', 'A timestamp format in Unix seconds', 'The total duration of model fine-tuning', 'A software release version number'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-27', category: 'Training Concepts', question: 'What is Batch Size?', correctAnswer: 'The number of training samples processed simultaneously in a single forward/backward pass', options: ['The number of training samples processed simultaneously in a single forward/backward pass', 'The file size of the compressed model zip', 'The number of GPUs installed in a server', 'The max limit of context tokens'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-28', category: 'AI Platforms', question: 'What is Hugging Face?', correctAnswer: 'An open platform and community hosting pretrained models, datasets, and machine learning tools', options: ['An open platform and community hosting pretrained models, datasets, and machine learning tools', 'An emoji sticker pack for chat', 'A facial recognition hardware sensor', 'A social networking site for developers'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-29', category: 'Infrastructure', question: 'What is Containerization (Docker)?', correctAnswer: 'Packaging an application and its dependencies into lightweight, isolated execution containers', options: ['Packaging an application and its dependencies into lightweight, isolated execution containers', 'Storing physical server racks in shipping containers', 'Compressing files into TAR archives', 'Bundling JavaScript code into single files'], paperSet: 'set2', level: 'Level 5: Ecosystem' },
    { id: 's2-l5-30', category: 'Standard Protocols', question: 'What is Model Context Protocol (MCP)?', correctAnswer: 'An open standard for securely connecting AI models with local/remote tools, files, and resources', options: ['An open standard for securely connecting AI models with local/remote tools, files, and resources', 'A hardware memory bus architecture', 'A master database replication protocol', 'A network routing header format'], paperSet: 'set2', level: 'Level 5: Ecosystem' }
  ];

  resultsHistory = signal<QuizResult[]>([]);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      this.loadUserQuizHistory();
    });
  }

  get allQuestions(): QuizQuestion[] {
    return [...this.set1Questions, ...this.set2Questions];
  }

  getPaperSets() {
    return [
      { id: 'set2', title: '📄 Set 2: AI & LLM 5-Level Mastery (111 Qs)', count: 111 },
      { id: 'set1', title: '📄 Set 1: LLM Core Fundamentals (96 Qs)', count: 96 }
    ];
  }

  getLevelsForPaper(paperSet = 'set2'): string[] {
    const levels = new Set<string>();
    levels.add('All Levels');
    const target = paperSet === 'set1' ? this.set1Questions : this.set2Questions;
    target.forEach(q => {
      if (q.level) levels.add(q.level);
    });
    return Array.from(levels);
  }

  getCategories(paperSet = 'set2'): string[] {
    const cats = new Set<string>();
    cats.add('All Categories');
    const target = paperSet === 'set1' ? this.set1Questions : this.set2Questions;
    target.forEach(q => cats.add(q.category));
    return Array.from(cats);
  }

  getCategoryCounts(paperSet = 'set2'): { [category: string]: number } {
    const counts: { [category: string]: number } = {};
    const target = paperSet === 'set1' ? this.set1Questions : this.set2Questions;
    target.forEach(q => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return counts;
  }

  getQuestions(
    paperSet = 'set2',
    categoryFilter = 'All Categories',
    levelFilter = 'All Levels',
    count = 10,
    randomize = true
  ): QuizQuestion[] {
    let pool = paperSet === 'set1' ? [...this.set1Questions] : [...this.set2Questions];

    if (categoryFilter !== 'All Categories') {
      pool = pool.filter(q => q.category === categoryFilter);
    }

    if (levelFilter !== 'All Levels') {
      pool = pool.filter(q => q.level === levelFilter);
    }

    if (randomize) {
      pool = this.shuffleArray(pool);
    }

    const selected = pool.slice(0, count);

    // Shuffle options for each question so correct answer is not always first
    return selected.map(q => ({
      ...q,
      options: this.shuffleArray([...q.options])
    }));
  }

  async loadUserQuizHistory() {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = this.authService.token();

    try {
      let response: Response | null = null;
      try {
        response = await fetch('/api/quiz', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 404) {
          response = await fetch(`${API_BASE_URL}/api/quiz`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (e) {
        response = await fetch(`${API_BASE_URL}/api/quiz`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (response && response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          this.resultsHistory.set(data.results);
          this.persistLocalCache();
          return;
        }
      }
    } catch (err) {
      console.warn('Could not reach MongoDB Atlas API server for quiz results, using local store.');
    }

    this.readFromLocalStorage();
  }

  async saveResult(result: QuizResult) {
    this.resultsHistory.update(list => [result, ...list]);
    this.persistLocalCache();

    // Sync to MongoDB Atlas database
    const token = this.authService.token();
    try {
      let response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(result)
      });

      if (response.status === 404) {
        await fetch(`${API_BASE_URL}/api/quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(result)
        });
      }
    } catch (e) {
      console.warn('Could not sync quiz result to MongoDB Atlas API server.');
    }
  }

  private readFromLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.resultsHistory.set(parsed);
          }
        }
      } catch (e) {}
    }
  }

  private persistLocalCache() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(this.resultsHistory()));
      } catch (e) {}
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
