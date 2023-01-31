import { IsInt } from 'class-validator';

export class CreateMatchDTO {
  @IsInt()
  user1: number;
  @IsInt()
  user2: number;
}
