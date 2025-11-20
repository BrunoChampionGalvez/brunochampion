import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { Technology } from './entities/technology.entity';

@Controller('technologies')
export class TechnologiesController {
    private readonly logger = new Logger(TechnologiesController.name);
    constructor(private readonly technologiesService: TechnologiesService) { }

    @Post()
    async create(@Body() createTechnologyDto: CreateTechnologyDto): Promise<Technology> {
        this.logger.debug('Create technoloy controller')
        return await this.technologiesService.create(createTechnologyDto);
    }

    @Get()
    async findAll(): Promise<Technology[]> {
        return this.technologiesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Technology> {
        const technology = await this.technologiesService.findOne(id);
        if (!technology) {
            throw new NotFoundException(`Technology with ID ${id} not found`);
        }
        return technology;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return this.technologiesService.remove(id);
    }

    @Post(':id/scrape')
    @HttpCode(HttpStatus.ACCEPTED)
    async startScraping(@Param('id') id: string): Promise<{ message: string }> {
        await this.technologiesService.startScraping(id);
        return { message: 'Web scraping initiated' };
    }

    @Post(':id/index')
    @HttpCode(HttpStatus.ACCEPTED)
    async indexContent(@Param('id') id: string): Promise<{ message: string }> {
        await this.technologiesService.processAndIndexContent(id);
        return { message: 'Content indexing initiated' };
    }
}
