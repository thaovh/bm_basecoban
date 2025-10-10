import { SetMetadata } from '@nestjs/common';

export const HIS_AUTH_KEY = 'hisAuth';
export const HisAuth = () => SetMetadata(HIS_AUTH_KEY, true);
