tasks.onFailure(({ ctx, error }) => {
    console.log('Run failed', ctx.run);
});
import { tasks } from '@trigger.dev/sdk';

tasks.onStart(({ ctx, payload, task }) => {
    console.log('Task started', ctx.run);
});

tasks.onSuccess(({ ctx, output }) => {
    console.log('Run finished', ctx.run);
});
