import Booking from "../models/Booking.js";

export const getCustomers = async (req, res) => {
  try {
    const bookings = await Booking.find({
      shopId: req.user._id,
    });

    const customerMap = {};

    bookings.forEach((booking) => {
      const phone = booking.clientPhone;

      if (!customerMap[phone]) {
        customerMap[phone] = {
          name: booking.clientName,
          phone: booking.clientPhone,
          bookings: 1,
        };
      } else {
        customerMap[phone].bookings += 1;
      }
    });

    const customers = Object.values(customerMap);

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
