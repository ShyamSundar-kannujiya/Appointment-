import axios from "axios";

export const sendWhatsAppMessage = async (
  token,
  phoneNumberId,
  customerPhone,
  message,
) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: customerPhone,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("WhatsApp Sent:", response.data);
  } catch (error) {
    console.log("WhatsApp Error:", error.response?.data || error.message);
  }
};
