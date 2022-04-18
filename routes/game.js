const express = require("express");
const {
  test,
  setGameCards,
  getPlayerView,
  getCardMainDeckPlayer,
  getCardDiscardDeckPlayer,
  releaseCard,
} = require("../controllers/game");
const { authMiddleware } = require("../middleware/session");
const router = express.Router();

/**
 * xxx
 */
router.get("/test", test);

/**
 * xxx
 */
router.get("/set", setGameCards);

/**
 * xxx
 */
router.get("/player", getPlayerView);

/**
 * xxx
 */
router.get("/pmd", getCardMainDeckPlayer);

/**
 * xxx
 */
router.get("/pdd", getCardDiscardDeckPlayer);

/**
 * xxx
 */
router.post("/release", releaseCard);

module.exports = router;
