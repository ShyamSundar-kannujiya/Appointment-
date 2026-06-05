import { useEffect, useRef, useState } from "react";
import { Copy, Save, CheckCircle } from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const OwnerProfile = () => {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState("");
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [upiId, setUpiId] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const [whatsappConfig, setWhatsappConfig] = useState(null);
  const [signupData, setSignupData] = useState({
    wabaId: "",
    phoneNumberId: "",
  });

  const signupDataRef = useRef({
    wabaId: "",
    phoneNumberId: "",
  });

  const bookingLink = `${window.location.origin}/book/${slug}`;

  useEffect(() => {
    fetchProfile();
    fetchWhatsAppConfig();
  }, []);

  useEffect(() => {
    if (whatsappConfig?.appId) {
      loadFacebookSDK();
    }
  }, [whatsappConfig]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data?.type === "WA_EMBEDDED_SIGNUP" && data.event === "FINISH") {
          const newData = {
            wabaId: data.data?.waba_id || "",
            phoneNumberId: data.data?.phone_number_id || "",
          };

          signupDataRef.current = newData;
          setSignupData(newData);

          console.log("WhatsApp Signup Data:", data.data);
        }
      } catch (error) {
        console.log("WhatsApp message parse error:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      const user = res.data.user;

      setBusinessName(user.businessName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setSlug(user.slug || "");
      setWhatsappConnected(user.whatsappConnected || false);
      setUpiId(user.upiId || "");
      setAdvanceAmount(user.advanceAmount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWhatsAppConfig = async () => {
    try {
      const res = await api.get("/whatsapp/config");
      setWhatsappConfig(res.data);
    } catch (error) {
      console.log("WhatsApp config error:", error);
    }
  };

  const loadFacebookSDK = () => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: whatsappConfig.appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v23.0",
      });
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(script);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      const res = await api.put("/auth/profile", {
        businessName,
        phone,
        upiId,
        advanceAmount,
      });

      alert(res.data.message || "Profile updated successfully");
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingLink);
    alert("Booking link copied");
  };

  const connectWhatsApp = () => {
    if (!window.FB) {
      alert("Facebook SDK not loaded. Please refresh page.");
      return;
    }

    if (!whatsappConfig?.configId) {
      alert("WhatsApp config ID missing");
      return;
    }

    window.FB.login(
      (response) => {
        console.log("FB Login Response:", response);

        const handleFBResponse = async () => {
          try {
            const code = response.authResponse?.code;

            if (!code) {
              alert("WhatsApp connection cancelled");
              return;
            }

            setTimeout(async () => {
              const { wabaId, phoneNumberId } = signupDataRef.current;

              if (!wabaId || !phoneNumberId) {
                alert("WABA ID or Phone Number ID missing. Check console.");
                console.log("Signup Data Missing:", signupDataRef.current);
                console.log("Current signupData state:", signupData);
                return;
              }

              const res = await api.post("/whatsapp/exchange-code", {
                code,
                wabaId,
                phoneNumberId,
              });

              if (res.data.success) {
                alert("WhatsApp connected successfully");
                setWhatsappConnected(true);
                fetchProfile();
              }
            }, 1500);
          } catch (error) {
            console.log("WhatsApp connect error:", error);
            alert(
              error.response?.data?.message || "WhatsApp connection failed",
            );
          }
        };

        handleFBResponse();
      },
      {
        config_id: whatsappConfig.configId,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
        },
      },
    );
  };
  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Owner Profile</h1>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 mb-2">
                  Business Name
                </label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Email</label>
                <input
                  value={email}
                  disabled
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none opacity-70"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">UPI ID</label>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">
                  Advance Amount
                </label>
                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Slug</label>
                <input
                  value={slug}
                  disabled
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none opacity-70"
                />
              </div>
            </div>

            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-2">Booking Link</p>

              <div className="flex gap-3 items-center">
                <p className="text-indigo-400 break-all flex-1">
                  {bookingLink}
                </p>

                <button
                  onClick={copyBookingLink}
                  className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div>
                <h3 className="font-semibold">WhatsApp Business</h3>
                <p className="text-slate-400 text-sm">
                  {whatsappConnected
                    ? "WhatsApp connected successfully"
                    : "Connect WhatsApp to send booking notifications"}
                </p>
              </div>

              {whatsappConnected ? (
                <span className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  Connected
                </span>
              ) : (
                <button
                  onClick={connectWhatsApp}
                  className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl"
                >
                  Connect WhatsApp
                </button>
              )}
            </div>

            <button
              onClick={updateProfile}
              disabled={loading}
              className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
