import * as MessageController from "../../controllers/MessageController";

export const createMessage = async (
  messageContent: string,
  sender: string,
  room: string
) => {
  try {
    const createdMessage = await MessageController.createMessage({
      content_text: messageContent,
      sender: sender,
      conversation: room,
    });
    return createdMessage;
  } catch (error) {
    throw error;
  }
};

module.exports = { createMessage };
