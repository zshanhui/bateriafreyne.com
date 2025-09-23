import { logger, runs, tasks } from '@trigger.dev/sdk';
import type { createRoiChartTask } from 'src/trigger/report-tasks';

export async function POST(req: Request) {
    const data = await req.json();

    const handle = await tasks.trigger<typeof createRoiChartTask>(
        'create-roi-chart',
        {
            totalSavings: 12345678,
            ...data,
        }
    );

    return Response.json({ handle });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const runId = searchParams.get('runId');
    if (!runId) return new Response('Missing runId', { status: 400 });

    // Pseudocode: replace with the actual Trigger.dev run retrieval for your SDK version
    const run = await runs.retrieve(runId);
    logger.info(`run: ${runId} retrieved: `, run.output);

    return Response.json(run);
}
