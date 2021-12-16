import { Document } from 'mongoose';
import { ICategory } from 'src/categories/interfaces/category.interface';

export interface IPlayer extends Document {
  readonly _id: string;
  phoneNumber: string;
  readonly email: string;
  name: string;
  ranking: string;
  positionRanking: number;
  avatar: string;
  category: ICategory;
}
