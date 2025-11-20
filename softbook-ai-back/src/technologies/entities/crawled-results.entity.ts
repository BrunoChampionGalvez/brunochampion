import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Technology } from "./technology.entity";

@Entity('crawled_results')
export class CrawledResults {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    content!: string;

    @Column({ nullable: true })
    url!: string;

    @Column()
    technologyId!: string;

    @ManyToOne(() => Technology, (technology) => technology.crawledResults)
    technology!: Technology;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}