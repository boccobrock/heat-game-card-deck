import { CardElement } from "card-factory";
import HeatCard from "./heat-card";
import "./styles.css";

const HeatCardElement = (card: HeatCard) => {
  // pull info out of HeatCard
  const type = card.type;

  // create the element for the front div
  const frontDiv = () => {
    const card = document.createElement("div");
    card.classList.add("heat-card-front");
    const span = document.createElement("span");
    span.textContent = type;
    if (type == '+') {
        card.classList.add("heat-card-plus");
    }
    if (type == 'H') {
        card.classList.add("heat-card-heat");
    }
    card.appendChild(span);
    return card;
  };

  // create the element for the backDiv
  const backDiv = () => {
    const card = document.createElement("div");
    const questionSpan = document.createElement("span");
    questionSpan.classList.add("heat-card-back");
    card.appendChild(questionSpan);
    return card;
  };

  // return a new CardElement, extended by HeatCard with our new divs
  return CardElement<HeatCard>(card, frontDiv(), backDiv());
};

export default HeatCardElement;