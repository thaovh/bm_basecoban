import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const hisTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  name: 'his', // Connection name for HIS database
  type: 'oracle',
  host: configService.get('HIS_DATABASE_HOST', '192.168.7.248'),
  port: parseInt(configService.get('HIS_DATABASE_PORT', '1521')),
  username: configService.get('HIS_DATABASE_USERNAME', 'HIS_USER'),
  password: configService.get('HIS_DATABASE_PASSWORD', 'HIS_PASSWORD'),
  serviceName: configService.get('HIS_DATABASE_SERVICE_NAME', 'orclstb'),
  sid: configService.get('HIS_DATABASE_SID', 'orclstb'),
  synchronize: false, // Never auto-sync HIS database
  logging: configService.get('NODE_ENV') === 'development',
  entities: [], // We'll add entities when we create them
  migrations: [],
  migrationsRun: false,
  extra: {
    connectString: `${configService.get('HIS_DATABASE_HOST', '192.168.7.248')}:${configService.get('HIS_DATABASE_PORT', '1521')}/${configService.get('HIS_DATABASE_SERVICE_NAME', 'orclstb')}`,
  },
});
