import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CrawledResults } from './crawled-results.entity';

@Entity('technologies')
export class Technology {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    name!: string;

    @Column('text')
    documentationUrl!: string;

    @OneToMany(() => CrawledResults, (crawledResults) => crawledResults.technology)
    crawledResults!: CrawledResults[];

    @Column({ default: false })
    isIndexed!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
