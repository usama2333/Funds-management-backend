import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateUserDto {
    
    @IsNotEmpty({message: 'Name is required'})
    @IsString()
    name: string

    @IsEmail({},{message: 'Invalid email format'})
    email: string

    @MinLength(6,{message: 'Password must be alteast 6 caharacters long' })
    password: string
}