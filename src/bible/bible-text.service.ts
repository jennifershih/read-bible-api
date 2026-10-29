import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { BOOK_CODES } from './book-names';
import { VerseReference } from './verse-reference';

interface ChapterResponse {
  verses?: { verse: number; text: string }[];
}

@Injectable()
export class BibleTextService {
  /** Fetch the verse text in the Chinese Union Version (和合本) from bible-api.com. */
  async getText({ book, chapter, verse }: VerseReference): Promise<string> {
    const res = await fetch(
      `https://bible-api.com/data/cuv/${BOOK_CODES[book]}/${chapter}`,
    );
    if (!res.ok) {
      throw new ServiceUnavailableException('Could not load the verse text.');
    }

    const body = (await res.json()) as ChapterResponse;
    const text = body.verses?.find((v) => v.verse === verse)?.text.trim();
    if (!text) {
      throw new ServiceUnavailableException('The verse was not found.');
    }
    return text;
  }
}
