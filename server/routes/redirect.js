const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const Click = require("../models/Click");
const redis = require("../config/redis");
const { redirectLimiter } = require("../middleware/rateLimiter");

// GET /:code — redirect to original URL
router.get("/:code", redirectLimiter, async (req, res) => {
  const { code } = req.params;

  try {
    // 1. Check Redis cache first
    let originalUrl = null;
    try {
      originalUrl = await redis.get(`url:${code}`);
    } catch {}

    if (!originalUrl) {
      // 2. Fallback to MongoDB
      const urlDoc = await Url.findOne({ shortCode: code });
      if (!urlDoc) {
        return res.status(404).json({ error: "Short URL not found." });
      }

      // Check expiry
      if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
        return res.status(410).json({ error: "This link has expired." });
      }

      originalUrl = urlDoc.originalUrl;

      // Re-cache it
      await redis.setex(`url:${code}`, 86400, originalUrl).catch(() => {});
    }

    // 3. Log the click (non-blocking)
    Click.create({
      shortCode: code,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
      referrer: req.headers["referer"] || "",
    }).catch(() => {});

    // Increment click counter (non-blocking)
    Url.updateOne({ shortCode: code }, { $inc: { clicks: 1 } }).catch(() => {});

    return res.redirect(originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
