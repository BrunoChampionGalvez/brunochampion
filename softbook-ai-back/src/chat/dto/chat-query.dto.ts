import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class ChatQueryDto {
    @IsNotEmpty()
    @IsString()
    query!: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    technologyIds?: string[]; // If empty, use all technologies

    @IsArray()
    @IsOptional()
    conversationHistory?: Array<{ role: string; content: string }>;
}
