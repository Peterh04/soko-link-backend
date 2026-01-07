import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(403)
      .json({ message: "A token is required for authentication!" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "The token is Invalid!" });
    req.user = user;
    next();
  });
};

export default verifyToken;
