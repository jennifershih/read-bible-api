import { BadRequestException } from '@nestjs/common';
import { BibleController } from './bible.controller';
import { BibleTextService } from './bible-text.service';
import { VerseSuggesterService } from './verse-suggester.service';

describe('BibleController', () => {
  const suggester = { suggest: vi.fn() };
  const bibleText = { getText: vi.fn() };
  const controller = new BibleController(
    suggester as unknown as VerseSuggesterService,
    bibleText as unknown as BibleTextService,
  );

  beforeEach(() => vi.resetAllMocks());

  it('combines the suggested reference with the verse text', async () => {
    suggester.suggest.mockResolvedValue({
      book: '詩篇',
      chapter: 23,
      verse: 1,
    });
    bibleText.getText.mockResolvedValue('耶和華是我的牧者');

    await expect(
      controller.getVerseFromMood({ mood: '  焦慮  ' }),
    ).resolves.toEqual({
      verse: '詩篇 23:1 耶和華是我的牧者',
    });
    expect(suggester.suggest).toHaveBeenCalledWith('焦慮');
  });

  it.each([{}, { mood: '' }, { mood: 42 }, { mood: 'x'.repeat(201) }])(
    'rejects invalid input %j',
    async (body) => {
      await expect(controller.getVerseFromMood(body)).rejects.toThrow(
        BadRequestException,
      );
      expect(suggester.suggest).not.toHaveBeenCalled();
    },
  );
});
