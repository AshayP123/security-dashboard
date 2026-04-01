import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 3000;

// 🔐 PUT YOUR API KEY HERE (SAFE ON BACKEND)
const API_KEY = "4ff0def6c8f4d79f65202e72cd31cdb21bd35f3ba81a6ba826fbc5d8c353523b2bff14b8a16488c6";

app.get("/check-ip", async (req, res) => {
  try {
    const ip = req.query.ip;

    if (!ip) {
      return res.status(400).json({ error: "IP required" });
    }

    const response = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`,
      {
        method: "GET",
        headers: {
          Key: API_KEY,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});