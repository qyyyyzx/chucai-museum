import { defineConfig } from 'vitest/config'
import path from 'node:path'

/**
 * Vitest config — intentionally decoupled from vite.config.js (uni-app plugin)
 * so tests run against plain ESM without the uni-app transform pipeline.
 *
 * Tests must cover pure logic only (domain/, services/, platform/mock).
 * UI/E2E is explicitly out of scope here — see docs and each module's llm.md.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js', 'src/**/*.test.js'],
    setupFiles: ['tests/setup.js'],
    globals: false
  }
})
