import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  @ApiProperty({ description: 'Error details (if any)' })
  error?: any;

  @ApiProperty({ description: 'Timestamp' })
  timestamp: string;

  constructor(data?: T, message = 'Success', success = true) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @ApiProperty({ description: 'Pagination metadata' })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  constructor(
    data: T[],
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    },
    message = 'Success',
  ) {
    super(data, message);
    this.meta = meta;
  }
}
