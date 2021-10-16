import jwt from "jsonwebtoken";
const config = require("../config.json");

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

export const randomProfileMapper = (
  expectedIds: string[],
  profiles: ProfileType[]
) => {
  return profiles.filter((profile) => !expectedIds.includes(profile._id));
};

export const generateJWT = (userId: string) => {
  const token = jwt.sign({ sub: userId }, config.secret, {
    expiresIn: "7d",
  });

  return token;
};
