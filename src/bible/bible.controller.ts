import { Controller, Post, Body } from '@nestjs/common';
import { BibleVerseGeneratorService } from 'src/bible/bible.service';

@Controller('get-bible-verse-from-mood')
export class BibleController {
  constructor(
    private readonly bibleVerseGeneratorService: BibleVerseGeneratorService,
  ) {}

  @Post()
  async getBibleVerseFromMood(@Body() body: { mood: string }) {
    const prompt = `今天我的心情是 ${body.mood},請依照我的心情提供來自現代標點和合本的聖經資訊,格式是書卷＠章＠節給我。例如：約翰福音＠3＠16。\n`;
    const generatedVerse =
      await this.bibleVerseGeneratorService.generateBibleVerse(prompt);
    return { verse: generatedVerse };
  }
}
