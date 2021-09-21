import { createProfile } from "./../controllers/ProfileController";

import express, { Request, Response } from "express";
const router = express.Router();

const faker = require("faker");

router.post("/", async (req: Request, res: Response) => {
  try {
    const users = [];
    for (let index = 0; index < 1; index++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const request = {
        firstName,
        lastName,
        email: faker.internet.email(),
        uid: "test",
      };      
      const newUser = await createProfile(request);
      users.push(newUser);
    }
    res.json(users)
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
