import { ZodError, z } from 'zod';
import { HttpError } from '../utils/httpError.js';

export function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }

  if (err instanceof ZodError) {
    const { formErrors, fieldErrors } = z.flattenError(err);
    return res.status(400).json({
      error: formErrors[0] || 'Validation failed',
      details: fieldErrors,
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON body' });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
