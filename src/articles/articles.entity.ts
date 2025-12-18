import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({schema: 'schema', name: 'article'})
export class Article {
    @PrimaryGeneratedColumn()
    article_id: number

    @Column({type: "integer"})
    user_id: number

    @Column({length: 255, type: 'varchar'}) 
    article_title: string

    @Column({type: 'text'})
    article_desc: string

    @Column({type: 'date'})
    date: Date

}