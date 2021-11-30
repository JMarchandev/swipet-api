import express, { Request, Response } from "express";
import {
  createAnimalProfile,
  putAnimalProfile,
  removeAnimalProfile,
} from "../controllers/AnimalController";
const router = express.Router();

// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const animals = await getAnimals();
//     res.json(animals);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// router.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const animal = await getAnimalById(req.params.id);
//     res.json(animal);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

router.post("/", async (req: Request, res: Response) => {
  try {
    const animal = await createAnimalProfile(req.body);
    res.json(animal);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updatedAnimalProfile = await putAnimalProfile(
      req.params.id,
      req.body
    );
    res.json(updatedAnimalProfile);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedAnimalProfile = await removeAnimalProfile(req.params.id);
    res.json({
      message: `${deletedAnimalProfile.name} is temporaly deleted`,
      _id: deletedAnimalProfile._id,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
