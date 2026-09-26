import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const windowMs = 60 * 1000; // 1 minute window
const maxRequests = 120; // 120 requests per minute
const ipStore = new Map<string, RateLimitRecord>();

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  const record = ipStore.get(ip);
  if (!record || now > record.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + windowMs });
    next();
    return;
  }

  if (record.count >= maxRequests) {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Too many requests. Please wait before retrying.',
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    });
    return;
  }

  record.count += 1;
  next();
}
