import { BibleTextService } from './bible-text.service';

describe('BibleTextService', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the Chinese Union Version and trims the text', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: '\n神愛世人\n' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const text = await new BibleTextService().getText({ book: '約翰福音', chapter: 3, verse: 16 });

    expect(text).toBe('神愛世人');
    expect(fetchMock).toHaveBeenCalledWith('https://bible-api.com/John%203%3A16?translation=cuv');
  });

  it('throws when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(
      new BibleTextService().getText({ book: '詩篇', chapter: 1, verse: 1 }),
    ).rejects.toThrow();
  });
});
