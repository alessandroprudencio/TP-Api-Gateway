import { Document } from 'mongoose';
import { ICategory } from 'src/categories/interfaces/category.interface';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { IChallengeStatus } from './challenge-status.enum.interface';

export interface IChallenge extends Document {
  requester: string;
  dateTimeChallenge: Date;
  dateTimeResponse: Date;
  message: string;
  status: IChallengeStatus;
  category: ICategory;
  players: Array<IPlayer>;
  match: IMatch;
}

export interface IMatch extends Document {
  category: string;
  players: Array<IPlayer>;
  win: IPlayer;
  result: Array<IResult>;
}

export interface IResult {
  set: string;
}
