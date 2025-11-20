import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemanticSearchResults } from './entities/semantic-search-results.entity';
import { Technology } from 'src/technologies/entities/technology.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SemanticSearchResults, Technology])],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule { }
