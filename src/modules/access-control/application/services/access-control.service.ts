import { Injectable, Logger } from '@nestjs/common';
import { IAccessControlService, AttendanceEventParams, AttendanceEventResponse, AttendanceEventInfo } from '../../domain/access-control.interface';
import { AccessControlHttpClient } from '../../infrastructure/http/access-control.http.client';

@Injectable()
export class AccessControlService implements IAccessControlService {
    private readonly logger = new Logger(AccessControlService.name);

    constructor(
        private readonly httpClient: AccessControlHttpClient,
    ) { }

    async getAttendanceEvents(params: AttendanceEventParams): Promise<AttendanceEventResponse> {
        const requestBody = {
            AcsEventCond: {
                searchID: "1",
                searchResultPosition: params.searchResultPosition || 0,
                maxResults: params.maxResults || 30,
                major: 5,
                minor: 75,
                startTime: params.startTime,
                endTime: params.endTime,
                eventAttribute: "attendance",
                employeeNoString: params.employeeNoString
            }
        };

        this.logger.log(`Requesting attendance events for employee ${params.employeeNoString} from ${params.startTime} to ${params.endTime}`);

        try {
            const response = await this.httpClient.getAttendanceEvents(requestBody);

            if (!response.AcsEvent) {
                this.logger.warn('Invalid response format from Access Control system', response);
                throw new Error('Invalid response format from Access Control system');
            }

            this.logger.log(`Successfully retrieved ${response.AcsEvent.numOfMatches} attendance events`);

            // Process each event to add base64 image
            if (response.AcsEvent.InfoList) {
                const processedEvents = await Promise.all(
                    response.AcsEvent.InfoList.map(async (event: AttendanceEventInfo) => {
                        const processedEvent = {
                            ...event,
                            pictureURL: this.transformImageUrl(event.pictureURL)
                        };

                        // Fetch and encode image to base64 if pictureURL exists
                        if (event.pictureURL) {
                            try {
                                const imagePath = this.extractImagePath(event.pictureURL);
                                if (imagePath) {
                                    processedEvent.image = await this.getImageAsBase64(imagePath);
                                }
                            } catch (error) {
                                this.logger.warn('Failed to fetch image for event', {
                                    eventId: event.serialNo,
                                    pictureURL: event.pictureURL,
                                    error: error instanceof Error ? error.message : String(error)
                                });
                                // Continue without image if fetch fails
                            }
                        }

                        return processedEvent;
                    })
                );

                response.AcsEvent.InfoList = processedEvents;
            }

            return response.AcsEvent;
        } catch (error) {
            this.logger.error('Failed to get attendance events', {
                error: error instanceof Error ? error.message : String(error),
                employeeNoString: params.employeeNoString,
                startTime: params.startTime,
                endTime: params.endTime
            });
            throw error;
        }
    }

    async getImageAsBase64(imagePath: string): Promise<string> {
        try {
            const originalUrl = `http://192.168.68.2/LOCALS/${imagePath}`;
            this.logger.log(`Fetching image: ${originalUrl}`);
            const response = await this.httpClient.getImage(originalUrl);
            if (response) {
                const base64 = response.toString('base64');
                return `data:image/jpeg;base64,${base64}`;
            }
            return null;
        } catch (error) {
            this.logger.warn('Failed to fetch image', {
                imagePath,
                error: error instanceof Error ? error.message : String(error)
            });
            return null;
        }
    }

    private transformImageUrl(originalUrl: string): string {
        if (!originalUrl) return null;
        const urlParts = originalUrl.split('@')[0];
        const imagePath = urlParts.replace('http://192.168.68.2/LOCALS/', '');
        return `/api/v1/access-control/images/${encodeURIComponent(imagePath)}`;
    }

    private extractImagePath(originalUrl: string): string {
        if (!originalUrl) return null;
        const urlParts = originalUrl.split('@')[0];
        return urlParts.replace('http://192.168.68.2/LOCALS/', '');
    }
}
