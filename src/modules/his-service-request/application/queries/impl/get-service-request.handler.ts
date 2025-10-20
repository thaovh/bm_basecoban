import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { GetServiceRequestQuery } from '../get-service-request.query';
import { IHisServiceRequestRepository, HisServiceRequestResponse } from '../../../domain/his-service-request.interface';
import { AppError, HTTP_CLIENT_ERROR, HTTP_SERVER_ERROR } from '../../../../../common/dtos/base-response.dto';

@QueryHandler(GetServiceRequestQuery)
export class GetServiceRequestHandler implements IQueryHandler<GetServiceRequestQuery> {
  private readonly logger = new Logger(GetServiceRequestHandler.name);

  constructor(
    @Inject('IHisServiceRequestRepository')
    private readonly hisServiceRequestRepository: IHisServiceRequestRepository,
  ) {}

  async execute(query: GetServiceRequestQuery): Promise<HisServiceRequestResponse> {
    const { serviceReqCode } = query.params;

    this.logger.log(`Getting service request for code: ${serviceReqCode}`);

    try {
      const serviceRequest = await this.hisServiceRequestRepository.getServiceRequestByCode(serviceReqCode);

      if (!serviceRequest) {
        throw new AppError(
          'Service request not found',
          'SERVICE_REQUEST_NOT_FOUND',
          HTTP_CLIENT_ERROR.NOT_FOUND,
        );
      }

      this.logger.log(`Service request found: ${serviceRequest.serviceReqCode} with ${serviceRequest.services.length} services`);

      return { serviceRequest };
    } catch (error) {
      this.logger.error('Failed to get service request', {
        serviceReqCode,
        error: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Failed to retrieve service request',
        'SERVICE_REQUEST_RETRIEVAL_ERROR',
        HTTP_SERVER_ERROR.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
