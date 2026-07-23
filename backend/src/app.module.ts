import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthProfilesModule } from './modules/health-profiles/health-profiles.module';
import { YogaPosesModule } from './modules/yoga-poses/yoga-poses.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { PainAreasModule } from './modules/pain-areas/pain-areas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthProfilesModule,
    YogaPosesModule,
    RecommendationsModule,
    UploadsModule,
    PainAreasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
