import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DualAuthGuard } from '../../common/guards/dual-auth.guard';
import { HisAuth } from '../../common/decorators/his-auth.decorator';
import { ResponseBuilder } from '../../common/dtos/base-response.dto';
import { CreateServiceDto } from './application/commands/dto/create-service.dto';
import { UpdateServiceDto } from './application/commands/dto/update-service.dto';
import { UpdatePriceDto } from './application/commands/dto/update-price.dto';
import { GetServicesDto } from './application/queries/dto/get-services.dto';
import { CreateServiceCommand } from './application/commands/create-service.command';
import { UpdateServiceCommand } from './application/commands/update-service.command';
import { DeleteServiceCommand } from './application/commands/delete-service.command';
import { UpdateServicePriceCommand } from './application/commands/update-service-price.command';
import { GetServicesQuery } from './application/queries/get-services.query';
import { GetServiceByIdQuery } from './application/queries/get-service-by-id.query';
import { GetServicesByGroupQuery } from './application/queries/get-services-by-group.query';
import { GetServicesByParentQuery } from './application/queries/get-services-by-parent.query';
import { GetServiceHierarchyQuery } from './application/queries/get-service-hierarchy.query';
import { GetServicePriceHistoryQuery } from './application/queries/get-service-price-history.query';
import { GetServicePriceAtDateQuery } from './application/queries/get-service-price-at-date.query';

@ApiTags('Services')
@Controller('api/v1/services')
@UseGuards(DualAuthGuard)
export class ServiceController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Tạo dịch vụ mới' })
    @ApiResponse({ status: 201, description: 'Dịch vụ được tạo thành công' })
    @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
    @ApiResponse({ status: 409, description: 'Mã dịch vụ đã tồn tại' })
    async createService(@Body() createServiceDto: CreateServiceDto) {
        const service = await this.commandBus.execute(new CreateServiceCommand(createServiceDto));
        return ResponseBuilder.success(service, 201);
    }

    @Get()
    @HisAuth()
    @ApiOperation({ summary: 'Lấy danh sách dịch vụ' })
    @ApiResponse({ status: 200, description: 'Danh sách dịch vụ' })
    @ApiQuery({ name: 'limit', required: false, description: 'Số lượng item trên mỗi trang' })
    @ApiQuery({ name: 'offset', required: false, description: 'Số lượng item bỏ qua' })
    @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm' })
    @ApiQuery({ name: 'serviceGroupId', required: false, description: 'ID nhóm dịch vụ' })
    @ApiQuery({ name: 'unitOfMeasureId', required: false, description: 'ID đơn vị tính' })
    @ApiQuery({ name: 'parentServiceId', required: false, description: 'ID dịch vụ cha' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Trạng thái hoạt động' })
    async getServices(@Query() getServicesDto: GetServicesDto) {
        const [services, total] = await this.queryBus.execute(new GetServicesQuery(getServicesDto));
        return ResponseBuilder.success({
            services,
            total,
            limit: getServicesDto.limit || 10,
            offset: getServicesDto.offset || 0,
        });
    }

    @Get('hierarchy')
    @HisAuth()
    @ApiOperation({ summary: 'Lấy cây phân cấp dịch vụ' })
    @ApiResponse({ status: 200, description: 'Cây phân cấp dịch vụ' })
    async getServiceHierarchy() {
        const services = await this.queryBus.execute(new GetServiceHierarchyQuery());
        return ResponseBuilder.success(services);
    }

    @Get('group/:serviceGroupId')
    @HisAuth()
    @ApiOperation({ summary: 'Lấy dịch vụ theo nhóm' })
    @ApiResponse({ status: 200, description: 'Danh sách dịch vụ theo nhóm' })
    @ApiQuery({ name: 'limit', required: false, description: 'Số lượng item trên mỗi trang' })
    @ApiQuery({ name: 'offset', required: false, description: 'Số lượng item bỏ qua' })
    async getServicesByGroup(
        @Param('serviceGroupId') serviceGroupId: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
    ) {
        const [services, total] = await this.queryBus.execute(
            new GetServicesByGroupQuery(serviceGroupId, limit || 10, offset || 0)
        );
        return ResponseBuilder.success({
            services,
            total,
            limit: limit || 10,
            offset: offset || 0,
        });
    }

    @Get('parent/:parentServiceId')
    @HisAuth()
    @ApiOperation({ summary: 'Lấy dịch vụ con theo dịch vụ cha' })
    @ApiResponse({ status: 200, description: 'Danh sách dịch vụ con' })
    @ApiQuery({ name: 'limit', required: false, description: 'Số lượng item trên mỗi trang' })
    @ApiQuery({ name: 'offset', required: false, description: 'Số lượng item bỏ qua' })
    async getServicesByParent(
        @Param('parentServiceId') parentServiceId: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
    ) {
        const [services, total] = await this.queryBus.execute(
            new GetServicesByParentQuery(parentServiceId, limit || 10, offset || 0)
        );
        return ResponseBuilder.success({
            services,
            total,
            limit: limit || 10,
            offset: offset || 0,
        });
    }

    @Get(':id')
    @HisAuth()
    @ApiOperation({ summary: 'Lấy dịch vụ theo ID' })
    @ApiResponse({ status: 200, description: 'Thông tin dịch vụ' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
    async getServiceById(@Param('id') id: string) {
        const service = await this.queryBus.execute(new GetServiceByIdQuery(id));
        return ResponseBuilder.success(service);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật dịch vụ' })
    @ApiResponse({ status: 200, description: 'Dịch vụ được cập nhật thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
    async updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        const service = await this.commandBus.execute(new UpdateServiceCommand(id, updateServiceDto));
        return ResponseBuilder.success(service);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa dịch vụ' })
    @ApiResponse({ status: 200, description: 'Dịch vụ được xóa thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
    async deleteService(@Param('id') id: string) {
        await this.commandBus.execute(new DeleteServiceCommand(id));
        return ResponseBuilder.success({ message: 'Service deleted successfully' });
    }

    @Post(':id/price')
    @ApiOperation({ summary: 'Cập nhật giá dịch vụ' })
    @ApiResponse({ status: 201, description: 'Giá dịch vụ được cập nhật thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
    async updateServicePrice(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
        const priceHistory = await this.commandBus.execute(new UpdateServicePriceCommand(id, updatePriceDto));
        return ResponseBuilder.success(priceHistory, 201);
    }

    @Get(':id/price-history')
    @HisAuth()
    @ApiOperation({ summary: 'Lấy lịch sử giá dịch vụ' })
    @ApiResponse({ status: 200, description: 'Lịch sử giá dịch vụ' })
    async getServicePriceHistory(@Param('id') id: string) {
        const priceHistory = await this.queryBus.execute(new GetServicePriceHistoryQuery(id));
        return ResponseBuilder.success(priceHistory);
    }

    @Get(':id/price')
    @HisAuth()
    @ApiOperation({ summary: 'Lấy giá dịch vụ tại ngày cụ thể' })
    @ApiResponse({ status: 200, description: 'Giá dịch vụ tại ngày' })
    @ApiQuery({ name: 'date', required: true, description: 'Ngày cần lấy giá (ISO string)' })
    async getServicePriceAtDate(
        @Param('id') id: string,
        @Query('date') date: string,
    ) {
        const price = await this.queryBus.execute(new GetServicePriceAtDateQuery(id, new Date(date)));
        return ResponseBuilder.success({ price });
    }
}
