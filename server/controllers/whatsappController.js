import axios from "axios";
import User from "../models/User.js";

/* ==========================
   CONNECT WHATSAPP
========================== */

export const connectWhatsApp = async (req, res) => {
  try {
    const redirectUri = process.env.WHATSAPP_REDIRECT_URI;

    const state = req.user._id.toString();

    const url =
      `https://www.facebook.com/v23.0/dialog/oauth` +
      `?client_id=${process.env.FACEBOOK_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}` +
      `&scope=business_management,whatsapp_business_management,whatsapp_business_messaging`;

    res.redirect(url);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   WHATSAPP CALLBACK
========================== */

export const whatsappCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code missing",
      });
    }

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "User state missing",
      });
    }

    const tokenRes = await axios.get(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: process.env.WHATSAPP_REDIRECT_URI,
          code,
        },
      },
    );

    const accessToken = tokenRes.data.access_token;

    const businessRes = await axios.get(
      "https://graph.facebook.com/v23.0/me/businesses",
      {
        params: {
          access_token: accessToken,
        },
      },
    );

    const businessId = businessRes.data?.data?.[0]?.id;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "No business account found",
        data: businessRes.data,
      });
    }

    const wabaRes = await axios.get(
      `https://graph.facebook.com/v23.0/${businessId}/owned_whatsapp_business_accounts`,
      {
        params: {
          access_token: accessToken,
        },
      },
    );

    const wabaList = wabaRes.data?.data || [];

    if (wabaList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No WhatsApp Business Account found",
        data: wabaRes.data,
      });
    }

    let whatsappBusinessAccountId = null;
    let whatsappPhoneNumberId = null;

    for (const waba of wabaList) {
      const phoneRes = await axios.get(
        `https://graph.facebook.com/v23.0/${waba.id}/phone_numbers`,
        {
          params: {
            access_token: accessToken,
          },
        },
      );

      const phone = phoneRes.data?.data?.[0];

      if (phone?.id) {
        whatsappBusinessAccountId = waba.id;
        whatsappPhoneNumberId = phone.id;
        break;
      }
    }

    if (!whatsappBusinessAccountId || !whatsappPhoneNumberId) {
      return res.status(400).json({
        success: false,
        message: "No WhatsApp phone number found",
        data: wabaRes.data,
      });
    }

    await User.findByIdAndUpdate(state, {
      whatsappConnected: true,
      whatsappToken: accessToken,
      whatsappPhoneNumberId,
      whatsappBusinessAccountId,
    });

    res.send(`
      <h2>WhatsApp Connected Successfully ✅</h2>
      <p>You can close this tab and return to dashboard.</p>
    `);
  } catch (error) {
    console.log(
      "WhatsApp Callback Error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      message: "WhatsApp connection failed",
      error: error.response?.data || error.message,
    });
  }
};
