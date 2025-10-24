
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { router } from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// arquivos estáticos de upload
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))

app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use('/api', router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API InfraPlus rodando na porta ${port}`));
