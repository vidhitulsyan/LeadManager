import { Router } from 'express';
import * as leads from '../repositories/leads.repository.js';
import { idParamSchema, leadQuerySchema, leadSchema } from '../validators/lead.schema.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();

function findLeadOr404(rawId) {
  const id = idParamSchema.parse(rawId);
  const lead = leads.findById(id);
  if (!lead) throw new HttpError(404, `Lead ${id} not found`);
  return lead;
}

router.get('/', (req, res) => {
  const filters = leadQuerySchema.parse(req.query);
  res.json(leads.findAll(filters));
});

router.get('/:id', (req, res) => {
  res.json(findLeadOr404(req.params.id));
});

router.post('/', (req, res) => {
  const data = leadSchema.parse(req.body);
  res.status(201).json(leads.create(data));
});

router.put('/:id', (req, res) => {
  const { id } = findLeadOr404(req.params.id);
  const data = leadSchema.parse(req.body);
  res.json(leads.update(id, data));
});

router.delete('/:id', (req, res) => {
  const { id } = findLeadOr404(req.params.id);
  leads.remove(id);
  res.status(204).end();
});

export default router;
