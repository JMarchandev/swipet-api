import jwt from "jsonwebtoken";
const config = require("../config.json");
const Profile = require("../models/Profile");

type ProfileType = {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  description: string;
  likes: string[];
  unlike: string[];
  matches: string[];
  creationDate: string;
  fireBaseId: string;
  updatedDate: string;
  __v: any;
};

const randomProfileMapper = (
  expectedIds: string[],
  profiles: ProfileType[]
): ProfileType[] => {
  const filtredProfiles: ProfileType[] = [];
  profiles.map((profile) => {
    !expectedIds.includes(profile._id.toString()) &&
      filtredProfiles.push(profile);
  });

  return filtredProfiles;
};

const removeExceeding = (list: ProfileType[], nbRequested: number) => {
  return list.splice(list.length - nbRequested, nbRequested);
};

const getRandomNumber = async () => {
  const nbProduct = await Profile.count().exec();
  return Math.floor(Math.random() * nbProduct);
};

export const getNbRandomProfile = async (
  nbRequested: number,
  expectedIds: string[]
) => {
  let i = 0;
  let randomProfiles: ProfileType[] = [];

  do {
    i++;
    if (i >= 10) {
      break;
    }

    if (randomProfiles.length === nbRequested) {
      break;
    }

    const random = await getRandomNumber();

    const profiles = await Profile.find({ deletedDate: null })
      .skip(random)
      .limit(nbRequested * 2);

    const mappedProfiles: ProfileType[] = randomProfileMapper(
      expectedIds,
      profiles
    );

    randomProfiles.push(...mappedProfiles);
  } while (randomProfiles.length <= nbRequested);

  if (randomProfiles.length >= nbRequested) {
    return {
      message: i >= 10 && randomProfiles.length === 0 ? "OUT" : "OK",
      randomProfiles: removeExceeding(randomProfiles, nbRequested),
    };
  } else {
    return {
      message: i >= 10 && randomProfiles.length === 0 ? "OUT" : "OK",
      randomProfiles,
    };
  }
};

export const generateJWT = (userId: string) => {
  const token = jwt.sign({ sub: userId }, config.secret, {
    expiresIn: "7d",
  });

  return token;
};
