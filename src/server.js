// fallinsurance HTTP API — Express wrapper over the SDK.
import express from 'express';
import {
  T0_RULES, PRODUCT_CLASSES, PRODUCT_LABEL, IDD_QUESTIONS,
  PI_MINIMUMS, FOS_LIMITS, IDD_CPD_FLOOR_HOURS,
  computePremium, daysUntil, renewalFlag, pipelineBuckets,
  canBind, compileDemandsAndNeeds,
  complianceSnapshot, lookupT0, META
} from '@ai-native-solutions/fallinsurance-sdk';

const app = express();
app.use(express.json({ limit: '2mb' }));

// health + meta
app.get('/', (_req, res) => res.json({
  service: 'fallinsurance-api',
  ...META,
  endpoints: [
    'GET  /health',
    'GET  /meta',
    'GET  /t0-rules',
    'GET  /product-classes',
    'GET  /idd-questions',
    'GET  /pi-minimums',
    'GET  /fos-limits',
    'POST /premium',
    'POST /renewal-flag',
    'POST /pipeline-buckets',
    'POST /can-bind',
    'POST /demands-and-needs',
    'POST /compliance-snapshot',
    'POST /t0-lookup'
  ]
}));

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/meta',   (_req, res) => res.json(META));

// Reference material (GET)
app.get('/t0-rules',        (_req, res) => res.json({ rules: T0_RULES, count: T0_RULES.length }));
app.get('/product-classes', (_req, res) => res.json({ classes: PRODUCT_CLASSES, labels: PRODUCT_LABEL }));
app.get('/idd-questions',   (_req, res) => res.json({ questions: IDD_QUESTIONS }));
app.get('/pi-minimums',     (_req, res) => res.json({ ...PI_MINIMUMS, cpdFloorHours: IDD_CPD_FLOOR_HOURS }));
app.get('/fos-limits',      (_req, res) => res.json(FOS_LIMITS));

// Compute (POST)
app.post('/premium', (req, res) => {
  try { res.json(computePremium(req.body || {})); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/renewal-flag', (req, res) => {
  const { renewalDate } = req.body || {};
  if (!renewalDate) return res.status(400).json({ error: 'renewalDate required' });
  const days = daysUntil(renewalDate);
  res.json({ renewalDate, daysUntilRenewal: days, flag: renewalFlag(days) });
});

app.post('/pipeline-buckets', (req, res) => {
  const { policies } = req.body || {};
  if (!Array.isArray(policies)) return res.status(400).json({ error: 'policies array required' });
  res.json(pipelineBuckets(policies));
});

app.post('/can-bind', (req, res) => {
  const { policy } = req.body || {};
  if (!policy) return res.status(400).json({ error: 'policy required' });
  res.json(canBind(policy));
});

app.post('/demands-and-needs', (req, res) => {
  try {
    const statement = compileDemandsAndNeeds(req.body || {});
    res.json({ statement });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/compliance-snapshot', (req, res) => {
  const { firm, advisers = [], policies = [] } = req.body || {};
  if (!firm) return res.status(400).json({ error: 'firm required' });
  res.json(complianceSnapshot({ firm, advisers, policies }));
});

app.post('/t0-lookup', (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'query required' });
  const m = lookupT0(query);
  res.json(m || { rule: null, score: 0, note: 'No T0 rule matched' });
});

const port = process.env.PORT || 8383;
app.listen(port, () => console.log(`fallinsurance-api listening on :${port}`));
