import { logger, task } from '@trigger.dev/sdk/v3';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Resend } from 'resend';

type QuoteRequestPayload = {
    selections: {
        brand: string | null;
        brandLabel: string | null;
        model: string | null;
        batteryCapacity: string | null;
        forkliftCount: number | null;
        dailyShifts: number | null;
        usageEnvironment: 'indoors' | 'outdoors' | null;
        highHumidity: boolean | null;
    };
    customer: {
        full_name: string;
        email: string;
        company_name?: string;
        phone_whatsapp_number?: string;
        country_region: string;
        city: string;
        comments_requests?: string;
    };
};

export const generateQuoteRequestPdfTask = task({
    id: 'generate-quote-request-pdf',
    maxDuration: 60,
    run: async (payload: QuoteRequestPayload, { ctx }) => {
        logger.info('Generating quote request PDF...', { payload, ctx });

        try {
            // Generate PDF
            const pdfBuffer = await generateQuoteRequestPdf(payload);

            // Send email with PDF attachment
            const emailResult = await sendQuoteRequestEmail(payload, pdfBuffer);

            logger.info('Quote request PDF generated and sent successfully', {
                emailResult,
            });

            return {
                success: true,
                message: 'Quote request PDF generated and sent',
                emailId: emailResult.id,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            logger.error('Error generating quote request PDF', { error });
            throw error;
        }
    },
});

export async function generateQuoteRequestPdf(
    payload: QuoteRequestPayload
): Promise<Buffer> {
    try {
        // Create a new PDF document
        const doc = await PDFDocument.create();
        const page = doc.addPage([612, 792]); // LETTER size in points (8.5" x 11")

        // Load fonts
        const helveticaFont = await doc.embedFont(StandardFonts.Helvetica);
        const helveticaBoldFont = await doc.embedFont(
            StandardFonts.HelveticaBold
        );

        // Page dimensions
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const margin = 50;
        const contentWidth = pageWidth - 2 * margin;

        // Color definitions
        const darkGray = rgb(0.12, 0.16, 0.23); // #1e293b
        const mediumGray = rgb(0.39, 0.45, 0.55); // #64748b
        const textGray = rgb(0.2, 0.25, 0.33); // #334155
        const lightGray = rgb(0.58, 0.64, 0.72); // #94a3b8

        let y = pageHeight - margin;

        // Helper function to draw text with wrapping
        const drawText = (
            text: string,
            x: number,
            yPos: number,
            options: {
                font?: any;
                size?: number;
                color?: any;
                maxWidth?: number;
            } = {}
        ): number => {
            const {
                font = helveticaFont,
                size = 11,
                color = textGray,
                maxWidth = contentWidth,
            } = options;

            const lines = text.split('\n');
            let currentY = yPos;

            lines.forEach(line => {
                if (line.trim() === '') {
                    currentY -= size * 1.2;
                    return;
                }

                // Simple text wrapping
                const words = line.split(' ');
                let currentLine = '';
                let lineY = currentY;

                words.forEach(word => {
                    const testLine =
                        currentLine + (currentLine ? ' ' : '') + word;
                    const textWidth = font.widthOfTextAtSize(testLine, size);

                    if (textWidth > maxWidth && currentLine) {
                        page.drawText(currentLine, {
                            x,
                            y: lineY,
                            size,
                            font,
                            color,
                        });
                        currentLine = word;
                        lineY -= size * 1.2;
                    } else {
                        currentLine = testLine;
                    }
                });

                if (currentLine) {
                    page.drawText(currentLine, {
                        x,
                        y: lineY,
                        size,
                        font,
                        color,
                    });
                    currentY = lineY - size * 1.2;
                }
            });

            return currentY;
        };

        // Header with branding
        const titleText = 'Quote Request Form';
        const titleWidth = helveticaBoldFont.widthOfTextAtSize(titleText, 24);
        const titleX = (pageWidth - titleWidth) / 2;
        const titleY = drawText(titleText, titleX, y, {
            font: helveticaBoldFont,
            size: 24,
            color: darkGray,
            maxWidth: contentWidth,
        });
        y = titleY - 10;

        const subtitleText = 'Forklift Battery Selection';
        const subtitleWidth = helveticaFont.widthOfTextAtSize(subtitleText, 12);
        const subtitleX = (pageWidth - subtitleWidth) / 2;
        y = drawText(subtitleText, subtitleX, y, {
            size: 12,
            color: mediumGray,
            maxWidth: contentWidth,
        });
        y -= 30;

        // Customer Information Section
        y = drawText('Customer Information', margin, y, {
            font: helveticaBoldFont,
            size: 16,
            color: darkGray,
        });
        y -= 5;

        // Draw underline
        page.drawLine({
            start: { x: margin, y: y },
            end: { x: margin + 200, y: y },
            thickness: 1,
            color: darkGray,
        });
        y -= 15;

        const customerInfo = [
            ['Full Name', payload.customer.full_name],
            ['Email', payload.customer.email],
            ['Company Name', payload.customer.company_name || 'N/A'],
            ['Phone/WhatsApp', payload.customer.phone_whatsapp_number || 'N/A'],
            ['Country/Region', payload.customer.country_region],
            ['City', payload.customer.city],
        ];

        customerInfo.forEach(([label, value]) => {
            page.drawText(`${label}:`, {
                x: margin,
                y,
                size: 11,
                font: helveticaFont,
                color: textGray,
            });
            page.drawText(`  ${value}`, {
                x: margin + 100,
                y,
                size: 11,
                font: helveticaFont,
                color: mediumGray,
            });
            y -= 18;
        });

        y -= 10;

        // Forklift Selection Details Section
        y = drawText('Forklift Selection Details', margin, y, {
            font: helveticaBoldFont,
            size: 16,
            color: darkGray,
        });
        y -= 5;

        // Draw underline
        page.drawLine({
            start: { x: margin, y: y },
            end: { x: margin + 200, y: y },
            thickness: 1,
            color: darkGray,
        });
        y -= 15;

        const selectionInfo = [
            [
                'Brand',
                payload.selections.brandLabel ||
                    payload.selections.brand ||
                    'N/A',
            ],
            ['Model', payload.selections.model || 'N/A'],
            ['Battery Capacity', payload.selections.batteryCapacity || 'N/A'],
            [
                'Number of Forklifts',
                payload.selections.forkliftCount?.toString() || 'N/A',
            ],
            [
                'Daily Shifts',
                payload.selections.dailyShifts?.toString() || 'N/A',
            ],
            ['Usage Environment', payload.selections.usageEnvironment || 'N/A'],
        ];

        if (payload.selections.usageEnvironment === 'outdoors') {
            selectionInfo.push([
                'High Humidity',
                payload.selections.highHumidity !== null
                    ? payload.selections.highHumidity
                        ? 'Yes'
                        : 'No'
                    : 'N/A',
            ]);
        }

        selectionInfo.forEach(([label, value]) => {
            page.drawText(`${label}:`, {
                x: margin,
                y,
                size: 11,
                font: helveticaFont,
                color: textGray,
            });
            page.drawText(`  ${value}`, {
                x: margin + 120,
                y,
                size: 11,
                font: helveticaFont,
                color: mediumGray,
            });
            y -= 18;
        });

        y -= 10;

        // Additional Comments Section
        if (payload.customer.comments_requests) {
            y = drawText('Additional Comments / Requests', margin, y, {
                font: helveticaBoldFont,
                size: 16,
                color: darkGray,
            });
            y -= 5;

            // Draw underline
            page.drawLine({
                start: { x: margin, y: y },
                end: { x: margin + 300, y: y },
                thickness: 1,
                color: darkGray,
            });
            y -= 15;

            y = drawText(payload.customer.comments_requests, margin, y, {
                size: 11,
                color: textGray,
                maxWidth: contentWidth,
            });
            y -= 20;
        }

        // Footer
        const footerY = margin;
        const footerText = `Generated on ${new Date().toLocaleString()}`;
        const footerTextWidth = helveticaFont.widthOfTextAtSize(footerText, 9);
        const footerX = (pageWidth - footerTextWidth) / 2;

        page.drawText(footerText, {
            x: footerX,
            y: footerY,
            size: 9,
            font: helveticaFont,
            color: lightGray,
        });

        // Save the PDF and return as Buffer
        const pdfBytes = await doc.save();
        return Buffer.from(pdfBytes);
    } catch (error) {
        throw error;
    }
}

export async function sendQuoteRequestEmail(
    payload: QuoteRequestPayload,
    pdfBuffer: Buffer
): Promise<{ id: string }> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable is not set');
    }

    const recipientEmails = process.env.QUOTE_REQUEST_RECIPIENT_EMAILS
        ? process.env.QUOTE_REQUEST_RECIPIENT_EMAILS.split(',').map(email =>
              email.trim()
          )
        : [];

    if (recipientEmails.length === 0) {
        throw new Error(
            'QUOTE_REQUEST_RECIPIENT_EMAILS environment variable is not set or empty'
        );
    }

    const emailSubject = `New Quote Request from ${payload.customer.full_name}`;
    const emailBody = `
        <h2>New Quote Request Received</h2>
        <p>A new quote request has been submitted through the Forklift Battery Selection form.</p>
        
        <h3>Customer Details:</h3>
        <ul>
            <li><strong>Name:</strong> ${payload.customer.full_name}</li>
            <li><strong>Email:</strong> ${payload.customer.email}</li>
            <li><strong>Company:</strong> ${payload.customer.company_name || 'N/A'}</li>
            <li><strong>Phone:</strong> ${payload.customer.phone_whatsapp_number || 'N/A'}</li>
            <li><strong>Location:</strong> ${payload.customer.city}, ${payload.customer.country_region}</li>
        </ul>
        
        <h3>Selection Summary:</h3>
        <ul>
            <li><strong>Brand:</strong> ${payload.selections.brandLabel || payload.selections.brand || 'N/A'}</li>
            <li><strong>Model:</strong> ${payload.selections.model || 'N/A'}</li>
            <li><strong>Battery Capacity:</strong> ${payload.selections.batteryCapacity || 'N/A'}</li>
            <li><strong>Forklift Count:</strong> ${payload.selections.forkliftCount || 'N/A'}</li>
            <li><strong>Daily Shifts:</strong> ${payload.selections.dailyShifts || 'N/A'}</li>
            <li><strong>Environment:</strong> ${payload.selections.usageEnvironment || 'N/A'}</li>
        </ul>
        
        <p>Please find the detailed quote request form attached as a PDF.</p>
    `;

    const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: recipientEmails,
        cc: payload.customer.email,
        subject: emailSubject,
        html: emailBody,
        attachments: [
            {
                filename: `quote-request-${payload.customer.full_name.replace(/\s+/g, '-')}-${Date.now()}.pdf`,
                content: pdfBuffer,
            },
        ],
    });

    if (result.error) {
        throw new Error(`Failed to send email: ${result.error.message}`);
    }

    return { id: result.data?.id || 'unknown' };
}
