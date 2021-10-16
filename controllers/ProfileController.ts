import {
  randomProfileMapper,
  generateJWT,
} from "./../service/ProfilesServices";
const Profile = require("../models/Profile");

export type CreateProfileRequest = {
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  img_uri?: string;
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  uid?: string;
  match_id?: string;
  like_id?: string;
  unlike_id?: string;
};

const errorLogger = (functionName: string, error: any) => {
  console.error(`ProfileController: error on ${functionName}`);
  console.error("Error => " + error);
};

export const getProfiles = async () => {
  try {
    const profile = await Profile.find({ deletedDate: null });
    return profile;
  } catch (error) {
    errorLogger("get", error);
    return error;
  }
};

export const getRandomProfiles = async (expectedIds: string[]) => {
  try {
    const nbProduct = await Profile.count().exec();
    const random = Math.floor(Math.random() * nbProduct);

    const randomProfiles = await Profile.find({ deletedDate: null })
      .skip(random)
      .limit(10);

    const mappedRandomProfiles = randomProfileMapper(
      expectedIds,
      randomProfiles
    );

    return mappedRandomProfiles;
  } catch (error) {
    errorLogger("getRandomProfiles", error);
    throw error;
  }
};

export const getProfileById = async (profileId: string) => {
  try {
    const profile = await Profile.findOne({ _id: profileId }).populate(
      "matches"
    );
    return profile;
  } catch (error) {
    errorLogger("getOneById", error);
    throw error;
  }
};

export const getProfileByFirebaseId = async (firebaseId: string) => {
  try {
    const profile = await Profile.findOne({ firebaseId });
    const jwt = generateJWT(profile._id);
    return { profile, jwt };
  } catch (error) {
    errorLogger("getOneById", error);
    return error;
  }
};

export const createProfile = async (req: CreateProfileRequest) => {
  let request = {
    img_uri: req.img_uri,
    firstName: req.firstName,
    lastName: req.lastName,
    name: req.firstName + " " + req.lastName,
    email: req.email,
    firebaseId: req.uid ? req.uid : undefined,
  };

  const newProfile = await new Profile(request);
  try {
    const createdProfile = await newProfile.save();
    const jwt = generateJWT(createdProfile._id);

    return { createdProfile, jwt };
  } catch (error) {
    errorLogger("create", error);
    return error;
  }
};

export const putProfile = async (
  profileId: string,
  req: UpdateProfileRequest
) => {
  try {
    const currentUser = await getProfileById(profileId);
    if (req.firstName) {
      currentUser.firstName = req.firstName;
      currentUser.name = req.firstName + " " + currentUser.lastName;
    }
    if (req.lastName) {
      currentUser.lastName = req.lastName;
      currentUser.name = currentUser.firstName + " " + req.lastName;
    }
    if (req.email) {
      currentUser.email = req.email;
    }
    if (req.uid) {
      currentUser.firebaseId = req.uid;
    }
    if (req.match_id) {
      currentUser.matches = [...currentUser.matches, req.match_id];
    }
    if (req.like_id) {
      currentUser.likes = [...currentUser.likes, req.like_id];
    }
    if (req.unlike_id) {
      currentUser.unlikes = [...currentUser.unlikes, req.unlike_id];
    }
    currentUser.updatedDate = Date.now();

    const updatedProfile = await currentUser.save();
    return updatedProfile;
  } catch (error) {
    errorLogger("put", error);
    return error;
  }
};

export const removeProfile = async (profileId: string) => {
  try {
    const currentProfile = await getProfileById(profileId);
    currentProfile.deletedDate = Date.now();

    const deletedUser = await currentProfile.save();
    return deletedUser;
  } catch (error) {
    errorLogger("remove", error);
    return error;
  }
};

module.exports = {
  getProfiles,
  getRandomProfiles,
  getProfileById,
  getProfileByFirebaseId,
  createProfile,
  putProfile,
  removeProfile,
};
