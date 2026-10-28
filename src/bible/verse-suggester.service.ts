import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { BOOK_NAMES } from './book-names';
import { VerseReference } from './verse-reference';

const SYSTEM_PROMPT = `你是一位溫柔的牧者。使用者會描述今天的心情，請從和合本聖經中挑選一節最能安慰或鼓勵他的經文。
只回傳 JSON，格式為 {"book": "書卷全名（繁體，例如：詩篇）", "chapter": 章（數字）, "verse": 節（數字）}，不要附加其他文字。`;

@Injectable()
export class VerseSuggesterService {
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('OPENAI_API_KEY');
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
    this.model = config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';
  }

  /** Ask the model for a verse that fits the mood. */
  async suggest(mood: string): Promise<VerseReference> {
    if (!this.client) {
      throw new ServiceUnavailableException('OPENAI_API_KEY is not configured.');
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `今天我的心情是：${mood}` },
      ],
    });

    return parseVerseReference(completion.choices[0]?.message.content ?? '');
  }
}

/** Validate the model's JSON answer; throws when it is not a real reference. */
export function parseVerseReference(raw: string): VerseReference {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new ServiceUnavailableException('The model did not return JSON.');
  }

  const { book, chapter, verse } = (data ?? {}) as Record<string, unknown>;
  const chapterNum = Number(chapter);
  const verseNum = Number(verse);
  if (
    typeof book !== 'string' ||
    !(book in BOOK_NAMES) ||
    !Number.isInteger(chapterNum) ||
    !Number.isInteger(verseNum) ||
    chapterNum < 1 ||
    verseNum < 1
  ) {
    throw new ServiceUnavailableException('The model returned an invalid verse.');
  }

  return { book, chapter: chapterNum, verse: verseNum };
}
