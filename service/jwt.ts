import expressJwt from "express-jwt";
const config = require("../config.json");

export function jwt() {
  const { secret } = config;
  return expressJwt({ secret, algorithms: ["HS256"] }).unless({
    path: [
      { url: /^\/profiles\/firebase\/.*/, methods: ["GET"] },
      { url: "/profiles", methods: ["POST"] },
    ],
  });
}

module.exports = jwt;
