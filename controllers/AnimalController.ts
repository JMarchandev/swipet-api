import { uploadImage } from "../service/aws/bucketS3";
import { getProfileById, putProfile } from "./ProfileController";
const logger = require('../service/loggers/winston/index');
const Animal = require("../models/Animal");

type CreateAnimalProfileRequest = {
  ownerId: string;
  name: string;
  age: number;
  sexe: "MALE" | "FEMALE";
  animalType: "CAT" | "DOG";
};

type updateAnimalRequest = {
  name: string;
  age: number;
  sexe: "MALE" | "FEMALE" | string;
  animalType: "CAT" | "DOG" | string;
};

type AnimalType = "DOG" | "CAT";

const getDefaultAnimalProfileImage = (type: AnimalType) => {
  const url = "https://swipet-api-animal-pi.s3.eu-west-3.amazonaws.com/";
  if (type === "CAT") {
    return {
      defaultSource: url + "cat.jpg",
      croppedImage: url + "cropped_cat.jpg",
    };
  } else if (type === "DOG") {
    return {
      defaultSource: url + "dog.jpg",
      croppedImage: url + "cropped_dog.jpg",
    };
  }
};

export const getAnimalById = async (animalId: string) => {
  try {
    const animal = await Animal.findOne({ _id: animalId });
    return animal;
  } catch (error) {
    logger.error(error)
    throw error;
  }
};

export const createAnimalProfile = async (req: CreateAnimalProfileRequest) => {
  const newAnimalProfile = await new Animal({
    ...req,
    profileImage: getDefaultAnimalProfileImage(req.animalType),
  });

  try {
    const ownerProfile = await getProfileById(req.ownerId);
    const createdAnimalProfile = await newAnimalProfile.save();

    await putProfile(ownerProfile._id, {
      animals: [...ownerProfile.animals, createdAnimalProfile._id],
    });
    return createdAnimalProfile;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const putAnimalProfile = async (
  animalId: string,
  req: updateAnimalRequest
) => {
  try {
    const currentAnimal = await getAnimalById(animalId);

    if (req.age) {
      currentAnimal.age = req.age;
    }
    if (req.animalType) {
      currentAnimal.animalType = req.animalType;
    }
    if (req.name) {
      currentAnimal.name = req.name;
    }
    if (req.sexe) {
      currentAnimal.sexe = req.sexe;
    }
    currentAnimal.updatedDate = Date.now();

    const updatedAnimalProfile = await currentAnimal.save();
    return updatedAnimalProfile;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const updateAnimalProfileImage = async (
  animalId: string,
  file: any,
  keyToUpdate: "croppedImage" | "defaultSource"
) => {
  const fileName = file.fieldname + "_" + animalId + "_" + Date.now();

  try {
    const uploadedImageProfile = await uploadImage(
      animalId,
      file,
      fileName,
      keyToUpdate
    );

    const currentAnimal = await getAnimalById(animalId);

    currentAnimal.profileImage = {
      ...currentAnimal.profileImage,
      [keyToUpdate]: uploadedImageProfile.Location,
    };
    currentAnimal.updatedDate = Date.now();

    const updatedAnimal = await currentAnimal.save();
    return updatedAnimal;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const removeAnimalProfile = async (animalId: string) => {
  try {
    const currentAnimal = await getAnimalById(animalId);
    currentAnimal.deletedDate = Date.now();

    const deletedAnimal = await currentAnimal.save();
    return deletedAnimal;
  } catch (error) {
    logger.error(error)
  }
};

module.exports = {
  createAnimalProfile,
  updateAnimalProfileImage,
  removeAnimalProfile,
  putAnimalProfile,
};
