import { createClientError, createHttpError } from './errorHandler';
import { getToken } from '../utils/tokenManager';

const DEFAULT_TIMEOUT_MS = 15000;
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

function getBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw || typeof raw !== 'string') {
    throw createClientError('VITE_API_BASE_URL is not configured.', 'CONFIG_ERROR');
  }
  return raw.replace(/\/+$/, '');
}

function normalizeEndpoint(endpoint) {
  if (!endpoint) return '';
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    authType,
    headers = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
    rawQuery = '',
  } = options;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  let requestBody = body;
  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  if (authType) {
    const token = getToken(authType);
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${getBaseUrl()}${normalizeEndpoint(endpoint)}${rawQuery}`, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal: controller.signal,
    });

    const payload = await parseResponse(response);
    if (!response.ok || payload?.status === false) {
      if (response.status === 401 && authType) unauthorizedHandler?.(authType);
      throw createHttpError(response, payload);
    }
    return payload;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw createClientError('Request timed out.', 'TIMEOUT', error);
    }
    if (error?.name === 'ApiError') throw error;
    throw createClientError('Network request failed.', 'NETWORK_ERROR', error);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const apiClient = Object.freeze({
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
});
