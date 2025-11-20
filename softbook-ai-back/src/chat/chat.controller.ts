import { Controller, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatQueryDto } from './dto/chat-query.dto';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('query')
    async query(@Body() chatQueryDto: ChatQueryDto, @Res() res: Response): Promise<void> {
        try {
            const stream = this.chatService.processQuery(chatQueryDto);

            res.setHeader('Content-Type', 'text/plain');

            for await (const chunk of stream) {
                res.write(chunk);
            }

            res.end();
        } catch (error) {
            console.error('Error in chat stream:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to process chat query' });
            } else {
                res.end();
            }
        }
    }
}
