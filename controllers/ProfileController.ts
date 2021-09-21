const Profile = require("../models/Profile");

export type CreateProfileRequest = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  uid?: string;
  match_id?: string;
};

const errorLogger = (functionName: string, error: any) => {
  console.error(`ProfileController: error on ${functionName}`);
  console.error("Error => " + error);
};

export const getProfile = async () => {
  try {
    const profile = await Profile.find({ deletedDate: null });
    return profile;
  } catch (error) {
    errorLogger("get", error);
    return error;
  }
};

export const getProfileById = async (profileId: string) => {
  try {
    const profile = await Profile.findOne({ _id: profileId });
    return profile;
  } catch (error) {
    errorLogger("getOneById", error);
    return error;
  }
};

const getProfileByFirebaseId = async (fireBaseId: string) => {
  try {
    const profile = await Profile.findOne({ fireBaseId });
    return profile;
  } catch (error) {
    errorLogger("getOneById", error);
    return error;
  }
};

export const createProfile = async (req: CreateProfileRequest) => {
  let request = {
    firebaseId: req.uid,
    firstName: req.firstName,
    lastName: req.lastName,
    name: req.firstName + " " + req.lastName,
    email: req.email,
  };

  const newProfile = await new Profile(request);
  try {
    const createdProfile = await newProfile.save();
    return createdProfile;
  } catch (error) {
    errorLogger("create", error);
    return error;
  }
};

export const putProfile = async (profileId: string, req: UpdateProfileRequest) => {
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
    currentUser.updatedDate = Date.now();

    const updatedProfile = await currentUser.save();
    return updatedProfile;
  } catch (error) {
    errorLogger("put", error);
    return error;
  }
};

const removeProfile = async (profileId: string) => {
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
  getProfile,
  getProfileById,
  getProfileByFirebaseId,
  createProfile,
  putProfile,
  removeProfile,
};
