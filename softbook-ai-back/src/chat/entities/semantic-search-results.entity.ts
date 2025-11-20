import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SemanticSearchResults {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @Column()
    url!: string;

    @Column()
    technologyId!: string;
}