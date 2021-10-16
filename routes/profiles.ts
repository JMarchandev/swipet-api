import {
  getProfiles,
  getRandomProfiles,
  getProfileById,
  getProfileByFirebaseId,
  createProfile,
  putProfile,
  removeProfile,
} from "../controllers/ProfileController";

import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const profiles = await getProfiles();
    res.json(profiles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/random", async (req: Request, res: Response) => {
  try {
    const randomProfiles = await getRandomProfiles(req.body.expectedIds);
    res.json(randomProfiles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const profile = await getProfileById(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/firebase/:id", async (req: Request, res: Response) => {
  try {
    const profile = await getProfileByFirebaseId(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { createdProfile, jwt }: any = await createProfile(req.body);
    res.json({ profile: createdProfile, jwt });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updatedProfile = await putProfile(req.params.id, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedProfile = await removeProfile(req.params.id);
    res.json({ message: `user ${deletedProfile._id} is temporaly deleted` });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
