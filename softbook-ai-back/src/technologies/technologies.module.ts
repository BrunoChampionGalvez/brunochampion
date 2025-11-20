import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';
import { Technology } from './entities/technology.entity';
import { CrawledResults } from './entities/crawled-results.entity';
import { SemanticSearchResults } from '../chat/entities/semantic-search-results.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Technology, CrawledResults, SemanticSearchResults])],
    controllers: [TechnologiesController],
    providers: [TechnologiesService],
    exports: [TechnologiesService],
})
export class TechnologiesModule { }
