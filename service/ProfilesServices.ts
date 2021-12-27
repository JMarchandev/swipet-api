import { profile } from "console";
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

export const generateJWT = (userId: string) => {
  const token = jwt.sign({ sub: userId }, config.secret, {
    expiresIn: "7d",
  });

  return token;
};

const removeExceeding = (list: ProfileType[], nbRequested: number) => {
  return list.splice(list.length - nbRequested, nbRequested);
};

export const getNbRandomProfile = async (
  nbRequested: number,
  expectedIds: string[]
) => {
  try {
    let i = 0
    let listExpectedIds = [...expectedIds]
    let result: ProfileType[] = []

    while (result.length < nbRequested) {
      i++

      if (i < 10) {
        const profiles = await Profile
          .aggregate()
          .match({ deletedDate: undefined || null })
          .sample(10)

        await Profile.populate(profiles, {
          path: "animals",
          match: { deletedDate: undefined }
        })

        profiles.map((profile: ProfileType) => {
          if (!listExpectedIds.includes(profile._id.toString())) {
            listExpectedIds.push(profile._id.toString())
            result.push(profile)
          }
        })
      } else {
        break
      }
    }

    if (result.length > nbRequested) {
      result = removeExceeding(result, nbRequested)
    }
    
    return {
      message: i >= 10 && result.length === 0 ? "OUT" : "OK",
      randomProfiles: result,
    };
  } catch (error) {
    console.log(error)
    throw error
  }

}




