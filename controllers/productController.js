import { json, Op } from "sequelize";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    const images = req.files
      ? req.files.map(
          (file) => `http://${req.get("host")}/uploads/${file.filename}`
        )
      : [];
    const product = await Product.create({
      title,
      description,
      price,
      location,
      images: images || [],
      vendorId: req.user.id,
    });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Product not created", error: error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res
      .status(200)
      .json({ message: "successfully fetching products", products });
  } catch (error) {
    res.status(500).json({ message: "Failed to get products" });
  }
};

export const getAllVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const products = await Product.findAll({
      where: {
        vendorId: vendorId,
      },
    });

    res
      .status(200)
      .json({ message: "Succesfully fetched the vendor's products", products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vedor's products" });
  }
};

export const getAllPersonalProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        vendorId: req.user.id,
      },
    });

    res
      .status(200)
      .json({ message: "Succesfully fetched the vendor's products", products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vedor's products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found!" });
    res
      .status(200)
      .json({ message: "successfully fetched the product", product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found!" });
    const { productId } = req.body;

    const product = await Product.findOne({
      where: { vendorId: userId, id: productId },
    });

    await product.destroy();
    res.status(200).json({ message: "Succesfuly deleted the product" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the product" });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const search = req.params.searchTerm;

    // Get optional filters from query parameters
    const { minPrice, maxPrice, rating, sort } = req.query;

    // Start building the 'where' clause
    let whereClause = {
      title: {
        [Op.iLike]: `%${search}%`,
      },
    };

    // Add price filters if they exist
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
    }

    // Add rating filter if it exists
    if (rating) {
      whereClause.rating = {
        [Op.gte]: Number(rating),
      };
    }

    // Handle sorting
    let orderClause = [];
    if (sort) {
      switch (sort) {
        case "recent":
          orderClause.push(["createdAt", "DESC"]);
          break;
        case "lowPrice":
          orderClause.push(["price", "ASC"]);
          break;
        case "highPrice":
          orderClause.push(["price", "DESC"]);
          break;
        case "popular":
          orderClause.push(["soldCount", "DESC"]); // assuming you have a soldCount column
          break;
        default:
          orderClause.push(["createdAt", "DESC"]);
      }
    } else {
      orderClause.push(["createdAt", "DESC"]); // default sort
    }

    // Fetch products from database with dynamic filters
    const filteredProducts = await Product.findAll({
      where: whereClause,
      order: orderClause,
    });

    if (filteredProducts.length === 0) {
      return res.status(404).json({ message: "Could not find any products" });
    }

    res.status(200).json({
      message: "Successfully fetched filtered products",
      filteredProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch filtered products" });
  }
};
