import axios from "axios";
import User from "../models/User.js";

/* ==========================
   GET WHATSAPP CONFIG
========================== */
export const getWhatsAppConfig = async (req, res) => {
  res.json({
    success: true,
    appId: process.env.FACEBOOK_APP_ID,
    configId: process.env.WHATSAPP_CONFIG_ID,
  });
};

/* ==========================
   EXCHANGE EMBEDDED SIGNUP CODE
========================== */
export const exchangeWhatsAppCode = async (req, res) => {
  try {
    const { code, wabaId, phoneNumberId } = req.body;

    if (!code || !wabaId || !phoneNumberId) {
      return res.status(400).json({
        success: false,
        message: "code, wabaId and phoneNumberId are required",
      });
    }

    const tokenRes = await axios.get(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          code,
        },
      },
    );

    const accessToken = tokenRes.data.access_token;

    await User.findByIdAndUpdate(req.user._id, {
      whatsappConnected: true,
      whatsappToken: accessToken,
      whatsappBusinessAccountId: wabaId,
      whatsappPhoneNumberId: phoneNumberId,
    });

    res.json({
      success: true,
      message: "WhatsApp connected successfully",
    });
  } catch (error) {
    console.log(
      "WhatsApp Exchange Error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      message: "WhatsApp connection failed",
      error: error.response?.data || error.message,
    });
  }
};

/* ==========================
   DISCONNECT WHATSAPP
========================== */     
export const disconnectWhatsApp = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {    
      whatsappConnected: false,
      whatsappToken: null,
      whatsappBusinessAccountId: null,
      whatsappPhoneNumberId: null,
    });

    res.json({
      success: true,
      message: "WhatsApp disconnected successfully",
    });
  } catch (error) {
    console.log(
      "WhatsApp Disconnect Error:",
      error.response?.data || error.message,
    );  

    res.status(500).json({
      success: false,
      message: "WhatsApp disconnection failed",
      error: error.response?.data || error.message,
    });
  }
};



