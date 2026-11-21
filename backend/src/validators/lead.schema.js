import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '../constants.js';

const optionalText = (max) =>
  z
    .string()
    .trim()
    .max(max, { error: `Must be at most ${max} characters` })
    .optional()
    .transform((value) => value || null);

export const leadSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(1, { error: 'Name is required' })
    .max(100, { error: 'Name must be at most 100 characters' }),
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Enter a valid email address' })),
  phone: optionalText(20).refine((value) => !value || /^[+\d][\d\s()-]{6,19}$/.test(value), {
    error: 'Enter a valid phone number',
  }),
  company: optionalText(100),
  source: z.enum(LEAD_SOURCES, { error: `Source must be one of: ${LEAD_SOURCES.join(', ')}` }),
  status: z
    .enum(LEAD_STATUSES, { error: `Status must be one of: ${LEAD_STATUSES.join(', ')}` })
    .default('New'),
});

const emptyToUndefined = (value) => (value === '' ? undefined : value);

export const leadQuerySchema = z.object({
  search: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
  status: z.preprocess(
    emptyToUndefined,
    z.enum(LEAD_STATUSES, { error: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }).optional(),
  ),
});

export const idParamSchema = z.coerce
  .number({ error: 'Lead id must be a number' })
  .int({ error: 'Lead id must be a positive integer' })
  .positive({ error: 'Lead id must be a positive integer' });
