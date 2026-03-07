import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [
        // MongooseModule.forRootAsync({
        //     useFactory: (configService: ConfigService) => ({
        //         uri: configService.getOrThrow('MONGO_URI'),
        //     }),
        //     inject: [ConfigService],
        // }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow('POSTGRES_HOST'),
                port: configService.getOrThrow('POSTGRES_PORT'),
                username: configService.getOrThrow('POSTGRES_USERNAME'),
                password: configService.getOrThrow('POSTGRES_PASSWORD'),
                database: configService.getOrThrow('POSTGRES_DATABASE'),
                synchronize: configService.getOrThrow('POSTGRES_SYNCHRONIZE'),
                autoLoadEntities: true,
                extra: {
                    max: 10,
                },
            }),
            inject: [ConfigService],
        })],
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]) {
        return TypeOrmModule.forFeature(models.map(model => model.schema));
    }
}
