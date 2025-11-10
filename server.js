// Load deps (CommonJS style)
const express = require("express");     // tiny web server
const fs = require("fs");               // read data.xml
const path = require("path");           // safe path joins
const morgan = require("morgan");       // request logs

// Configuration
const PORT = process.env.PORT || 3000;  // 3000 locally, Render sets PORT
const XML_PATH = path.join(__dirname, "data.xml"); // your file on disk

// App init
const app = express();

// Logs
app.use(morgan("tiny"));

// CORS for public reads (so any site/app can fetch your XML)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Health/info
app.get("/", (_req, res) => {
  res.type("text/plain").send("Public XML: GET /data.xml");
});

// Serve XML (manual edits: you update data.xml; server just serves it)
app.get("/data.xml", (_req, res) => {
  try {
    const xml = fs.readFileSync(XML_PATH, "utf8"); // read file each request
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (e) {
    // If data.xml missing, return a minimal valid XML so clients don’t break
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><root/>`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Public XML server listening on http://localhost:${PORT}`);
});
