const Profile = require("../models/Profile");

const errorLogger = (functionName: string, error: any) => {
  console.error(`ProfileController: error on ${functionName}`);
  console.error("Error => " + error);
};

export type CreateProfileRequest = {
  fireBaseId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
};

const get = async () => {
  try {
    const profile = await Profile.find({ deletedDate: null });
    return profile;
  } catch (error) {
    errorLogger("get", error);
    return error;
  }
};

const getOneById = async (profileId: string) => {
  try {
    const profile = await Profile.findOne({ _id: profileId });
    return profile;
  } catch (error) {
    errorLogger("getOneById", error);
    return error;
  }
};

const create = async (req: CreateProfileRequest) => {
  let request = {
    fireBaseId: req.fireBaseId,
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

const put = async (profileId: string, req: UpdateProfileRequest) => {
  try {
    const currentUser = await getOneById(profileId);
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
    currentUser.updatedDate = Date.now();

    const updatedProfile = await currentUser.save();
    return updatedProfile;
  } catch (error) {
    errorLogger("put", error);
    return error;
  }
};

const remove = async (profileId: string) => {
  try {
    const currentProfile = await getOneById(profileId);
    currentProfile.deletedDate = Date.now();

    const deletedUser = await currentProfile.save();
    return deletedUser;
  } catch (error) {
    errorLogger("remove", error);
    return error;
  }
};

module.exports = {
  get,
  getOneById,
  create,
  put,
  remove,
};
