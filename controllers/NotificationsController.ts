import * as Socket from "../service/socket/socket";

import { getProfileById, putProfile } from "./ProfileController";

const getIOInstance = require("../src/server");

const logger = require("../service/loggers/winston/index");
const Notifications = require("../models/Notifications");

type AddNotificationRequest = {
  match?: any;
  message?: any;
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

const getNotificationsById = async (_id: string) => {
  try {
    const notifications = await Notifications.findOne({ _id });
    return notifications;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const addNotification = async (
  profileId: string,
  req: AddNotificationRequest
) => {
  try {
    const currentProfile = await getProfileById(profileId);
    const notifications = await getNotificationsById(
      currentProfile.notifications
    );
    if (req.message) {
      notifications.messages = notifications.messages.length
        ? [...notifications.messages, req.message]
        : [req.message];
    }
    if (req.match) {
      notifications.match = notifications.matches.length
        ? [...notifications.matches, req.match]
        : [req.match];
    }
    notifications.updatedDate = Date.now();
    const updatedNotifications = await notifications.save();
    
    Socket.emit(profileId, "new_notification", { notifications: updatedNotifications });

    return updatedNotifications;
  } catch (error) {}
};

module.exports = {
  createProfileNotification,
  addNotification,
};
