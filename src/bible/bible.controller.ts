import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { BibleTextService } from './bible-text.service';
import { VerseSuggesterService } from './verse-suggester.service';

const MAX_MOOD_LENGTH = 200;

@Controller('get-bible-verse-from-mood')
export class BibleController {
  constructor(
    private readonly suggester: VerseSuggesterService,
    private readonly bibleText: BibleTextService,
  ) {}

  @Post()
  @HttpCode(200)
  async getVerseFromMood(
    @Body() body: { mood?: unknown },
  ): Promise<{ verse: string }> {
    const mood = typeof body?.mood === 'string' ? body.mood.trim() : '';
    if (!mood) {
      throw new BadRequestException('mood is required.');
    }
    if (mood.length > MAX_MOOD_LENGTH) {
      throw new BadRequestException(
        `mood must be at most ${MAX_MOOD_LENGTH} characters.`,
      );
    }

    const ref = await this.suggester.suggest(mood);
    const text = await this.bibleText.getText(ref);
    return { verse: `${ref.book} ${ref.chapter}:${ref.verse} ${text}` };
  }
}
