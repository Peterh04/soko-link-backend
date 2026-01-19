import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role", "createdAt", "profileImage"],
    });

    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ message: "successfully fetching the user", user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the user", error: error });
  }
};

// export const updateUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { name, email } = req.body;

//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ message: "User not found!" });

//     const updateFields = {};
//     if (name) updateFields.name = name;
//     if (email) updateFields.email = email;

//     if (req.file) {
//       const upload = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "soko-link-users", resource_type: "image" },
//           (error, result) => (error ? reject(error) : resolve(result)),
//         );
//         stream.end(req.file.buffer);
//       });
//       updateFields.profileImage = upload.secure_url;
//     }

//     if (Object.keys(updateFields).length === 0) {
//       return res.status(400).json({ message: "No fields provided to update" });
//     }

//     const updatedUser = await user.update(updateFields);

//     res.status(200).json({
//       message: "Updated user successfully!",
//       user: updatedUser,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to update user!", error: error.message });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    console.log("=== UPDATE USER CALLED ===");

    const userId = req.user.id;
    console.log("User ID from token:", userId);

    console.log("Request body:", req.body);
    console.log("req.file before Cloudinary:", req.file);

    const user = await User.findByPk(userId);
    console.log("User fetched from DB:", user);

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found!" });
    }

    const updateFields = {};

    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.email) updateFields.email = req.body.email;

    if (req.file) {
      console.log("Uploading image to Cloudinary...");
      const upload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "soko-link-users", resource_type: "image" },
          (error, result) => (error ? reject(error) : resolve(result)),
        );
        stream.end(req.file.buffer);
      });
      console.log("Cloudinary upload result:", upload);
      updateFields.profileImage = upload.secure_url;
    }

    console.log("Fields prepared for update:", updateFields);

    if (Object.keys(updateFields).length === 0) {
      console.log("Nothing to update!");
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await user.update(updateFields);

    console.log("User updated successfully:", updatedUser);

    res.status(200).json({
      message: "Updated user successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res
      .status(500)
      .json({ message: "Failed to update user!", error: error.message });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) return res.status(401).json({ message: "Invalid password!" });
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Succesfully updated the password!" });
  } catch (error) {
    res.status(500).json({ message: "Could not update the user password" });
  }
};

export const upgradeUserRole = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found!" });
    user.role = "vendor";
    user.save();
    res
      .status(200)
      .json({ message: "Succesfully updated the user role to vendor" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could  not upgrade the user role to  vendor" });
  }
};
