import { setTheme, tanTiles, Deck, deal } from "card-factory";
import HeatCard from "./heat-card";
import HeatCardElement from "./heat-card-element";
import "./styles.css";

const body = document.querySelector("body");
if (body) {
  setTheme(tanTiles, body);
}

const heatcards = [
  {
    type: "1"
  },
  {
    type: "1"
  },
  {
    type: "1"
  },
  {
    type: "2"
  },
  {
    type: "2"
  },
  {
    type: "2"
  },
  {
    type: "3"
  },
  {
    type: "3"
  },
  {
    type: "3"
  },
  {
    type: "4"
  },
  {
    type: "4"
  },
  {
    type: "4"
  },
  {
    type: "H"
  },
  {
    type: "4+"
  },
  {
    type: "1 | 5"
  },
  {
    type: "+"
  },
  {
    type: "+"
  },
  {
    type: "+"
  },
  {
    type: "H"
  },
  {
    type: "H"
  },
  {
    type: "H"
  },
  {
    type: "H"
  },
  {
    type: "H"
  },
  {
    type: "H"
  },
];

const cardClasses = heatcards.map((heatCard) => {
  return new HeatCard(heatCard.type);
});

const deck = new Deck(cardClasses, HeatCardElement);
const heatPile = deck.createPileElement("heatPile");
const discardPile = deck.createPileElement("discardPile");
const drawPile = deck.createPileElement("drawPile", deck.cards); // initiate all cards here
const playerHand = deck.createPileElement("hand"); // will begin with no cards
const playPile = deck.createPileElement("play"); // will begin with no cards

const heatDiv = document.getElementById("heatPile");
heatDiv?.appendChild(heatPile.container);

const discardDiv = document.getElementById("discardPile");
discardDiv?.appendChild(discardPile.container);

const drawDiv = document.getElementById("drawPile");
drawDiv?.appendChild(drawPile.container);

const handDiv = document.getElementById("hand");
handDiv?.appendChild(playerHand.container);

const playDiv = document.getElementById("play");
playDiv?.appendChild(playPile.container);

window.addEventListener("DOMContentLoaded", async () => {
  // Add button functionality after DOM is loaded
  const drawButton = document.getElementById("drawButton");
  drawButton?.addEventListener("click", () => {
    // Calculate how many cards are needed to reach 7
    const currentHandSize = playerHand.cardElements.length;
    const cardsNeeded = Math.max(0, 7 - currentHandSize);

    if (cardsNeeded > 0) {
      deal(cardsNeeded, drawPile, playerHand, 100).then(() => {
        // Flip the newly drawn cards
        playerHand.cardElements.slice(-cardsNeeded).forEach(card => {
          card.flip();
        });
      });
    }
  });

  const playCardsButton = document.getElementById("playCardsButton");
  playCardsButton?.addEventListener("click", () => {
    // Check for '+' cards in the play pile
    const plusCards = playPile.cardElements.filter(card => card.card.type === '+');

    if (plusCards.length > 0) {
      // For each '+' card, draw a card from the deck
      let drawCount = plusCards.length;

      // Process each '+' card one at a time
      const processPlusCard = () => {
        if (drawCount <= 0 || drawPile.cardElements.length === 0) {
          // Move all cards from play pile to discard pile
          if (playPile.cardElements.length > 0) {
            deal(playPile.cardElements.length, playPile, discardPile, 100);
          }
          return;
        }

        // Draw one card from the deck
        deal(1, drawPile, playerHand, 100).then(() => {
          const drawnCard = playerHand.cardElements[playerHand.cardElements.length - 1];

          // Flip the drawn card
          if (drawnCard) {
            drawnCard.flip();

            // Wait 1 second before processing next card
            setTimeout(() => {
              // Check if drawn card is a number (1-4)
              if (drawnCard && ['1', '2', '3', '4'].includes(drawnCard.card.type)) {
                // Put it in the play pile
                deal(1, playerHand, playPile, 100);
              } else {
                // Put it in the discard pile
                deal(1, playerHand, discardPile, 100);
              }

              drawCount--;
              // Process next '+' card
              processPlusCard();
            }, 1000);
          } else {
            drawCount--;
            processPlusCard();
          }
        });
      };

      processPlusCard();
    } else {
      // If no '+' cards, just move all cards from play pile to discard pile
      if (playPile.cardElements.length > 0) {
        deal(playPile.cardElements.length, playPile, discardPile, 100);
      }
    }
  });

  // setup
  deal(6, drawPile, heatPile, 100).then(() => {
    heatPile.cardElements.forEach((card) => {
        card.flip();
    })
    drawPile.shuffle();
    drawPile.cascade();

    deal(7, drawPile, playerHand, 100).then(() => {
      playerHand.cardElements.forEach((card) => {
          card.flip();
      })
    });
  });

  // draw pile
  drawPile.container.addEventListener("click", () => {
    if (playerHand.cardElements.length < 7) {
      drawPile.topCardElement.flip();
      deal(1, drawPile, playerHand, 100);
    }
  });

  // player hand
  playerHand.applyCascadeLayout("cascade");
  playerHand.options.groupDrag = false;

  // play pile
  playPile.applyCascadeLayout("cascade");
  playPile.options.groupDrag = true;

  // heat pile
  heatPile.applyCascadeLayout("cascade");
  heatDiv?.addEventListener("click", () => {
    deal(1, heatPile, discardPile, 100);
  });
  heatPile.options.groupDrag = false;

  // discard pile
  discardPile.container.addEventListener("click", (e) => {
    discardPile.cardElements.forEach((card) => {
      if (card.faceUp) {
        card.flip();
      }
    })
    deal(100, discardPile, drawPile, 100).then(() => {
        drawPile.shuffle();
        drawPile.cascade();
    });
  });
});
