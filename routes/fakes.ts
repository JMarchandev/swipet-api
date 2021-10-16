import { createProfile, putProfile } from "./../controllers/ProfileController";

import express, { Request, Response } from "express";
const router = express.Router();

const faker = require("faker");

router.post("/", async (req: Request, res: Response) => {
  try {
    const users = [];
    for (let index = 0; index < 50; index++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const request = {
        img_uri: faker.image.cats(),
        firstName,
        lastName,
        email: faker.internet.email(),
        uid: "test",
      };

      const { createdProfile, jwt }: any = await createProfile(request);

      const updatedUser = await putProfile(createdProfile._id, {
        like_id: "614c97a84f44c180202feea8",
      });
      users.push(updatedUser);
    }
    res.json(users);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
