import Service from "../models/Service.js";

/* Create Service */
export const createService = async (req, res) => {
  try {
    const {
      categoryName,
      serviceName,
      price,
      duration,
      advancePaymentEnabled,
      advanceAmount,
    } = req.body;

    const service = await Service.create({
      shopId: req.user._id,
      categoryName,
      serviceName,
      price,
      duration,
      advancePaymentEnabled: advancePaymentEnabled || false,
      advanceAmount: advancePaymentEnabled ? Number(advanceAmount || 0) : 0,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Get All Services Of Logged In Shop */
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({
      shopId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Update Service */
export const updateService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      shopId: req.user._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const updateData = {
      ...req.body,
      advanceAmount: req.body.advancePaymentEnabled
        ? Number(req.body.advanceAmount || 0)
        : 0,
    };

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Service updated",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Delete Service */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      shopId: req.user._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
