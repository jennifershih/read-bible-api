import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BibleVerseGeneratorService } from 'src/bible/bible.service';
import axios from 'axios';

@Controller('get-bible-verse-from-mood')
export class BibleController {
  constructor(
    private readonly bibleVerseGeneratorService: BibleVerseGeneratorService,
  ) {}

  @Post()
  async getBibleVerseFromMood(@Body() body: { mood: string }) {
    const prompt = `今天我的心情是 ${body.mood},請依照我的心情提供來自現代標點和合本的聖經資訊,格式是書卷＠章＠節給我。例如genesis：＠3＠16。\n`;
    const generatedVerse =
      await this.bibleVerseGeneratorService.generateBibleVerse(prompt);

    const verseMatch = generatedVerse.match(
      /^(.+?)(?::|：)?[@＠](\d+)[@＠](\d+)(?:-(\d+))?/,
    );

    if (!verseMatch) {
      throw new HttpException(
        'Failed to generate verse.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bookNames = require('./bookNames');
    const chineseBookName = verseMatch[1];
    const englishBookName = bookNames[chineseBookName];
    const chapter = parseInt(verseMatch[2]);
    const verseNum = parseInt(verseMatch[3]);
    const url = `https://bible-api.com/${englishBookName}+${chapter}:${verseNum}`;
    try {
      const response = await axios.get(url);
      const text = response.data.text;
      return {
        verse: `${chineseBookName} ${chapter}:${verseNum} ${text}`,
      };
    } catch (error) {
      console.error(error);
      return { verse: 'Sorry, something went wrong.' };
    }
  }
}
