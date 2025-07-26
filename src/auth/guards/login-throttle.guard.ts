import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottleGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Usar IP + email para tracking más específico
    const email = req.body?.email || 'unknown';
    return Promise.resolve(`${req.ip}-${email}`);
  }

  protected errorMessage =
    'Demasiados intentos de login. Intenta de nuevo en 1 minuto.';
}
