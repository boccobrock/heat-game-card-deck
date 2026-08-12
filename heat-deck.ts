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
  drawPile.container.addEventListener("touchend", () => {
    drawPile.topCardElement.flip();
    deal(1, drawPile, playerHand, 100);
  });

  // player hand
  playerHand.applyCascadeLayout("cascade");
  playerHand.options.groupDrag = false;

  // play pile
  playPile.applyCascadeLayout("cascade");
  playPile.options.groupDrag = true;

  // heat pile
  heatPile.applyCascadeLayout("cascade");
  heatPile.container.addEventListener("touchend", () => {
    deal(1, heatPile, discardPile, 100);
  });
  heatPile.options.groupDrag = false;

  // discard pile
  discardPile.container.addEventListener("touchend", (e) => {
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