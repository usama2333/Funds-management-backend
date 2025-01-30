import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "src/common/enums/roles.enum";


export class CreateAdminDto {
    
    @IsNotEmpty({message: 'Name is required'})
    @IsString()
    name: string

    @IsEmail({},{message: 'Invalid email format'})
    email: string

    @MinLength(6,{message: 'Password must be alteast 6 caharacters long' })
    password: string

    @IsEnum(UserRole, { message: 'Role must be either "user", "admin", or "superadmin"' })
    role: UserRole;

}