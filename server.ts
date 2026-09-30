import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const PORT = 3000;

// Shared Gemini AI client
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST /api/explain: Generative Explainability (Layer C)
// Expects: { ruleIds: string[], evidence: any }
app.post('/api/explain', async (req, res) => {
  const { ruleIds, evidence } = req.body;

  const defaultFallback = 
    "Deterministic engine flagged 8 scholarship applications originating across 3 distinct institutions (Government Engineering College Raipur, Bilaspur Institute of Technology, Bastar Tribal Degree College) converging on 2 hashed financial destination accounts (FD-7a3f…c91 and FD-9e2b…a44). Cross-referencing municipal census records confirms 0 shared households among applicants. Rule FIN-001 (legitimate sibling sharing) evaluated as non-applicable. Systematic multi-institutional bank account convergence indicates coordinated syndication requiring verification of beneficiary biometric KYC and physical campus attendance rolls. Final determination rests with the Nodal Officer.";

  if (!aiClient || !process.env.GEMINI_API_KEY) {
    return res.json({ trace: defaultFallback, source: 'fallback_template' });
  }

  try {
    const prompt = `You are the Explainability Engine for ScholAR (Government Scholarship Integrity and Pre-Disbursement Reconciliation Engine for PFMS treasury payout).
Analyze the following triggered deterministic rules and evidence JSON:
Triggered Rule IDs: ${JSON.stringify(ruleIds)}
Evidence: ${JSON.stringify(evidence)}

Instructions:
1. Provide a plain-English "Investigation Trace" (strictly maximum 120 words).
2. Neutral, objective forensic tone. No accusations. No black-box fraud scores. No percentage probabilities. Never use emotional words.
3. Reference the exact colleges and accounts from the evidence.
4. MUST END EXACTLY WITH: "Final determination rests with the Nodal Officer."`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an objective GovTech audit explainability system. You never determine fraud. You only summarize evidence relationships neutrally.",
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || defaultFallback;
    return res.json({ trace: text, source: 'gemini_api' });
  } catch (err: any) {
    console.error('Gemini API Error in /api/explain:', err?.message || err);
    return res.json({ trace: defaultFallback, source: 'fallback_template' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScholAR engine running on port ${PORT}`);
  });
}

startServer();
