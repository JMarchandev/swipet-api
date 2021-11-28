import { getProfileById, putProfile } from "./ProfileController";
const Animal = require("../models/Animal");

type CreateAnimalProfileRequest = {
  ownerId: string;
  name: string;
  age: number;
  sexe: "MALE" | "FEMALE";
  animalType: "CAT" | "DOG";
};

const errorLogger = (functionName: string, error: any) => {
  console.error(`ProfileController: error on ${functionName}`);
  console.error("Error => " + error);
};

export const getAnimalById = async (animalId: string) => {
  try {
    const animal = await Animal.findOne({ _id: animalId });
    return animal;
  } catch (error) {
    errorLogger("getAnimalById", error);
    throw error;
  }
};

export const createAnimalProfile = async (req: CreateAnimalProfileRequest) => {
  const newAnimalProfile = await new Animal(req);

  try {
    const ownerProfile = await getProfileById(req.ownerId);
    const createdAnimalProfile = await newAnimalProfile.save();

    await putProfile(ownerProfile._id, {
      animals: [...ownerProfile.animals, createdAnimalProfile._id],
    });
    return createdAnimalProfile;
  } catch (error) {
    errorLogger("createAnimalProfile", error);
    return error;
  }
};

export const removeAnimalProfile = async (animalId: string) => {
  try {
    const currentAnimal = await getAnimalById(animalId);
    currentAnimal.deletedDate = Date.now();

    const deletedAnimal = await currentAnimal.save();
    return deletedAnimal;
  } catch (error) {}
};

module.exports = {
  createAnimalProfile,
  removeAnimalProfile
};
