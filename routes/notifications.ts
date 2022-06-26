import express, { Request, Response } from "express";
import {
  getNotificationsById,
  updateNotificationsToSeen,
} from "../controllers/NotificationsController";

const router = express.Router();

router.get("/:notificationsId", async (req: Request, res: Response) => {
  try {
    const notifications = await getNotificationsById(req.params.notificationsId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:profileId/seen", async (req: Request, res: Response) => {
  try {
    const response = await updateNotificationsToSeen(
      req.params.profileId,
      req.body.notificationName,
      req.body.notificationId
    );
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
