import User from "../models/User.js";

export const verifyIsVendor = async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  if (user.role !== "vendor") {
    return res.status(403).json({ mesage: "Only vendors can access!" });
  }
  next();
};
