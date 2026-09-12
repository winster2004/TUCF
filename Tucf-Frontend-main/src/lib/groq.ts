import { ensureParsedObject, safeParseJSON } from './safeJson';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_STORAGE_KEY = 'groq_api_key';
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant';
const GROQ_MODEL_CANDIDATES = [
  GROQ_MODEL,
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
];
let availableModelPromise: Promise<string> | null = null;

export function getGroqModel() {
  return GROQ_MODEL;
}

export function getGroqApiKey() {
  return normalizeGroqApiKey(localStorage.getItem(GROQ_STORAGE_KEY));
}

export function saveGroqApiKey(value: string) {
  localStorage.setItem(GROQ_STORAGE_KEY, normalizeGroqApiKey(value));
  availableModelPromise = null;
}
export async function resolveGroqModel(preferred = GROQ_MODEL) {
  if (!availableModelPromise) {
    availableModelPromise = (async () => {
      const apiKey = getGroqApiKey();
      if (!apiKey) return preferred;
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!response.ok) return preferred;
      const payload = await response.json().catch(() => null);
      const modelIds = Array.isArray(payload?.data)
        ? payload.data.map((model: { id?: unknown }) => model.id).filter((id: unknown): id is string => typeof id === 'string')
        : [];
      const preferredModel = GROQ_MODEL_CANDIDATES.find((model) => modelIds.includes(model));
      if (preferredModel) {
        return preferredModel;
      }

      return modelIds.find((model) =>
        /llama|gpt|qwen|mixtral/i.test(model) &&
        !/vision|whisper|guard|safeguard|tts|moderation/i.test(model),
      ) || preferred;
    })();
  }
  return availableModelPromise;
}

function normalizeGroqApiKey(value: string | null | undefined) {
  return (value ?? '')
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

function extractReplyContent(payload: unknown) {
  if (
    payload &&
    typeof payload === 'object' &&
    'choices' in payload &&
    Array.isArray((payload as { choices?: unknown[] }).choices) &&
    (payload as { choices: Array<{ message?: { content?: string } }> }).choices[0]?.message?.content
  ) {
    return (payload as { choices: Array<{ message: { content: string } }> }).choices[0].message.content;
  }

  throw new Error('Groq response did not include a message.');
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqRequestOptions {
  messages: GroqMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export async function requestGroqChat({
  messages,
  maxTokens = 2048,
  temperature = 0.7,
  model = GROQ_MODEL,
}: GroqRequestOptions) {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('Add Groq API key in Settings');
  }

  const resolvedModel = await resolveGroqModel(model);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: resolvedModel,
      max_tokens: maxTokens,
      temperature,
      messages,
    }),
  });

  const rawPayload = await response.text();
  const payload = safeParseJSON<Record<string, unknown>>(rawPayload, 'groq.chat');

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Groq API key was rejected. Generate a new key in Groq Console and save it in Settings.');
    }
    const message =
      payload && typeof (payload as { error?: { message?: unknown } }).error?.message === 'string'
        ? ((payload as { error?: { message?: string } }).error?.message ?? 'API call failed.')
        : 'API call failed.';
    throw new Error(message);
  }

  if (!ensureParsedObject(payload)) {
    throw new Error('Invalid API response format');
  }

  return extractReplyContent(payload).trim();
}

export async function requestGroqContent(prompt: string) {
  return requestGroqChat({
    messages: [{ role: 'user', content: prompt }],
  });
}

function extractFirstJsonBlock(content: string) {
  const trimmed = content
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const objectStart = trimmed.indexOf('{');
  const arrayStart = trimmed.indexOf('[');
  const startIndex =
    objectStart === -1
      ? arrayStart
      : arrayStart === -1
        ? objectStart
        : Math.min(objectStart, arrayStart);

  if (startIndex === -1) {
    throw new Error('Model did not return JSON.');
  }

  const opening = trimmed[startIndex];
  const closing = opening === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let index = startIndex; index < trimmed.length; index += 1) {
    const char = trimmed[index];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === opening) {
      depth += 1;
    } else if (char === closing) {
      depth -= 1;

      if (depth === 0) {
        return trimmed.slice(startIndex, index + 1);
      }
    }
  }

  throw new Error('Model returned incomplete JSON.');
}

export function parseGroqJson<T>(content: string): T {
  const jsonText = extractFirstJsonBlock(content);
  const parsed = safeParseJSON<T>(jsonText, 'groq.parseGroqJson');
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid API response format');
  }
  return parsed;
}
