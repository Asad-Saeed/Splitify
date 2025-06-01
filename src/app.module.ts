import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { GroupsModule } from './groups/groups.module';
import { ExpensesModule } from './expenses/expenses.module';
import { FriendsModule } from './friends/friends.module';
// import { APP_CONFIG } from './config/app.config';
// import { DATABASE_CONFIG } from './config/database.config';
// import { CRON_CONFIG } from './config/cron.config';
// import { CONFIG } from './config';

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the ConfigModule available globally
      // envFilePath: ['.env', '.dev.env', '.prod.env'], // Load environment variables from .env, .dev.env, or .prod.env
      // cache: true, // Cache the environment variables to avoid multiple reads
      // expandVariables: true, // Expand environment variables in the configuration e.g MONGO_URI=${MONGO_URI}.yaml
      // load: [APP_CONFIG, DATABASE_CONFIG, CRON_CONFIG ], // Load the configuration from the configuration.ts file
      // load: CONFIG,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UsersModule,
    FriendsModule,
    GroupsModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
