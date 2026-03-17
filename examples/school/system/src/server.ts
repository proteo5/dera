// =============================================================================
// DERA School System — Fastify Server Entry Point
// =============================================================================

import Fastify from 'fastify';
import { studentRoutes } from './student/student.routes';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty' }
        : undefined,
  },
  genReqId: () => crypto.randomUUID(),
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

await fastify.register(studentRoutes, { prefix: '/api/v1' });

// ---------------------------------------------------------------------------
// Health endpoint (Level 2 health check — used by Deployer AI)
// ---------------------------------------------------------------------------

fastify.get('/health', async (_request, reply) => {
  reply.status(200).send({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const host = process.env.HOST ?? '0.0.0.0';
const port = parseInt(process.env.PORT ?? '3000', 10);

try {
  await fastify.listen({ host, port });
  console.log(`School system running on ${host}:${port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
