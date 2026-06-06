const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const redis = require("../config/redis");
const { shortenLimiter } = require("../middleware/rateLimiter");

// Helper: validate URL
const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// POST /api/shorten
router.post("/", shortenLimiter, async (req, res) => {
  const { originalUrl, customAlias, expiresIn } = req.body;

  if (!originalUrl || !isValidUrl(originalUrl)) {
    return res.status(400).json({ error: "Invalid or missing URL." });
  }

  try {
    // Check if custom alias is taken
    const shortCode = customAlias?.trim() || nanoid(6);

    if (customAlias) {
      const existing = await Url.findOne({ shortCode: customAlias.trim() });
      if (existing) {
        return res.status(409).json({ error: "Custom alias already taken." });
      }
    }

    // Calculate expiry if provided (in hours)
    let expiresAt = null;
    if (expiresIn && Number(expiresIn) > 0) {
      expiresAt = new Date(Date.now() + Number(expiresIn) * 60 * 60 * 1000);
    }

    const urlDoc = await Url.create({
      shortCode,
      originalUrl,
      customAlias: customAlias?.trim() || null,
      expiresAt,
    });

    // Cache in Redis (24 hours default)
    const ttl = expiresIn ? Number(expiresIn) * 3600 : 86400;
    await redis.setex(`url:${shortCode}`, ttl, originalUrl).catch(() => {});

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    return res.status(201).json({
      shortUrl,
      shortCode,
      originalUrl,
      expiresAt,
      createdAt: urlDoc.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// GET /api/shorten/:code/stats
router.get("/:code/stats", async (req, res) => {
  const { code } = req.params;
  try {
    const urlDoc = await Url.findOne({ shortCode: code });
    if (!urlDoc) return res.status(404).json({ error: "Short URL not found." });

    const Click = require("../models/Click");

    // Clicks grouped by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const clicksByDay = await Click.aggregate([
      { $match: { shortCode: code, timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      shortCode: code,
      originalUrl: urlDoc.originalUrl,
      totalClicks: urlDoc.clicks,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt,
      clicksByDay,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
