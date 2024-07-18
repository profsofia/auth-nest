import { IsEmail, IsString, MinLength } from "class-validator";


//propiedades que deben ser "verificadas" antes de enviarlas al Backs
export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
}
