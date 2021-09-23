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
