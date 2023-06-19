/**
 * Convert message objects to a format suitable for OpenAI API
 * @param {*} messages - Array of message objects
 * @returns new message list with appropriate format
 */
export function formatMessages(messages) {
    return messages.map(({_id, text, createdAt, ...rest}) => rest);
}
