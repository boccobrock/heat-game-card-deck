import { Card } from "card-factory";

export default class HeatCard extends Card {
  type: string;
  constructor(type: string) {
    super();
    this.type = type;
  }
}