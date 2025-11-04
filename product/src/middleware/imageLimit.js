import rateLimit from 'express-rate-limit';

const imageLimiter = rateLimit({
  windowMs: 2 * 1000, // 2 seconds
  max: 1, // allow only 1 request every 2 seconds per IP
  message: "Too many image requests. Please wait 2 seconds.",
});

export { imageLimiter };