import { IsObject, IsOptional } from 'class-validator';
import { ICategory } from 'src/categories/interfaces/category.interface';

export class UpdatePlayerDto {
  // @IsOptional()
  // @IsMobilePhone('pt-BR')
  // phoneNumber: string;

  // @IsString()
  // @IsOptional()
  // name: string;

  @IsObject()
  @IsOptional()
  avatar: string;

  @IsOptional()
  category: ICategory;
}
