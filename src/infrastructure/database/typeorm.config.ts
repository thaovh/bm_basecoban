import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BMMNamingStrategy } from './bmm-naming.strategy';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const enableDatabase = configService.get('ENABLE_DATABASE', 'false') === 'true';

  if (!enableDatabase) {
    console.log('⚠️  Database connection is disabled. Set ENABLE_DATABASE=true in .env to enable.');
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/../../modules/**/domain/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    };
  }

  return {
    type: 'oracle',
    host: configService.get('DATABASE_HOST', '192.168.7.248'),
    port: parseInt(configService.get('DATABASE_PORT', '1521')),
    username: configService.get('DATABASE_USERNAME', 'LIS_RS'),
    password: configService.get('DATABASE_PASSWORD', 'LIS_RS'),
    serviceName: configService.get('DATABASE_SERVICE_NAME', 'orclstb'),
    entities: [__dirname + '/../../modules/**/domain/*.entity{.ts,.js}'],
    synchronize: false, // Disable to use migrations instead
    logging: configService.get('NODE_ENV') === 'development',
    namingStrategy: new BMMNamingStrategy(),
    migrations: ['dist/migrations/*.js'],
    migrationsRun: false, // Enable migrations
    extra: {
      // Oracle specific configurations
      connectString: `${configService.get('DATABASE_HOST')}:${configService.get('DATABASE_PORT')}/${configService.get('DATABASE_SERVICE_NAME')}`,
    },
  };
};
