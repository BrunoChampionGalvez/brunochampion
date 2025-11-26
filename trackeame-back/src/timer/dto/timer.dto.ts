import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class StartTimerDto {
  @IsString()
  @IsNotEmpty()
  habitId: string;
}

export class LogTimeDto {
  @IsString()
  @IsNotEmpty()
  habitId: string;

  @IsNumber()
  @Min(1)
  durationMinutes: number;
}
