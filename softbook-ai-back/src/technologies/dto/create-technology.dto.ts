import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateTechnologyDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsUrl()
    documentationUrl!: string;
}
