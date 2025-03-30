# AWS Hono Container

A serverless application using Hono and SST for AWS S3 file management.

## Description

This project provides a simple API for uploading files to an AWS S3 bucket and retrieving the latest uploaded file. It's built with:

- [Hono](https://hono.dev/) - Lightweight web framework
- [SST](https://sst.dev/) - Infrastructure as code for AWS resources
- AWS S3 for file storage

## Prerequisites

- Node.js (v18 or later)
- AWS account and configured credentials
- SST CLI (for deployment)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Local Development

Run the local development server:

```bash
npm run dev
```

The server will be available at <http://localhost:3000>

## API Endpoints

### `GET /`

Returns a simple hello message.

### `POST /`

Uploads a file to the S3 bucket.

**Request:**

- Content-Type: `multipart/form-data`
- Body: Form data with a `file` field

**Response:**

- 200: JSON with success message
- 400: Error if no file provided

### `GET /latest`

Retrieves a signed URL for the most recently uploaded file.

**Response:**

- 200: JSON with the latest file URL
- 404: Error if no files found

## Deployment

To deploy to AWS:

```bash
npx sst deploy
```

## License

MIT

```
open http://localhost:3000
```
