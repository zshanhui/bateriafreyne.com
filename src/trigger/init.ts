// In Trigger.dev v3, use logger for task lifecycle events
// The old tasks.onStart/onSuccess/onFailure hooks are not available in v3
// You can add logging directly in your tasks using the logger from '@trigger.dev/sdk/v3'

// If you need global error handling, you can use logger in your tasks:
// logger.info('Task started', { runId: ctx.run.id });
// logger.error('Task failed', { error, runId: ctx.run.id });
