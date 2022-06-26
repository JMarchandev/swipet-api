import * as Socket from "../service/socket/socket";

import { getProfileById, putProfile } from "./ProfileController";

import { mongoMapToJSON } from "../service/json";

const logger = require("../service/loggers/winston/index");
const Notifications = require("../models/Notifications");

type AddNotificationRequest = {
  matches?: any;
  messages?: any;
};

type PutNotificationRequest = {
  messages: any;
};

type NotificationName = "messages" | "matches";

const getNotificationByProfileId = async (profileId: string) => {
  try {
    const currentProfile = await getProfileById(profileId);
    const notifications = await getNotificationsById(
      currentProfile.notifications
    );

    return notifications;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const createProfileNotification = async (profileId: string) => {
  try {
    const notifications = await new Notifications({ profile_id: profileId });
    const updatedProfile = await putProfile(profileId, {
      notifications: notifications._id,
    });
    await notifications.save();

    return updatedProfile;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const getNotificationsById = async (_id: string) => {
  try {
    let notifications = await Notifications.findOne({ _id });

    notifications.messages.filter((message: any) => message.seen !== true);
    notifications.matches.filter((message: any) => message.seen !== true);

    return notifications;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const putNotifications = async (
  notificationId: string,
  req: PutNotificationRequest
) => {
  try {
    const currentNotifications = await getNotificationsById(notificationId);

    if (req.messages) {
      currentNotifications.messages = req.messages;
    }

    const updatedNotifications = await currentNotifications.save();

    return updatedNotifications;
  } catch (error) {}
};

export const addNotification = async (
  profileId: string,
  req: AddNotificationRequest,
  notificationName: NotificationName
) => {
  try {
    const notifications = await getNotificationByProfileId(profileId);

    const mappedNotifications = mongoMapToJSON(notifications);

    const messagesNotificationListId = Array.from(
      new Set(
        mappedNotifications.messages.map(
          (message: any) => message.conversation_id
        )
      )
    );
    const matchesListId = Array.from(
      new Set(mappedNotifications.matches.map((match: any) => match.match_id))
    );

    if (
      req.messages &&
      !messagesNotificationListId.includes(req.messages.conversation_id)
    ) {
      notifications.messages = notifications.messages.length
        ? [...notifications.messages, req.messages]
        : [req.messages];
    }
    if (req.matches && !matchesListId.includes(req.messages.match_id)) {
      notifications.match = notifications.matches.length
        ? [...notifications.matches, req.matches]
        : [req.matches];
    }
    notifications.updatedDate = Date.now();
    await notifications.save();

    Socket.emit(profileId, "new_notification", {
      notification: req,
      notificationName,
    });

    return;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const updateNotificationsToSeen = async (
  profileId: string,
  notificationName: NotificationName,
  notificationId: string
) => {
  try {
    let notifications = await getNotificationByProfileId(profileId);

    const mappedNotifications = mongoMapToJSON(notifications);

    notifications = {
      ...notifications,
      [notificationName]: mappedNotifications[notificationName].filter(
        (notification: any) => {
          if (notificationName === "messages") {
            return notification.conversation_id !== notificationId;
          }
        }
      ),
    };

    await putNotifications(notifications._id, {
      messages: notifications.messages,
    });

    return;
  } catch (error) {
    logger(error);
    throw error;
  }
};

module.exports = {
  createProfileNotification,
  getNotificationsById,
  addNotification,
  updateNotificationsToSeen,
};
