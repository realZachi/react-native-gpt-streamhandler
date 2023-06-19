import EventSource from 'react-native-sse';
import { handleStreamEvent } from '../utils/handleStreamEvent';
import { formatMessages } from '../utils/formatMessages';
import { GPTMODELS, URL } from '../utils/constants';

/**
 * Function to handle a Chat as a Conversation with the OpenAI API
 * @param {Object} options - Options for the API call
 * @param {Array} options.messages - Array of message objects
 * @param {Function} options.setMessages - Function to update the state of the messages
 * @param {string} options.apiKey - OpenAI API Key without the 'Bearer' prefix
 * @param {function} options.statusCallback - Optional function to update the status of the chat (true when the chat is started, false when the chat is finished)
 * @param {string} options.model - Optional model from GPTMODELS Type to use for the chat (default is GPT-3.5-turbo)
 * @param {string} options.url - Optional URL of the API endpoint (default is OpenAI chat endpoint)
 * @returns {messages} - Returns the updated messages array with the response from the API
 */
export function ChatHandler({
  messages,
  setMessages,
  apiKey,
  statusCallback,
  model = GPTMODELS.GPT3_5_TURBO,
  url = URL
}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    console.error('Please insert a valid array of prompts!');
    return;
  }

  let data = {
    model,
    messages: formatMessages(messages),
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

  const message = {
    role: 'assistant',
    content: ''
  };

  setMessages && setMessages((previousMessages) => [...previousMessages, message]);
  const listener = (event) => {
    if (event.type === 'message') {
      handleStreamEvent(event, es, statusCallback, (content) => {
        const newContent = message.content + content;
        setMessages &&
          setMessages((previousMessages) => {
            return previousMessages.map((m) => {
              if (m === message) {
                m.content = newContent;
              }
              return m;
            });
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
