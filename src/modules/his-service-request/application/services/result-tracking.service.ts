import { Injectable, Logger, Inject } from '@nestjs/common';
import { IResultTrackingRepository } from '../../../result-tracking/domain/result-tracking.interface';
import { ResultTracking } from '../../../result-tracking/domain/result-tracking.entity';
import { ResultStatus } from '../../../result-status/domain/result-status.entity';
import { Room } from '../../../room/domain/room.entity';
import { SampleType } from '../../../sample-type/domain/sample-type.entity';

export interface ResultTrackingInfo {
  id: string;
  inTrackingTime?: Date;
  outTrackingTime?: Date;
  note?: string;
  resultStatus?: {
    id: string;
    statusCode: string;
    statusName: string;
    orderNumber: number;
  };
  requestRoom?: {
    id: string;
    roomName: string;
    roomCode: string;
  };
  inRoom?: {
    id: string;
    roomName: string;
    roomCode: string;
  };
  sample?: {
    sampleType?: {
      id: string;
      typeCode: string;
      typeName: string;
      shortName?: string;
    };
    sampleCode?: string;
    sampleStatus?: string;
  };
  workflow?: {
    currentStep: string;
    nextStep: string;
    estimatedCompletionTime?: Date;
    priority: string;
    assignedTo?: {
      userId: string;
      userName: string;
      role: string;
    };
  };
  timeline?: {
    createdAt: Date;
    estimatedProcessingTime: string;
    estimatedCompletionTime?: Date;
    lastUpdatedAt: Date;
  };
  businessRules?: {
    canModify: boolean;
    canCancel: boolean;
    canReassign: boolean;
    requiresApproval: boolean;
    autoProcessing: boolean;
    notificationsSent: string[];
  };
}

@Injectable()
export class ResultTrackingService {
  private readonly logger = new Logger(ResultTrackingService.name);

  constructor(
    @Inject('IResultTrackingRepository')
    private readonly resultTrackingRepository: IResultTrackingRepository,
  ) {}

  async getResultTrackingByServiceRequestId(serviceRequestId: string): Promise<ResultTrackingInfo | null> {
    try {
      this.logger.log(`Getting result tracking for service request: ${serviceRequestId}`);

      const resultTrackings = await this.resultTrackingRepository.findByServiceRequestId(serviceRequestId);

      if (!resultTrackings || resultTrackings.length === 0) {
        this.logger.log(`No result tracking found for service request: ${serviceRequestId}`);
        return null;
      }

      // Get the first (most recent) result tracking
      const resultTracking = resultTrackings[0];
      return this.mapResultTrackingToInfo(resultTracking);
    } catch (error) {
      this.logger.error('Failed to get result tracking', {
        serviceRequestId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  private mapResultTrackingToInfo(resultTracking: ResultTracking): ResultTrackingInfo {
    return {
      id: resultTracking.id,
      inTrackingTime: resultTracking.inTrackingTime,
      outTrackingTime: resultTracking.outTrackingTime,
      note: resultTracking.note,
      resultStatus: resultTracking.resultStatus ? {
        id: resultTracking.resultStatus.id,
        statusCode: resultTracking.resultStatus.statusCode,
        statusName: resultTracking.resultStatus.statusName,
        orderNumber: resultTracking.resultStatus.orderNumber,
      } : undefined,
      requestRoom: resultTracking.room ? {
        id: resultTracking.room.id,
        roomName: resultTracking.room.roomName,
        roomCode: resultTracking.room.roomCode,
      } : undefined,
      inRoom: resultTracking.inRoom ? {
        id: resultTracking.inRoom.id,
        roomName: resultTracking.inRoom.roomName,
        roomCode: resultTracking.inRoom.roomCode,
      } : undefined,
      sample: {
        sampleType: resultTracking.sampleType ? {
          id: resultTracking.sampleType.id,
          typeCode: resultTracking.sampleType.typeCode,
          typeName: resultTracking.sampleType.typeName,
          shortName: resultTracking.sampleType.shortName,
        } : undefined,
        sampleCode: resultTracking.sampleCode,
        sampleStatus: 'COLLECTED', // Default status
      },
      workflow: this.parseWorkflow(resultTracking.workflow),
      timeline: this.parseTimeline(resultTracking.timeline),
      businessRules: this.parseBusinessRules(resultTracking.businessRules),
    };
  }

  private parseWorkflow(workflowJson?: string): any {
    if (!workflowJson) {
      return {
        currentStep: 'SAMPLE_COLLECTED',
        nextStep: 'SAMPLE_PROCESSING',
        priority: 'NORMAL',
      };
    }

    try {
      return JSON.parse(workflowJson);
    } catch (error) {
      this.logger.warn('Failed to parse workflow JSON', { workflowJson, error });
      return {
        currentStep: 'SAMPLE_COLLECTED',
        nextStep: 'SAMPLE_PROCESSING',
        priority: 'NORMAL',
      };
    }
  }

  private parseTimeline(timelineJson?: string): any {
    if (!timelineJson) {
      return {
        createdAt: new Date(),
        estimatedProcessingTime: '2 hours',
        lastUpdatedAt: new Date(),
      };
    }

    try {
      return JSON.parse(timelineJson);
    } catch (error) {
      this.logger.warn('Failed to parse timeline JSON', { timelineJson, error });
      return {
        createdAt: new Date(),
        estimatedProcessingTime: '2 hours',
        lastUpdatedAt: new Date(),
      };
    }
  }

  private parseBusinessRules(businessRulesJson?: string): any {
    if (!businessRulesJson) {
      return {
        canModify: true,
        canCancel: true,
        canReassign: false,
        requiresApproval: false,
        autoProcessing: true,
        notificationsSent: ['SAMPLE_COLLECTED', 'TRACKING_STARTED'],
      };
    }

    try {
      return JSON.parse(businessRulesJson);
    } catch (error) {
      this.logger.warn('Failed to parse business rules JSON', { businessRulesJson, error });
      return {
        canModify: true,
        canCancel: true,
        canReassign: false,
        requiresApproval: false,
        autoProcessing: true,
        notificationsSent: ['SAMPLE_COLLECTED', 'TRACKING_STARTED'],
      };
    }
  }
}
