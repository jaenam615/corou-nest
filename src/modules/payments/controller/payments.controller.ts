import { Controller, Get, Param } from '@nestjs/common';
import { PortoneService } from '../service/portone.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private portoneService: PortoneService) {}

  @Get('/:imp_uid')
  @ApiOperation({
    summary: '결제 조회',
    description: '아임포트 imp_uid를 이용하여 결제 정보를 조회합니다.',
  })
  async getPayment(@Param('imp_uid') imp_uid: string) {
    try {
      const payment = await this.portoneService.getPayment(imp_uid);
      return {
        success: true,
        message: '결제 조회에 성공했습니다.',
        data: payment,
      };
    } catch (error) {
      console.error('Error in getPayment controllers:', error);
      return {
        success: false,
        message: '결제 조회에 실패했습니다.',
      };
    }
  }
}
