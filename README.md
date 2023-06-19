
# React Native GPT Stream Handler

This is a helper library for React Native developers who want to build applications using the OpenAI API. The main aim is to streamline the process of handling Server-Sent Events (SSE) stream from the OpenAI API, mimicking a `real-time chat` environment.

The package exposes two main components: `ChatHandler` and `SingleMessageHandler`, which facilitate multi-turn conversation and single message handling respectively.

<img src="https://github.com/realZachi/react-native-gpt-streamhandler/blob/master/assets/rn-stream.gif" width="50%"/>

### Jump to Section

-  [Chat Conversation (i.e. follow up messages)](#ChatHandler.js)
-  [Just one single in- and output message](#SingleMessageHandler.js)

___

## Installation

Use the package manager [npm](https://npmjs.com) to install:

```bash
npm install react-native-gpt-streamhandler
```
___

## Usage

### ChatHandler.js

ChatHandler.js is the main component to handle multi-turn conversations with the OpenAI API.

```javascript
import { ChatHandler } from 'react-native-gpt-streamhandler';

const [messages, setMessages] = useState([{role: 'user', content: 'Whats the meaning of life?}]);
const [isTyping, setIsTyping] = useState(false);

// Sample usage

ChatHandler({
  messages: messages,
  setMessages: setMessages,
  apiKey: 'sk_xxxxxxxxxx,'
  statusCallback: setIsTyping,
  model: GPTMODELS.GPT3_5_TURBO,
});
```

#### Parameters

- `messages`: An array of message objects with the structure: `{role: 'user' | 'assistant', content: 'string'}`.
- `setMessages`: Function to update the state of the messages.
- `apiKey`: Your OpenAI API Key (without the 'Bearer' prefix).
- `statusCallback`: Optional. Function to update the status of the chat (true when the chat starts, false when it ends).
- `model`: Optional. Model to use for the chat (default is GPT-3.5-turbo). Refer to the GPTMODELS in `constants.js` for all available options.
- `url`: Optional. URL of the API endpoint (default is OpenAI chat endpoint).

#### Response

The response will be added to the messages Array like this:
```
[
	{
		role: 'user', 
		content: 'Whats the meaning of life?'
	},
	{
		role: "assistant", 
		content: 'As an AI Model...
	}
]
```


___

### SingleMessageHandler.js

SingleMessageHandler.js is a component to handle a single message with the OpenAI API. You get a single response as a String back.

```javascript
import { SingleMessageHandler } from 'react-native-openai-stream-handler';

const [response, setResponse] = useState("");

// Sample usage
SingleMessageHandler({
  inputMessage: 'Whats the meaning of life?',
  setResponse: setResponse,
  apiKey: 'sk_xxxxxxxxxx,'
  statusCallback: getIsTyping,
  model: GPTMODELS.GPT3_5_TURBO,
});

useEffect(() => {
	//get realtime response
	console.log(response)
}, [response]);

```

#### Parameters

- `inputMessage`: The input message to send to the API.
- `setResponse`: Function to update the state of the response in realtime.
- `apiKey`: Your OpenAI API Key (without the 'Bearer' prefix).
- `statusCallback`: Optional. Function to update the status of the chat (true when the chat starts, false when it ends).
- `model`: Optional. Model to use for the chat (default is GPT-3.5-turbo). Refer to the GPTMODELS in [Constants](#Constants) for all available options.
- `url`: Optional. URL of the API endpoint (default is OpenAI chat endpoint).

#### Response

The setResponse function will be updated in realtime so that the response state will be changed for every token.

## Constants

```javascript
export const GPTMODELS = {  
GPT3_5_TURBO: 'gpt-3.5-turbo',  
GPT3_5_TURBO_0613: 'gpt-3.5-turbo-0613',  
GPT3_5_TURBO_16K: 'gpt-3.5-turbo-16k',  
GPT3_5_TURBO_16K_0613: 'gpt-3.5-turbo-16k-0613',  
GPT4: 'gpt-4',  
GPT4_0613: 'gpt-4-0613',  
GPT4_32K: 'gpt-4-32k',  
GPT4_32K_0613: 'gpt-4-32k-0613'  
};
```

GPTMODELS is an object that provides keys to reference different versions of the GPT-3, GPT-3.5-turbo, and GPT-4 models. URL is a constant string which points to the OpenAI chat API endpoint.

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

