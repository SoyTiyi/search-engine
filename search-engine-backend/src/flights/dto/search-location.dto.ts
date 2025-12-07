import { IsString, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchLocationDto {
  @ApiProperty({
    description: 'Keyword to search for (e.g., "Lon" for London)',
    example: 'Lon',
    required: true,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  keyword: string;
}
