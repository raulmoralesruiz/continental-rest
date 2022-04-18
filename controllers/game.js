const { gamesModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

// Se define el mazo de cartas principal
let mainDeck = [];
// Se define el mazo de cartas de descartes
let discardDeck = [];
// Se define un array con los palos de la baraja
const SUITS = ["♠", "♥", "♦", "♣"];
// Se define un array con el número de cartas de la baraja
const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
// Se define el número de comodines
const JOKERS = 3;
// Se define el número de barajas
const NUM_DECKS = 2;
let rounds = ["TT", "TE", "EE", "TTT", "TTE", "TEE", "EEE"];
let actualRound = "";

let playerCards = [];
let computerCards = [];

let cardObtainedMainDeck = false;
let cardObtainedDiscardDeck = false;

shuffleDeck = () => {
  mainDeck = [];
  discardDeck = [];

  try {
    for (let i = 0; i < NUM_DECKS; i++) {
      // Se insertan las cartas de cada palo en el mazo
      for (let s = 0; s < SUITS.length; s++) {
        for (let r = 0; r < RANKS.length; r++) {
          mainDeck.push(RANKS[r] + SUITS[s]);
        }
      }

      // Se insertan los comodines en el mazo
      for (let i = 0; i < JOKERS; i++) {
        mainDeck.push("JOKER");
      }
    }

    // Se baraja el mazo con el algoritmo Fisher-Yates
    for (let i = mainDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mainDeck[i], mainDeck[j]] = [mainDeck[j], mainDeck[i]];
    }

    const discardCard = getCardFromMainDeck();
    discardDeck.push(discardCard);
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_DECK");
  }
};

const test = async (req, res) => {
  let firstElement = rounds.shift();
  let lastElement = rounds.pop();
  res.send({ firstElement, lastElement });
};

const setGameCards = (req, res) => {
  try {
    if (rounds.length === 0) {
      handleHttpError(res, "ERROR_ROUNDS_EMPTY");
      return false;
    }
    actualRound = rounds.shift();
    let cardsPerPlayer = 0;

    // createDeck();
    shuffleDeck();
    playerCards = [];
    computerCards = [];

    if (actualRound === "TT") cardsPerPlayer = 7;
    if (actualRound === "TE") cardsPerPlayer = 8;
    if (actualRound === "EE") cardsPerPlayer = 9;
    if (actualRound === "TTT") cardsPerPlayer = 10;
    if (actualRound === "TTE") cardsPerPlayer = 11;
    if (actualRound === "TEE") cardsPerPlayer = 12;
    if (actualRound === "EEE") cardsPerPlayer = 13;

    for (let i = 0; i < cardsPerPlayer; i++) {
      playerCards.push(mainDeck.shift());
      computerCards.push(mainDeck.shift());
    }

    res.send({
      playerCards,
      player: playerCards.length,
      computerCards,
      computer: computerCards.length,
      actualRound,
      discardDeck,
      discardDeckLength: discardDeck.length,
      mainDeckLength: mainDeck.length,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_SET_CARDS");
  }
};

getCardFromMainDeck = () => {
  try {
    return (card = mainDeck.pop());
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CARD_FROM_MAIN_DECK");
  }
};

getCardFromDiscardDeck = () => {
  try {
    return (card = discardDeck.pop());
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CARD_FROM_DISCARD_DECK");
  }
};

const getCardMainDeckPlayer = async (req, res) => {
  try {
    if (cardObtainedMainDeck) {
      handleHttpError(res, "ERROR_CARD_ALREADY_OBTAINED_MAIN_DECK");
      return false;
    }

    const card = getCardFromMainDeck();
    playerCards.push(card);
    cardObtainedMainDeck = true;

    res.send({
      card,
      playerCards,
      player: playerCards.length,
      actualRound,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CARD_FROM_MAIN_DECK_FOR_PLAYER");
  }
};

const getCardDiscardDeckPlayer = async (req, res) => {
  try {
    if (cardObtainedDiscardDeck) {
      handleHttpError(res, "ERROR_CARD_ALREADY_OBTAINED_DISCARD_DECK");
      return false;
    }

    const card = getCardFromDiscardDeck();
    playerCards.push(card);
    cardObtainedDiscardDeck = true;

    res.send({
      card,
      playerCards,
      player: playerCards.length,
      actualRound,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_CARD_FROM_DISCARD_DECK_FOR_PLAYER");
  }
};

const getPlayerView = async (req, res) => {
  try {
    const lastDiscarCard = discardDeck[discardDeck.length - 1];

    res.send({
      playerCards,
      player: playerCards.length,
      actualRound,
      discardDeck: lastDiscarCard,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_PLAYER_VIEW");
  }
};

const releaseCard = async (req, res) => {
  try {
    const card = req.body.card;
    const index = playerCards.indexOf(card);
    if (index === -1) {
      handleHttpError(res, "ERROR_CARD_NOT_FOUND");
      return false;
    }
    playerCards.splice(index, 1);

    res.send({
      playerCards,
      player: playerCards.length,
      actualRound,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_RELEASE_CARD");
  }
};

module.exports = {
  test,
  setGameCards,
  getPlayerView,
  getCardMainDeckPlayer,
  getCardDiscardDeckPlayer,
  releaseCard,
};
