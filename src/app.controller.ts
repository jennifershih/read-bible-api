import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /** Health check used by uptime monitors and the Vercel deployment. */
  @Get()
  health(): { status: string } {
    return { status: 'ok' };
  }
}
