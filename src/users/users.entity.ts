import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({schema: "schema", name: "users"})
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({length: 255, unique: true, type: 'varchar'})
    user_login: string;

    @Column({length: 255, type: 'varchar'})
    user_pass: string;
}

