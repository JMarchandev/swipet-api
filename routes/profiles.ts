import fs from "fs";
import path from "path";

import {
  getProfiles,
  getRandomProfiles,
  getProfileById,
  getProfileByFirebaseId,
  createProfile,
  putProfile,
  updateProfileImage,
  removeProfile,
} from "../controllers/ProfileController";

import multer from "multer";
import express, { Request, Response } from "express";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.params;
    const dir = `./static/${id}`;

    if (!fs.existsSync(dir)) {
      return fs.mkdir(dir, (error) => cb(error, dir));
    }

    fs.readdir(dir, (err, files) => {
      if (err) throw err;

      for (const currentFile of files) {
        if (currentFile.split("_")[0] === file.fieldname) {
          fs.unlink(path.join(dir, currentFile), (err) => {
            if (err) throw err;
          });
        }
      }
    });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + req.params.id + "_" + Date.now());
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

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

router.patch(
  "/:id/cropped-image",
  upload.single("croppedImage"),
  async (req: Request, res: Response) => {
    console.log("croppedImage", req.file);
    const file = req.file;

    try {
      const updatedProfileImage = await updateProfileImage(
        req.params.id,
        file,
        "croppedImage"
      );

      res.json(updatedProfileImage);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.patch(
  "/:id/default-image",
  upload.single("defaultSource"),
  async (req: Request, res: Response) => {
    console.log("defaultSource", req.file);
    const file = req.file;

    try {
      const updatedProfileImage = await updateProfileImage(
        req.params.id,
        file,
        "defaultSource"
      );

      res.json(updatedProfileImage);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

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
