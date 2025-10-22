import { Controller, Get, Param, Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

import { GetServiceRequestDto } from './application/queries/dto/get-service-request.dto';
import { GetServiceRequestQuery } from './application/queries/get-service-request.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { DualAuthGuard } from '../../common/guards/dual-auth.guard';
import { HisAuth } from '../../common/decorators/his-auth.decorator';

@ApiTags('HIS Service Request')
@Controller('api/v1/his/service-requests')
@UseGuards(DualAuthGuard)
@ApiBearerAuth()
export class HisServiceRequestController {
  private readonly logger = new Logger(HisServiceRequestController.name);

  constructor(
    private readonly queryBus: QueryBus,
  ) { }

  @Get(':serviceReqCode')
  @HisAuth() // Cho phép sử dụng HIS token
  @ApiOperation({
    summary: 'Get service request by code (supports both JWT and HIS token authentication)',
    description: 'Retrieve service request information from HIS database including patient details and services'
  })
  @ApiParam({
    name: 'serviceReqCode',
    description: 'Service request code',
    example: '000054090874'
  })
  @ApiResponse({
    status: 200,
    description: 'Service request retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        status_code: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            serviceRequest: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
                serviceReqCode: { type: 'string', example: '000054090874' },
                serviceReqSttCode: { type: 'string', example: 'APPROVED' },
                serviceReqTypeCode: { type: 'string', example: 'LAB' },
                instructionTime: { type: 'string', example: '2025-10-15T08:30:00+07:00' },
                instructionDate: { type: 'string', example: '2025-10-15' },
                icdCode: { type: 'string', example: 'Z00.00' },
                icdName: { type: 'string', example: 'General adult medical examination' },
                treatmentCode: { type: 'string', example: 'TREAT001' },
                note: { type: 'string', example: 'Patient requires special attention' },
                requestRoom: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'room-uuid-123' },
                    code: { type: 'string', example: 'R001' },
                    name: { type: 'string', example: 'Room 101' }
                  }
                },
                requestDepartment: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'dept-uuid-123' },
                    code: { type: 'string', example: 'DEPT001' },
                    name: { type: 'string', example: 'Internal Medicine' }
                  }
                },
                executeRoom: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'room-uuid-456' },
                    code: { type: 'string', example: 'R002' },
                    name: { type: 'string', example: 'Lab Room 201' }
                  }
                },
                executeDepartment: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'dept-uuid-456' },
                    code: { type: 'string', example: 'DEPT002' },
                    name: { type: 'string', example: 'Laboratory' }
                  }
                },
                patient: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '789e0123-e89b-12d3-a456-426614174003' },
                    code: { type: 'string', example: 'P001234' },
                    name: { type: 'string', example: 'Nguyen Van A' },
                    dob: { type: 'string', example: '1985-05-15' },
                    cmndNumber: { type: 'string', example: '123456789' },
                    cmndDate: { type: 'string', example: '2020-01-15' },
                    cmndPlace: { type: 'string', example: 'CA HCM' },
                    mobile: { type: 'string', example: '0901234567' },
                    phone: { type: 'string', example: '0281234567' },
                    provinceId: { type: 'string', example: 'province-uuid-123' },
                    provinceCode: { type: 'string', example: '79' },
                    provinceName: { type: 'string', example: 'Ho Chi Minh City' },
                    wardId: { type: 'string', example: 'ward-uuid-123' },
                    communeCode: { type: 'string', example: '26734' },
                    communeName: { type: 'string', example: 'Ward 1' },
                    address: { type: 'string', example: '123 Le Loi, Ho Chi Minh City' },
                    genderName: { type: 'string', example: 'Male' },
                    careerName: { type: 'string', example: 'Engineer' }
                  }
                },
                services: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      hisSereServId: { type: 'string', example: 'abc12345-e89b-12d3-a456-426614174004' },
                      serviceId: { type: 'string', example: 'def67890-e89b-12d3-a456-426614174005' },
                      serviceCode: { type: 'string', example: 'BM00132' },
                      serviceName: { type: 'string', example: 'Điện giải đồ (Na, K, Cl)' },
                      price: { type: 'number', example: 30200 },
                      lisService: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'uuid-lis-service-id' },
                          serviceCode: { type: 'string', example: 'LAB_001' },
                          serviceName: { type: 'string', example: 'Xét nghiệm máu tổng quát' },
                          shortName: { type: 'string', example: 'XN Máu TQ' },
                          currentPrice: { type: 'number', example: 150000 },
                          serviceGroupId: { type: 'string', example: 'uuid-service-group-id' },
                          serviceGroupName: { type: 'string', example: 'Laboratory Services' },
                          unitOfMeasureId: { type: 'string', example: 'uuid-unit-of-measure-id' },
                          unitOfMeasureName: { type: 'string', example: 'Lần' },
                          serviceTests: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', example: 'uuid-service-test-id' },
                                testCode: { type: 'string', example: 'TEST_001' },
                                testName: { type: 'string', example: 'Xét nghiệm đường huyết' },
                                shortName: { type: 'string', example: 'XN Đường huyết' },
                                unitOfMeasureId: { type: 'string', example: 'uuid-unit-of-measure-id' },
                                unitOfMeasureName: { type: 'string', example: 'mg/dL' },
                                rangeText: { type: 'string', example: 'Bình thường: 70-100 mg/dL' },
                                rangeLow: { type: 'number', example: 70 },
                                rangeHigh: { type: 'number', example: 100 },
                                mapping: { type: 'string', example: '{"hisCode": "GLUCOSE"}' },
                                testOrder: { type: 'number', example: 1 },
                                isActiveFlag: { type: 'number', example: 1 }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', example: '2025-10-15T10:30:00.000Z' },
            totalServices: { type: 'number', example: 2 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Service request not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        status_code: { type: 'number', example: 404 },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'SERVICE_REQUEST_NOT_FOUND' },
            message: { type: 'string', example: 'Service request not found' },
            name: { type: 'string', example: 'AppError' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getServiceRequest(@Param() params: GetServiceRequestDto) {
    this.logger.log(`Getting service request for code: ${params.serviceReqCode}`);

    const result = await this.queryBus.execute(new GetServiceRequestQuery(params));

    return ResponseBuilder.success(result, HTTP_STATUS.OK);
  }
}
