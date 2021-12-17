import { Document } from 'mongoose';
import { ICategory } from 'src/categories/interfaces/category.interface';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { IChallengeStatus } from './challenge-status.enum.interface';
import { IMatch } from './match.interface';

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
