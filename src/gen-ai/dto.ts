import { ApiProperty } from '@nestjs/swagger';

export class TransportationDTO {
  @ApiProperty()
  from: string;
  @ApiProperty()
  to: string;
  @ApiProperty()
  distance: number;
}
