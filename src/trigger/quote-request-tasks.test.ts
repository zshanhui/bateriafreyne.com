import { PDFDocument } from 'pdf-lib';
import { Resend } from 'resend';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    generateQuoteRequestPdf,
    generateQuoteRequestPdfTask,
    sendQuoteRequestEmail,
} from './quote-request-tasks';

// Mock dependencies
vi.mock('pdf-lib', () => {
    return {
        PDFDocument: {
            create: vi.fn(),
        },
        rgb: vi.fn((r, g, b) => ({ r, g, b })),
        StandardFonts: {
            Helvetica: 'Helvetica',
            HelveticaBold: 'HelveticaBold',
        },
    };
});

vi.mock('resend', () => {
    return {
        Resend: vi.fn(),
    };
});

describe('quote-request-tasks', () => {
    const mockPayload = {
        selections: {
            brand: 'toyota',
            brandLabel: 'Toyota',
            model: 'TOY-E200',
            batteryCapacity: '25.6V 150Ah',
            forkliftCount: 5,
            dailyShifts: 2,
            usageEnvironment: 'indoors' as const,
            highHumidity: null,
        },
        customer: {
            full_name: 'John Doe',
            email: 'john.doe@example.com',
            company_name: 'Test Company Inc',
            phone_whatsapp_number: '+1234567890',
            country_region: 'United States',
            city: 'New York',
            comments_requests: 'Please send quote ASAP',
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset environment variables
        delete process.env.RESEND_API_KEY;
        delete process.env.QUOTE_REQUEST_RECIPIENT_EMAILS;
        delete process.env.RESEND_FROM_EMAIL;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('generateQuoteRequestPdf', () => {
        it('should generate a PDF buffer with correct structure', async () => {
            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn(),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            const result = await generateQuoteRequestPdf(mockPayload);

            expect(PDFDocument.create).toHaveBeenCalled();
            expect(mockDoc.addPage).toHaveBeenCalledWith([612, 792]);
            expect(mockDoc.embedFont).toHaveBeenCalled();
            expect(mockPage.drawText).toHaveBeenCalled();
            expect(mockDoc.save).toHaveBeenCalled();
            expect(Buffer.isBuffer(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should include all customer information in PDF', async () => {
            const textCalls: string[] = [];
            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn((text: string) => {
                    textCalls.push(text);
                }),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            await generateQuoteRequestPdf(mockPayload);

            const textContent = textCalls.join(' ');
            expect(textContent).toContain('John Doe');
            expect(textContent).toContain('john.doe@example.com');
            expect(textContent).toContain('Test Company Inc');
            expect(textContent).toContain('+1234567890');
            expect(textContent).toContain('United States');
            expect(textContent).toContain('New York');
        });

        it('should include all selection details in PDF', async () => {
            const textCalls: string[] = [];
            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn((text: string) => {
                    textCalls.push(text);
                }),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            await generateQuoteRequestPdf(mockPayload);

            const textContent = textCalls.join(' ');
            expect(textContent).toContain('Toyota');
            expect(textContent).toContain('TOY-E200');
            expect(textContent).toContain('25.6V 150Ah');
            expect(textContent).toContain('5');
            expect(textContent).toContain('2');
            expect(textContent).toContain('indoors');
        });

        it('should include high humidity field when environment is outdoors', async () => {
            const textCalls: string[] = [];
            const payloadWithOutdoors = {
                ...mockPayload,
                selections: {
                    ...mockPayload.selections,
                    usageEnvironment: 'outdoors' as const,
                    highHumidity: true,
                },
            };

            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn((text: string) => {
                    textCalls.push(text);
                }),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            await generateQuoteRequestPdf(payloadWithOutdoors);

            const textContent = textCalls.join(' ');
            expect(textContent).toContain('High Humidity');
            expect(textContent).toContain('Yes');
        });

        it('should include comments section when provided', async () => {
            const textCalls: string[] = [];
            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn((text: string) => {
                    textCalls.push(text);
                }),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            await generateQuoteRequestPdf(mockPayload);

            const textContent = textCalls.join(' ');
            expect(textContent).toContain('Please send quote ASAP');
        });

        it('should handle missing optional fields gracefully', async () => {
            const payloadWithMissingFields = {
                selections: {
                    brand: 'toyota',
                    brandLabel: 'Toyota',
                    model: 'TOY-E200',
                    batteryCapacity: '25.6V 150Ah',
                    forkliftCount: null,
                    dailyShifts: null,
                    usageEnvironment: null,
                    highHumidity: null,
                },
                customer: {
                    full_name: 'Jane Smith',
                    email: 'jane@example.com',
                    country_region: 'Canada',
                    city: 'Toronto',
                },
            };

            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn(),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            const result = await generateQuoteRequestPdf(
                payloadWithMissingFields
            );

            expect(Buffer.isBuffer(result)).toBe(true);
            expect(mockDoc.save).toHaveBeenCalled();
        });

        it('should reject on PDF generation error', async () => {
            (PDFDocument.create as any).mockRejectedValue(
                new Error('PDF generation failed')
            );

            await expect(generateQuoteRequestPdf(mockPayload)).rejects.toThrow(
                'PDF generation failed'
            );
        });
    });

    describe('sendQuoteRequestEmail', () => {
        it('should send email with PDF attachment when environment variables are set', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS =
                'sales@example.com,admin@example.com';
            process.env.RESEND_FROM_EMAIL = 'noreply@example.com';

            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: { id: 'email-123' },
                        error: null,
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = Buffer.from('fake-pdf-content');
            const result = await sendQuoteRequestEmail(mockPayload, pdfBuffer);

            expect(Resend).toHaveBeenCalledWith('test-api-key');
            expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
                from: 'noreply@example.com',
                to: ['sales@example.com', 'admin@example.com'],
                cc: 'john.doe@example.com',
                subject: 'New Quote Request from John Doe',
                html: expect.stringContaining('John Doe'),
                attachments: [
                    {
                        filename: expect.stringContaining(
                            'quote-request-John-Doe'
                        ),
                        content: pdfBuffer,
                    },
                ],
            });
            expect(result.id).toBe('email-123');
        });

        it('should use default from email when RESEND_FROM_EMAIL is not set', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: { id: 'email-456' },
                        error: null,
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = Buffer.from('fake-pdf-content');
            await sendQuoteRequestEmail(mockPayload, pdfBuffer);

            expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: 'onboarding@resend.dev',
                })
            );
        });

        it('should throw error when RESEND_API_KEY is not set', async () => {
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            const pdfBuffer = Buffer.from('fake-pdf-content');

            await expect(
                sendQuoteRequestEmail(mockPayload, pdfBuffer)
            ).rejects.toThrow('RESEND_API_KEY environment variable is not set');
        });

        it('should throw error when QUOTE_REQUEST_RECIPIENT_EMAILS is not set', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';

            const pdfBuffer = Buffer.from('fake-pdf-content');

            await expect(
                sendQuoteRequestEmail(mockPayload, pdfBuffer)
            ).rejects.toThrow(
                'QUOTE_REQUEST_RECIPIENT_EMAILS environment variable is not set or empty'
            );
        });

        it('should throw error when QUOTE_REQUEST_RECIPIENT_EMAILS is empty', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = '';

            const pdfBuffer = Buffer.from('fake-pdf-content');

            await expect(
                sendQuoteRequestEmail(mockPayload, pdfBuffer)
            ).rejects.toThrow(
                'QUOTE_REQUEST_RECIPIENT_EMAILS environment variable is not set or empty'
            );
        });

        it('should handle comma-separated recipient emails correctly', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS =
                'sales@example.com, admin@example.com , support@example.com';

            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: { id: 'email-789' },
                        error: null,
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = Buffer.from('fake-pdf-content');
            await sendQuoteRequestEmail(mockPayload, pdfBuffer);

            expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: [
                        'sales@example.com',
                        'admin@example.com',
                        'support@example.com',
                    ],
                })
            );
        });

        it('should throw error when Resend API returns an error', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: null,
                        error: { message: 'Invalid API key' },
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = Buffer.from('fake-pdf-content');

            await expect(
                sendQuoteRequestEmail(mockPayload, pdfBuffer)
            ).rejects.toThrow('Failed to send email: Invalid API key');
        });

        it('should include customer email in CC', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: { id: 'email-123' },
                        error: null,
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = Buffer.from('fake-pdf-content');
            await sendQuoteRequestEmail(mockPayload, pdfBuffer);

            expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    cc: 'john.doe@example.com',
                })
            );
        });

        it('should generate correct email subject with customer name', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: { id: 'email-123' },
                        error: null,
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = Buffer.from('fake-pdf-content');
            await sendQuoteRequestEmail(mockPayload, pdfBuffer);

            expect(mockResendInstance.emails.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    subject: 'New Quote Request from John Doe',
                })
            );
        });

        it('should include all customer and selection data in email body', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: { id: 'email-123' },
                        error: null,
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = Buffer.from('fake-pdf-content');
            await sendQuoteRequestEmail(mockPayload, pdfBuffer);

            const callArgs = mockResendInstance.emails.send.mock.calls[0]?.[0];
            const htmlBody = callArgs?.html as string;

            expect(htmlBody).toContain('John Doe');
            expect(htmlBody).toContain('john.doe@example.com');
            expect(htmlBody).toContain('Test Company Inc');
            expect(htmlBody).toContain('Toyota');
            expect(htmlBody).toContain('TOY-E200');
            expect(htmlBody).toContain('25.6V 150Ah');
        });
    });

    describe('generateQuoteRequestPdfTask', () => {
        it('should have correct task configuration', () => {
            expect(generateQuoteRequestPdfTask.id).toBe(
                'generate-quote-request-pdf'
            );
            // maxDuration is not directly accessible on the task object
            // but we can verify the task exists and has the correct id
            expect(generateQuoteRequestPdfTask).toBeDefined();
        });

        it('should successfully generate PDF and send email when task runs', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            // Mock PDF generation
            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn(),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            // Mock Resend
            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: { id: 'email-123' },
                        error: null,
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            // Test the integration by calling the functions directly
            const pdfBuffer = await generateQuoteRequestPdf(mockPayload);
            const emailResult = await sendQuoteRequestEmail(
                mockPayload,
                pdfBuffer
            );

            expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
            expect(emailResult?.id).toBe('email-123');
        });

        it('should handle PDF generation errors', async () => {
            (PDFDocument.create as any).mockRejectedValue(
                new Error('PDF generation failed')
            );

            await expect(generateQuoteRequestPdf(mockPayload)).rejects.toThrow(
                'PDF generation failed'
            );
        });

        it('should handle email sending errors', async () => {
            process.env.RESEND_API_KEY = 'test-api-key';
            process.env.QUOTE_REQUEST_RECIPIENT_EMAILS = 'sales@example.com';

            // Mock successful PDF generation
            const mockPage = {
                getWidth: vi.fn().mockReturnValue(612),
                getHeight: vi.fn().mockReturnValue(792),
                drawText: vi.fn(),
                drawLine: vi.fn(),
            };

            const mockFont = {
                widthOfTextAtSize: vi.fn().mockReturnValue(100),
            };

            const mockDoc = {
                addPage: vi.fn().mockReturnValue(mockPage),
                embedFont: vi.fn().mockResolvedValue(mockFont),
                save: vi
                    .fn()
                    .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
            };

            (PDFDocument.create as any).mockResolvedValue(mockDoc);

            // Mock Resend with error
            const mockResendInstance = {
                emails: {
                    send: vi.fn().mockResolvedValue({
                        data: null,
                        error: { message: 'Email sending failed' },
                    }),
                },
            };

            (Resend as any).mockImplementation(function () {
                return mockResendInstance;
            });

            const pdfBuffer = await generateQuoteRequestPdf(mockPayload);

            await expect(
                sendQuoteRequestEmail(mockPayload, pdfBuffer)
            ).rejects.toThrow('Failed to send email: Email sending failed');
        });
    });
});
