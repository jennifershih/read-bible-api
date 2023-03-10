import { Injectable } from '@nestjs/common';

@Injectable()
export class BibleVerseGeneratorService {
  async generateBibleVerse(prompt: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Configuration, OpenAIApi } = require('openai');
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 1024,
    });

    const generatedVerse = response.data.choices[0].text.trim();
    if (!generatedVerse) {
      throw new Error('Failed to generate verse!');
    }

    return generatedVerse;
  }
}
