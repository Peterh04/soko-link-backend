export const verifyIsVendor = (req, res, next) => {
  if (req.user.role !== "vendor")
    return res.status(403).json({ mesage: "Only vendors can access!" });
  next();
};
