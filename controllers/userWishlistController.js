import Product from "../models/Product.js";
import { UserWishlist } from "../models/userWishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findByPk(productId);
    if (!product)
      return res.status(404).json({ message: "Could not find product" });
    const exist = await UserWishlist.findOne({ where: { userId, productId } });
    if (exist)
      return res
        .status(400)
        .json({ message: "Product already exists in the wishlist" });

    await UserWishlist.create({
      productId,
      userId,
    });
    res.status(200).json({ mesaage: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Could not add to wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const existProduct = await UserWishlist.findOne({
      where: { userId, productId },
    });
    if (!existProduct)
      return res
        .status(400)
        .json({ message: "Does not exist in the wishlist" });
    await UserWishlist.destroy({
      where: {
        userId: userId,
        productId: productId,
      },
    });
    res.status(200).json({ message: "Removed from wishlist!" });
  } catch (error) {
    res.status(500).json({ message: "Could not unlike product" });
  }
};

export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishliist = await UserWishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["id", "title", "price", "images", "location"],
        },
      ],
    });

    if (!wishliist)
      return res.status(404).json({ mesaage: "User does not have wishlist" });

    res
      .status(200)
      .json({ mesaage: "successfully fetched the user's wishlist", wishliist });
  } catch (error) {
    res.status(500).json({ mesaage: "Could not fetch user wishliist" });
  }
};
