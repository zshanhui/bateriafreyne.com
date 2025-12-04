# Quote Request PDF Email System

## Overview

The Quote Request PDF Email System is a backend workflow that automatically processes quote requests from the Forklift Battery Selection form, generates a branded PDF document, and emails it to configured recipients using Trigger.dev and Resend.

## Architecture

### Components

1. **Frontend Component** (`components/custom/forklift-battery-selection.tsx`)
   - Multi-step form for collecting forklift battery selection and customer details
   - Submits data to the API route via POST request
   - Shows loading states and success/error notifications using Sonner

2. **API Route** (`app/api/quote-request/route.ts`)
   - Receives POST requests from the frontend
   - Validates incoming data structure
   - Triggers the Trigger.dev task asynchronously
   - Returns immediate response with task handle

3. **Trigger.dev Task** (`src/trigger/quote-request-tasks.ts`)
   - Processes the quote request data
   - Generates PDF using pdfkit
   - Sends email with PDF attachment via Resend
   - Handles errors and logging

## Data Flow

```
User fills form → Frontend submits → API Route → Trigger.dev Task → PDF Generation → Email Sent
```

### Step-by-Step Process

1. User completes the Forklift Battery Selection form with:
   - Forklift brand, model, and battery capacity
   - Quantity and usage requirements
   - Customer contact information

2. Frontend sends POST request to `/api/quote-request` with the form data

3. API route validates the data and triggers the Trigger.dev task

4. Trigger.dev task (running asynchronously):
   - Generates a branded PDF document with all form data
   - Creates email with HTML summary and PDF attachment
   - Sends email to configured recipients (with customer CC'd)

5. User receives immediate feedback via toast notification

## PDF Generation

The PDF is generated using `pdfkit` and includes:

- **Header**: "Quote Request Form" title with branding
- **Customer Information Section**: All customer contact details
- **Forklift Selection Details**: Brand, model, capacity, quantity, shifts, environment
- **Additional Comments**: Any special requests or notes
- **Footer**: Timestamp of generation

The PDF uses a professional layout with:
- Structured sections with clear headings
- Consistent typography and spacing
- Brand colors (slate grays and indigo accents)

## Email Configuration

### Recipients

- **Primary Recipients**: Configured via `QUOTE_REQUEST_RECIPIENT_EMAILS` environment variable (comma-separated) in trigger.dev admin
- **CC Recipient**: Customer's email address (automatically included)

### Email Content

The email includes:
- **Subject**: "New Quote Request from [Customer Name]"
- **HTML Body**: Formatted summary of all form data
- **Attachment**: Generated PDF document

### Email Service

Uses [Resend](https://resend.com) for reliable email delivery. The `from` address can be configured via `RESEND_FROM_EMAIL` environment variable.

## Environment Variables

Required environment variables:

```bash
# Resend API Key (required)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Recipient emails (required, comma-separated)
QUOTE_REQUEST_RECIPIENT_EMAILS=sales@example.com,admin@example.com

# From email address (optional, defaults to onboarding@resend.dev)
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Development

### Running Trigger.dev Locally

To test the Trigger.dev tasks locally:

```bash
pnpm trigger:dev
```

This will start the Trigger.dev development server and allow you to see task executions in real-time.

### Testing the Flow

1. Start the Next.js dev server: `pnpm dev`
2. Start Trigger.dev dev server: `pnpm trigger:dev`
3. Fill out the Forklift Battery Selection form
4. Submit the form
5. Check Trigger.dev dashboard for task execution
6. Verify email delivery in Resend dashboard

## Error Handling

The system includes comprehensive error handling:

- **Frontend**: Shows user-friendly error messages via toast notifications
- **API Route**: Validates data and returns appropriate HTTP status codes
- **Trigger.dev Task**: Logs errors and throws exceptions for retry handling
- **Email Sending**: Validates environment variables and handles API errors

## Monitoring

- **Trigger.dev Dashboard**: Monitor task executions, retries, and logs
- **Resend Dashboard**: Track email delivery status and bounces
- **Application Logs**: Check server logs for API route errors

## Future Enhancements

Potential improvements:

- Add email templates with more branding
- Store quote requests in a database
- Add webhook notifications
- Support multiple PDF formats
- Add quote request status tracking
- Implement rate limiting

