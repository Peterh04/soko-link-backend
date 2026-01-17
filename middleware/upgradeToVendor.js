import User from "../models/User.js";

export const upgradeToVendor = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.role !== "vendor") {
      user.role = "vendor";
      await user.save();
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upgrade user role" });
  }
};
