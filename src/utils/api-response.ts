import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse {
  @ApiProperty({
    example: 200,
  })
  status: number;

  @ApiProperty()
  data: any;

  @ApiProperty({
    example: 'Success',
  })
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  stackTrace: string;

  constructor(
    status = 200,
    data = {},
    message = 'Success',
    error = '',
    stackTrace = '',
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
    this.stackTrace = stackTrace;
  }
}