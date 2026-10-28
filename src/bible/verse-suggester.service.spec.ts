import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseVerseReference, VerseSuggesterService } from './verse-suggester.service';
import { BOOK_NAMES } from './book-names';

describe('parseVerseReference', () => {
  it('accepts a valid reference', () => {
    expect(parseVerseReference('{"book":"詩篇","chapter":23,"verse":1}')).toEqual({
      book: '詩篇',
      chapter: 23,
      verse: 1,
    });
  });

  it('accepts numbers sent as strings', () => {
    expect(parseVerseReference('{"book":"約翰福音","chapter":"3","verse":"16"}').chapter).toBe(3);
  });

  it.each([
    'not json',
    '{"book":"不存在的書","chapter":1,"verse":1}',
    '{"book":"詩篇","chapter":0,"verse":1}',
    '{"book":"詩篇","chapter":1.5,"verse":1}',
  ])('rejects %s', (raw) => {
    expect(() => parseVerseReference(raw)).toThrow(ServiceUnavailableException);
  });
});

describe('BOOK_NAMES', () => {
  it('covers all 66 books', () => {
    expect(Object.keys(BOOK_NAMES)).toHaveLength(66);
  });
});

describe('VerseSuggesterService', () => {
  it('fails clearly when no API key is configured', async () => {
    const service = new VerseSuggesterService(new ConfigService({}));
    await expect(service.suggest('開心')).rejects.toThrow('OPENAI_API_KEY');
  });
});
