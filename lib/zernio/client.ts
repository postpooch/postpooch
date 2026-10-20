import Zernio from '@zernio/node';

const globalForZernio = globalThis as typeof globalThis & {
  zernioClient?: Zernio;
};

export function getZernioClient() {
  if (globalForZernio.zernioClient) {
    return globalForZernio.zernioClient;
  }

  const apiKey = process.env.ZERNIO_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('Missing ZERNIO_API_KEY.');
  }

  globalForZernio.zernioClient = new Zernio({ apiKey });
  return globalForZernio.zernioClient;
}
