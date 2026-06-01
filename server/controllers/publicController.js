import User from "../models/User.js";
import Service from "../models/Service.js";

/* Get Shop By Slug */
export const getShopBySlug = async (req, res) => {
  try {
    const shop = await User.findOne({
      slug: req.params.slug,
    }).select("-password");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Get Services By Slug */
export const getServicesBySlug = async (req, res) => {
  try {
    const shop = await User.findOne({
      slug: req.params.slug,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const services = await Service.find({
      shopId: shop._id,
    });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
