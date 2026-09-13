/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier

import { Module } from "@nestjs/common";
import { AuditTriggerService } from "./audit-trigger.service";
import { Audit } from "./entitiy/audit.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserContextInterceptor } from "../auth/user-context.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "../auth/auth.module";
import { AuditController } from "./audit.controller";
import { AuditService } from "./audit.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Audit]),
        AuthModule,
    ],
    controllers: [AuditController],
    providers: [
        AuditService,
        AuditTriggerService, 
        {
            provide: APP_INTERCEPTOR,
            useClass: UserContextInterceptor,
        }
    ],
    exports: [TypeOrmModule],
})
export class AuditModule {}