import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsApp.js";

/* PUBLIC BOOKING */
export const createBooking = async (req, res) => {
  try {
    const { slug, serviceId, clientName, clientPhone, bookingDate, slotTime } =
      req.body;

    const shop = await User.findOne({ slug });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const service = await Service.findOne({
      _id: serviceId,
      shopId: shop._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const existingBooking = await Booking.findOne({
      shopId: shop._id,
      bookingDate,
      slotTime,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const advanceRequired =
      service.advancePaymentEnabled && Number(service.advanceAmount || 0) > 0;

    const booking = await Booking.create({
      shopId: shop._id,
      serviceId,
      clientName,
      clientPhone,
      bookingDate,
      slotTime,
      status: "pending",

      paymentStatus: advanceRequired ? "pending" : "verified",
      advanceAmount: advanceRequired ? Number(service.advanceAmount) : 0,
      totalAmount: Number(service.price),
    });

    if (
      shop.whatsappConnected &&
      shop.whatsappToken &&
      shop.whatsappPhoneNumberId
    ) {
      await sendWhatsAppMessage(
        shop.whatsappToken,
        shop.whatsappPhoneNumberId,
        clientPhone,
        `Hello ${clientName}

Your appointment request has been received.

Service: ${service.serviceName}
Date: ${bookingDate}
Time: ${slotTime}
${
  advanceRequired
    ? `Advance Payment: ₹${service.advanceAmount}`
    : "No advance payment required"
}

We will confirm shortly.

Thank you.`,
      );
    }

    res.status(201).json({
      success: true,
      message: advanceRequired
        ? "Booking request created. Please pay advance and submit UTR/Transaction ID."
        : "Booking request created successfully.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* OWNER BOOKINGS */
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

/* SINGLE BOOKING */
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

/* UPDATE BOOKING STATUS */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["pending", "confirmed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

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

    booking.status = status;

    await booking.save();

    const shop = await User.findById(booking.shopId);

    if (
      shop?.whatsappConnected &&
      shop?.whatsappToken &&
      shop?.whatsappPhoneNumberId
    ) {
      if (status === "confirmed") {
        await sendWhatsAppMessage(
          shop.whatsappToken,
          shop.whatsappPhoneNumberId,
          booking.clientPhone,
          `✅ Hello ${booking.clientName}

          Your appointment has been CONFIRMED.

          Service: ${booking.serviceId?.serviceName || "Service"}
          Date: ${new Date(booking.bookingDate).toLocaleDateString()}
          Time: ${booking.slotTime}

          See you soon.`,
        );
      }

      if (status === "cancelled") {
        await sendWhatsAppMessage(
          shop.whatsappToken,
          shop.whatsappPhoneNumberId,
          booking.clientPhone,
          `❌ Hello ${booking.clientName}

          Your appointment has been CANCELLED.

          Service: ${booking.serviceId?.serviceName || "Service"}
          Date: ${new Date(booking.bookingDate).toLocaleDateString()}
          Time: ${booking.slotTime}

          Please book another slot.

          Thank you.`,
        );
      }
    }

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

/* DELETE BOOKING */
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

/* SUBMIT PAYMENT PROOF */
export const submitPaymentProof = async (req, res) => {
  try {
    const { bookingId, utrNumber } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.utrNumber = utrNumber;
    booking.paymentStatus = "submitted";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment proof submitted",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* UPDATE PAYMENT STATUS */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

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

    booking.paymentStatus = paymentStatus;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};