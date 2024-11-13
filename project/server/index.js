import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import supabase from './db.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Create a new record in Supabase
    const { data: job, error } = await supabase
      .from('transcriptions')
      .insert([
        { 
          status: 'pending',
          progress: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Start processing in the background
    processAudio(job.id, file.path);
    res.json({ transcriptionId: job.id });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to start transcription' });
  }
});

app.get('/api/transcribe/:id/status', async (req, res) => {
  try {
    const { data: job, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      status: job.status,
      progress: job.progress,
      error: job.error
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

app.get('/api/transcribe/:id/result', async (req, res) => {
  try {
    const { data: job, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!job || job.status !== 'completed') {
      return res.status(404).json({ error: 'Transcription not found or not completed' });
    }

    res.json(job.transcription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transcription' });
  }
});

app.get('/api/analyze/:id', async (req, res) => {
  try {
    const { data: job, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!job || job.status !== 'completed') {
      return res.status(404).json({ error: 'Analysis not found or not completed' });
    }

    res.json(job.analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

async function updateJobProgress(jobId, status, progress, data = {}) {
  try {
    const { error } = await supabase
      .from('transcriptions')
      .update({
        status,
        progress,
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to update job progress:', error);
  }
}

async function processAudio(jobId, audioPath) {
  try {
    // Update status to transcribing
    await updateJobProgress(jobId, 'transcribing', 0);

    // Start transcription
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
    });

    // Update progress and start analysis
    await updateJobProgress(jobId, 'analyzing', 50, {
      transcription: transcription
    });

    // Analyze the transcription
    const analysis = await analyzeTranscription(transcription.text);

    // Complete the job
    await updateJobProgress(jobId, 'completed', 100, {
      analysis,
      completed_at: new Date().toISOString()
    });

    // Cleanup
    fs.unlink(audioPath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  } catch (error) {
    console.error('Processing error:', error);
    await updateJobProgress(jobId, 'error', 0, {
      error: error.message,
      completed_at: new Date().toISOString()
    });
  }
}

async function analyzeTranscription(text) {
  const prompt = `Analyze this sermon transcript and provide a structured analysis in the following JSON format:

{
  "summary": "Brief overview of the sermon",
  "keyPoints": ["Main point 1", "Main point 2", ...],
  "biblicalReferences": [
    {
      "reference": "Book Chapter:Verse",
      "context": "How it's used in the sermon",
      "relevance": "Why it's significant"
    }
  ],
  "theologicalThemes": [
    {
      "theme": "Theme name",
      "explanation": "Theme explanation",
      "scripturalBasis": ["Supporting scripture 1", "Supporting scripture 2"]
    }
  ],
  "applicationPoints": [
    {
      "point": "Application point",
      "practicalSteps": ["Step 1", "Step 2"],
      "targetAudience": "Who this applies to"
    }
  ],
  "suggestedResources": [
    {
      "title": "Resource name",
      "type": "book|article|scripture|commentary",
      "description": "Brief description",
      "url": "Optional URL"
    }
  ]
}

Transcript: ${text}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});