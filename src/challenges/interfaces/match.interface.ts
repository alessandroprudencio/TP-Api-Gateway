import { IPlayer } from 'src/players/interfaces/player.interface';
import { IChallenge } from './challenge.interface';
import { IResult } from './result.interface';

export interface IMatch extends Document {
  category: string;
  players: Array<IPlayer>;
  challenge: IChallenge;
  win: IPlayer;
  result: Array<IResult>;
}
