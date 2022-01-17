import * as MessageService from "../../service/socket/message";

import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server } from "socket.io";

let IO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> | null =
  null;

export const initConnection = (io: any) => {
  io.on("connection", (socket: any) => {
    socket.on("connect_error", (err: Error) => {
      console.log(`connect_error due to ${err.message}`);
    });

    IO = io;

    socket.on("join_chat", ({ id, room }: { id: string; room: string }) => {
      console.log("user " + id + " join room :" + room);
      socket.join(room);
    });

    socket.on("join_notifications", ({ id }: { id: string }) => {
      console.log("notification id => ", id);
      socket.join(id);
    });

    socket.on(
      "sendMessage",
      async ({ room, message, sender }: any, callback: any) => {
        console.log(room, message, sender);
        try {
          const newMessage = await MessageService.createMessage(
            message,
            sender,
            room
          );
          emit(room, "message", { message: newMessage });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", (reason: any) => {
      console.log("user disconnect, reason:", reason);
    });

    console.log(io.sockets.adapter.rooms);
    
  });
};

export const emit = (room: string, keyEvent: string, data: any) => {
  if (IO) {
      console.log('i emit')
    IO.to(room).emit(keyEvent, data);
  }
};

module.exports = {
  initConnection,
  emit,
};