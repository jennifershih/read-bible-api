import { BibleTextService } from './bible-text.service';

describe('BibleTextService', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the Chinese Union Version and trims the text', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        verses: [
          { verse: 15, text: '叫一切信他的都得永生。' },
          { verse: 16, text: '\n神愛世人\n' },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const text = await new BibleTextService().getText({
      book: '約翰福音',
      chapter: 3,
      verse: 16,
    });

    expect(text).toBe('神愛世人');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://bible-api.com/data/cuv/JHN/3',
    );
  });

  it('throws when the verse does not exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ verses: [] }) }),
    );
    await expect(
      new BibleTextService().getText({ book: '詩篇', chapter: 23, verse: 99 }),
    ).rejects.toThrow('not found');
  });

  it('throws when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(
      new BibleTextService().getText({ book: '詩篇', chapter: 1, verse: 1 }),
    ).rejects.toThrow();
  });
});
