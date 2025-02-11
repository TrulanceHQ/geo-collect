import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SubmitDataEntryDto {
  @ApiProperty({ description: 'The form ID associated with the data entry' })
  @IsString()
  formId: string;

  @ApiProperty({ description: 'List of answers for the data entry' })
  @IsArray()
  answers: string[];
}
