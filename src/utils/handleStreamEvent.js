
/**
 * Function to handle 'message' event in chat stream
 * @param {*} event - event object
 * @param {*} es - EventSource instance
 * @param {*} statusCallback - Function to update the status of the chat
 * @param {*} callback - Function to update the state of the messages
 */
export function handleStreamEvent(event, es, statusCallback, callback) {
    if (event.data !== "[DONE]") {
        const data = JSON.parse(event.data);
        const delta = data.choices[0].delta;
        const finish_reason = data.choices[0].finish_reason;
        if (finish_reason === "stop") {
            es.close();
            statusCallback && statusCallback(false);
        } else {
            if (delta && delta.content) {
                callback(delta.content);
            }
        }
    } else {
        es.close();
        statusCallback && statusCallback(false);
    }
}
