import { IsEmail, Matches } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([a-zA-Z\d]{8,})$/, {
    message: 'A senha deve conter 8 caracteres entre números, letras maiúsculas e  letras minúsculas',
  })
  password: string;
}
