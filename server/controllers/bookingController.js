import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

/* ==========================================
   PUBLIC BOOKING
========================================== */

export const createBooking = async (req, res) => {
  try {
    const { slug, serviceId, clientName, clientPhone, bookingDate, slotTime } =
      req.body;

    // Find Shop By Slug
    const shop = await User.findOne({ slug });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Check Service
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check Slot Availability
    const existingBooking = await Booking.findOne({
      shopId: shop._id,
      bookingDate,
      slotTime,
      status: {
        $ne: "cancelled",
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    // Create Booking
    const booking = await Booking.create({
      shopId: shop._id,
      serviceId,
      clientName,
      clientPhone,
      bookingDate,
      slotTime,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   OWNER BOOKINGS
========================================== */

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      shopId: req.user._id,
    })
      .populate("serviceId")
      .sort({
        bookingDate: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   SINGLE BOOKING
========================================== */

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      shopId: req.user._id,
    }).populate("serviceId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   UPDATE STATUS
========================================== */

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      shopId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DELETE BOOKING
========================================== */

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      shopId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
