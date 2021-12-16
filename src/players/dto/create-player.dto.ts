import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ICategory } from 'src/categories/interfaces/category.interface';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsMobilePhone('pt-BR')
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsOptional()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([a-zA-Z\d]{8,})$/, {
    message: 'A senha deve conter 8 caracteres entre números, letras maiúsculas e  letras minúsculas',
  })
  password: string;

  @IsNotEmpty()
  category: ICategory;

  @IsString()
  @IsOptional()
  cognitoId: string;
}
