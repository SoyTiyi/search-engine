import { Module, Global } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { ConfigurationService } from './configuration.service';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            cache: true,
            envFilePath: '.env',
        }),
    ],
    providers: [ConfigurationService],
    exports: [ConfigurationService],
})
export class ConfigurationModule {}

