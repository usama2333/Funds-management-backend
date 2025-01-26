import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('password-resets')
export class PasswordReset {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    token: string

    @CreateDateColumn()
    createAt: Date

    @Column()
    expiresAt: Date
}
