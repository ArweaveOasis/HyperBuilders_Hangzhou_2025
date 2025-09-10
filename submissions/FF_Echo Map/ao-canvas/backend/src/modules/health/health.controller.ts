import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck(): Promise<ApiResponseDto<{ status: string; timestamp: string }>> {
    return new ApiResponseDto(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
      'Service is healthy'
    );
  }
}
