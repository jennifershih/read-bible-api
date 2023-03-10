import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibleController } from './bible/bible.controller';
import { BibleVerseGeneratorService } from './bible/bible.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, BibleController],
  providers: [AppService, BibleVerseGeneratorService],
})
export class AppModule {}
