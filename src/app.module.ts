import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BibleController } from './bible/bible.controller';
import { BibleTextService } from './bible/bible-text.service';
import { VerseSuggesterService } from './bible/verse-suggester.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, BibleController],
  providers: [VerseSuggesterService, BibleTextService],
})
export class AppModule {}
