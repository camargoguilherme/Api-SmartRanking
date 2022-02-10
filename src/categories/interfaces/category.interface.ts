import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Category extends Document {
  readonly _id: string;
  readonly category: string;
  description: string;
  events: Array<Event>;
  players: Array<Player>;
}

export interface Event {
  readonly _id: string;
  name: string;
  operation: string;
  value: number;
}
