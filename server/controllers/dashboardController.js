import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const shopId = req.user._id;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const todayBookings = await Booking.countDocuments({
      shopId,
      bookingDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const pendingBookings = await Booking.countDocuments({
      shopId,
      status: "pending",
    });

    const confirmedBookings = await Booking.countDocuments({
      shopId,
      status: "confirmed",
    });

    const bookings = await Booking.find({
      shopId,
      status: "confirmed",
    }).populate("serviceId");

    let estimatedRevenue = 0;

    bookings.forEach((booking) => {
      if (booking.serviceId?.price) {
        estimatedRevenue += booking.serviceId.price;
      }
    });

    res.status(200).json({
      success: true,

      stats: {
        todayBookings,
        pendingBookings,
        confirmedBookings,
        estimatedRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
