import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Resource } from 'sst';
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client();

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'] as File;

  if (!file) {
    return c.text('No file provided', 400);
  }

  const params = {
    Bucket: Resource.MyBucket.name,
    ContentType: file.type,
    Key: file.name,
    Body: file,
  };
  const upload = new Upload({
    params,
    client: s3,
  });
  await upload.done();

  return c.json({
    message: 'File uploaded successfully.',
  });
});

app.get('/latest', async (c) => {
  const objects = await s3.send(
    new ListObjectsV2Command({
      Bucket: Resource.MyBucket.name,
    })
  );

  if (!objects.Contents || objects.Contents.length === 0) {
    return c.text('No files found', 404);
  }

  const latestFile = objects.Contents.sort(
    (a, b) =>
      (b.LastModified?.getTime() ?? 0) -
      (a.LastModified?.getTime() ?? 0)
  )[0];
  const command = new GetObjectCommand({
    Key: latestFile.Key,
    Bucket: Resource.MyBucket.name,
  });

  const latestUpdate = await getSignedUrl(s3, command);

  return c.json({
    latestUpdate,
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
