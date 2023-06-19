import EventSource from 'react-native-sse';
import { handleStreamEvent } from '../utils/handleStreamEvent';
import { GPTMODELS, URL } from '../utils/constants';

/**
 * Function to handle a single message with the OpenAI API
 * @param {Object} options - Options for the API call
 * @param {string} options.inputMessage - Input message to send to the API
 * @param {function} options.setResponse - Function to update the state of the response
 * @param {string} options.apiKey - OpenAI API Key without the 'Bearer' prefix
 * @param {function} options.statusCallback - Optional function to update the status of the chat (true when the chat is started, false when the chat is finished)
 * @param {string} options.model - Optional model from GPTMODELS to use for the chat (default is GPT-3.5-turbo)
 * @param {string} options.url - Optional URL of the API endpoint (default is OpenAI chat endpoint)
 * @returns {setResponse} - Returns the setResponse function with the api response as a string in real time
 */
export function SingleMessageHandler({
  inputMessage,
  setResponse,
  apiKey,
  statusCallback,
  model = GPTMODELS.GPT3_5_TURBO,
  url = URL
}) {
  if (!inputMessage || typeof inputMessage !== 'string') {
    console.error('Please insert a valid message string!');
    return;
  }

  let data = {
    model,
    messages: [
      {
        role: 'user',
        content: inputMessage
      }
    ],
    stream: true
  };

  const es = new EventSource(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    method: 'POST',
    body: JSON.stringify(data),
    pollingInterval: 25000
  });

  statusCallback && statusCallback(true);

  const listener = (event) => {
    if (event.type === 'message') {
      handleStreamEvent(event, es, statusCallback, (content) => {
        setResponse((previousResponse) => {
          return previousResponse + content;
        });
      });
    } else if (event.type === 'error' || event.type === 'exception') {
      console.error(event.type, event.message);
    }
  };

  es.addEventListener('open', listener);
  es.addEventListener('message', listener);
  es.addEventListener('error', listener);

  return () => {
    es.removeAllEventListeners();
    es.close();
    statusCallback && statusCallback(false);
  };
}
