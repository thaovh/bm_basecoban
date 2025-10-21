import { Controller, Get, Post, Put, Delete, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateServiceTestDto } from './application/commands/dto/create-service-test.dto';
import { UpdateServiceTestDto } from './application/commands/dto/update-service-test.dto';
import { GetServiceTestsDto } from './application/queries/dto/get-service-tests.dto';
import { CreateServiceTestCommand } from './application/commands/create-service-test.command';
import { UpdateServiceTestCommand } from './application/commands/update-service-test.command';
import { DeleteServiceTestCommand } from './application/commands/delete-service-test.command';
import { GetServiceTestsQuery } from './application/queries/get-service-tests.query';
import { GetServiceTestByIdQuery } from './application/queries/get-service-test-by-id.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Service Test')
@Controller('api/v1/service-tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServiceTestController {
    private readonly logger = new Logger(ServiceTestController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new service test',
        description: 'Create a new service test with the provided information'
    })
    @ApiResponse({
        status: 201,
        description: 'Service test created successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                status_code: { type: 'number', example: 201 },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid-service-test-id' },
                        testCode: { type: 'string', example: 'TEST_001' },
                        testName: { type: 'string', example: 'Xét nghiệm máu tổng quát' },
                        shortName: { type: 'string', example: 'XN Máu TQ' },
                        serviceId: { type: 'string', example: 'uuid-service-id' },
                        serviceName: { type: 'string', example: 'Dien giai do (Na, K, Cl)' },
                        serviceCode: { type: 'string', example: 'LAB_001' },
                        unitOfMeasureId: { type: 'string', example: 'uuid-unit-of-measure-id' },
                        unitOfMeasureName: { type: 'string', example: 'Lan' },
                        rangeText: { type: 'string', example: 'Bình thường: 3.5-5.5 g/dL' },
                        rangeLow: { type: 'number', example: 3.5 },
                        rangeHigh: { type: 'number', example: 5.5 },
                        mapping: { type: 'string', example: '{"hisCode": "TEST001"}' },
                        testOrder: { type: 'number', example: 1 },
                        isActiveFlag: { type: 'number', example: 1 }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Service test code already exists' })
    async createServiceTest(@Body() createServiceTestDto: CreateServiceTestDto) {
        this.logger.log(`Creating service test with code: ${createServiceTestDto.testCode}`);
        const result = await this.commandBus.execute(new CreateServiceTestCommand(createServiceTestDto));
        return ResponseBuilder.success(result, HTTP_STATUS.CREATED);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all service tests',
        description: 'Retrieve a list of service tests with pagination and filtering options'
    })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to return' })
    @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of records to skip' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by test name' })
    @ApiQuery({ name: 'serviceId', required: false, type: String, description: 'Filter by service ID' })
    @ApiQuery({ name: 'unitOfMeasureId', required: false, type: String, description: 'Filter by unit of measure ID' })
    @ApiQuery({ name: 'isActiveFlag', required: false, type: Number, description: 'Filter by active status' })
    @ApiResponse({
        status: 200,
        description: 'Service tests retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                status_code: { type: 'number', example: 200 },
                data: {
                    type: 'object',
                    properties: {
                        serviceTests: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', example: 'uuid-service-test-id' },
                                    testCode: { type: 'string', example: 'TEST_001' },
                                    testName: { type: 'string', example: 'Xét nghiệm máu tổng quát' },
                                    shortName: { type: 'string', example: 'XN Máu TQ' },
                                    unitOfMeasureId: { type: 'string', example: 'uuid-unit-of-measure-id' },
                                    unitOfMeasureName: { type: 'string', example: 'Lần' },
                                    rangeText: { type: 'string', example: 'Bình thường: 3.5-5.5 g/dL' },
                                    rangeLow: { type: 'number', example: 3.5 },
                                    rangeHigh: { type: 'number', example: 5.5 },
                                    mapping: { type: 'string', example: '{"hisCode": "TEST001"}' },
                                    testOrder: { type: 'number', example: 1 },
                                    isActiveFlag: { type: 'number', example: 1 }
                                }
                            }
                        },
                        total: { type: 'number', example: 100 },
                        limit: { type: 'number', example: 10 },
                        offset: { type: 'number', example: 0 }
                    }
                }
            }
        }
    })
    async getServiceTests(@Query() params: GetServiceTestsDto) {
        this.logger.log(`Getting service tests with params: ${JSON.stringify(params)}`);
        const result = await this.queryBus.execute(new GetServiceTestsQuery(params));
        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get service test by ID',
        description: 'Retrieve a specific service test by its ID'
    })
    @ApiParam({ name: 'id', description: 'Service test ID', example: 'uuid-service-test-id' })
    @ApiResponse({
        status: 200,
        description: 'Service test retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                status_code: { type: 'number', example: 200 },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid-service-test-id' },
                        testCode: { type: 'string', example: 'TEST_001' },
                        testName: { type: 'string', example: 'Xét nghiệm máu tổng quát' },
                        shortName: { type: 'string', example: 'XN Máu TQ' },
                        serviceId: { type: 'string', example: 'uuid-service-id' },
                        serviceName: { type: 'string', example: 'Dien giai do (Na, K, Cl)' },
                        serviceCode: { type: 'string', example: 'LAB_001' },
                        unitOfMeasureId: { type: 'string', example: 'uuid-unit-of-measure-id' },
                        unitOfMeasureName: { type: 'string', example: 'Lan' },
                        rangeText: { type: 'string', example: 'Bình thường: 3.5-5.5 g/dL' },
                        rangeLow: { type: 'number', example: 3.5 },
                        rangeHigh: { type: 'number', example: 5.5 },
                        mapping: { type: 'string', example: '{"hisCode": "TEST001"}' },
                        testOrder: { type: 'number', example: 1 },
                        isActiveFlag: { type: 'number', example: 1 }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Service test not found' })
    async getServiceTestById(@Param('id') id: string) {
        this.logger.log(`Getting service test by ID: ${id}`);
        const result = await this.queryBus.execute(new GetServiceTestByIdQuery(id));
        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update service test',
        description: 'Update an existing service test with the provided information'
    })
    @ApiParam({ name: 'id', description: 'Service test ID', example: 'uuid-service-test-id' })
    @ApiResponse({
        status: 200,
        description: 'Service test updated successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                status_code: { type: 'number', example: 200 },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid-service-test-id' },
                        testCode: { type: 'string', example: 'TEST_001' },
                        testName: { type: 'string', example: 'Xét nghiệm máu tổng quát' },
                        shortName: { type: 'string', example: 'XN Máu TQ' },
                        serviceId: { type: 'string', example: 'uuid-service-id' },
                        serviceName: { type: 'string', example: 'Dien giai do (Na, K, Cl)' },
                        serviceCode: { type: 'string', example: 'LAB_001' },
                        unitOfMeasureId: { type: 'string', example: 'uuid-unit-of-measure-id' },
                        unitOfMeasureName: { type: 'string', example: 'Lan' },
                        rangeText: { type: 'string', example: 'Bình thường: 3.5-5.5 g/dL' },
                        rangeLow: { type: 'number', example: 3.5 },
                        rangeHigh: { type: 'number', example: 5.5 },
                        mapping: { type: 'string', example: '{"hisCode": "TEST001"}' },
                        testOrder: { type: 'number', example: 1 },
                        isActiveFlag: { type: 'number', example: 1 }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Service test not found' })
    async updateServiceTest(@Param('id') id: string, @Body() updateServiceTestDto: UpdateServiceTestDto) {
        this.logger.log(`Updating service test with ID: ${id}`);
        const result = await this.commandBus.execute(new UpdateServiceTestCommand(id, updateServiceTestDto));
        return ResponseBuilder.success(result, HTTP_STATUS.OK);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete service test',
        description: 'Soft delete a service test by its ID'
    })
    @ApiParam({ name: 'id', description: 'Service test ID', example: 'uuid-service-test-id' })
    @ApiResponse({
        status: 200,
        description: 'Service test deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                status_code: { type: 'number', example: 200 },
                data: { type: 'string', example: 'Service test deleted successfully' }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Service test not found' })
    async deleteServiceTest(@Param('id') id: string) {
        this.logger.log(`Deleting service test with ID: ${id}`);
        await this.commandBus.execute(new DeleteServiceTestCommand(id));
        return ResponseBuilder.success('Service test deleted successfully', HTTP_STATUS.OK);
    }
}
