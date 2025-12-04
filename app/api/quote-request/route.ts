import { tasks } from '@trigger.dev/sdk/v3';
import type { generateQuoteRequestPdfTask } from 'src/trigger/quote-request-tasks';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.selections || !data.customer) {
            return Response.json(
                { error: 'Missing required fields: selections and customer' },
                { status: 400 }
            );
        }

        if (!data.customer.email || !data.customer.full_name) {
            return Response.json(
                {
                    error: 'Missing required customer fields: email and full_name',
                },
                { status: 400 }
            );
        }

        const handle = await tasks.trigger<typeof generateQuoteRequestPdfTask>(
            'generate-quote-request-pdf',
            data
        );

        return Response.json({
            success: true,
            handle,
            message: 'Quote request submitted successfully',
        });
    } catch (error) {
        console.error('Error triggering quote request task:', error);
        return Response.json(
            { error: 'Failed to submit quote request' },
            { status: 500 }
        );
    }
}
