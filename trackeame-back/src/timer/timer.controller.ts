import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TimerService } from './timer.service';
import { StartTimerDto, LogTimeDto } from './dto/timer.dto';
import { SessionGuard } from '../auth/session.guard';

@Controller('timer')
@UseGuards(SessionGuard)
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post('start')
  startTimer(@Request() req, @Body() startTimerDto: StartTimerDto) {
    return this.timerService.startTimer(req.user.id, startTimerDto.habitId);
  }

  @Post('log')
  logTime(@Request() req, @Body() logTimeDto: LogTimeDto) {
    return this.timerService.logTime(
      req.user.id,
      logTimeDto.habitId,
      logTimeDto.durationMinutes,
    );
  }

  @Post('stop/:id')
  stopTimer(@Request() req, @Param('id') timeEntryId: string) {
    return this.timerService.stopTimer(req.user.id, timeEntryId);
  }

  @Delete('cancel/:id')
  cancelTimer(@Request() req, @Param('id') timeEntryId: string) {
    return this.timerService.cancelTimer(req.user.id, timeEntryId);
  }

  @Get('active')
  getActiveTimer(@Request() req, @Query('habitId') habitId?: string) {
    return this.timerService.getActiveTimer(req.user.id, habitId);
  }

  @Get('entries')
  getTimeEntries(@Request() req, @Query('habitId') habitId?: string) {
    return this.timerService.getTimeEntries(req.user.id, habitId);
  }
}
