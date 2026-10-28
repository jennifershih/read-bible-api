import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { BOOK_NAMES } from './book-names';
import { VerseReference } from './verse-reference';

interface BibleApiResponse {
  text?: string;
}

@Injectable()
export class BibleTextService {
  /** Fetch the verse text in the Chinese Union Version from bible-api.com. */
  async getText({ book, chapter, verse }: VerseReference): Promise<string> {
    const reference = encodeURIComponent(`${BOOK_NAMES[book]} ${chapter}:${verse}`);
    const res = await fetch(`https://bible-api.com/${reference}?translation=cuv`);
    if (!res.ok) {
      throw new ServiceUnavailableException('Could not load the verse text.');
    }

    const body = (await res.json()) as BibleApiResponse;
    const text = body.text?.trim();
    if (!text) {
      throw new ServiceUnavailableException('The verse text is empty.');
    }
    return text;
  }
}
