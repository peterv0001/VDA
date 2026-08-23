const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const ILLUSTRATED_BOOK_OBJECT_NAME =
  "velocity-os/illustrated-operating-system-v3-1.pdf";

type SignedObjectMethod = "GET" | "HEAD";

function getIllustratedBookObjectLocation(): {
  bucketName: string;
  objectName: string;
} {
  const privateObjectDir = process.env["PRIVATE_OBJECT_DIR"]?.trim();
  if (!privateObjectDir) {
    throw new Error("PRIVATE_OBJECT_DIR is not configured");
  }

  const parts = privateObjectDir
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean);
  const bucketName = parts.shift();
  if (!bucketName) {
    throw new Error("PRIVATE_OBJECT_DIR is invalid");
  }

  return {
    bucketName,
    objectName: [...parts, ILLUSTRATED_BOOK_OBJECT_NAME].join("/"),
  };
}

async function createSignedObjectUrl(
  method: SignedObjectMethod,
  ttlSeconds: number,
): Promise<string> {
  const { bucketName, objectName } = getIllustratedBookObjectLocation();
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket_name: bucketName,
        object_name: objectName,
        method,
        expires_at: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
      }),
      signal: AbortSignal.timeout(30_000),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Could not create illustrated-book storage authorization (${response.status})`,
    );
  }

  const data = (await response.json()) as { signed_url?: unknown };
  if (typeof data.signed_url !== "string" || !data.signed_url) {
    throw new Error("Illustrated-book storage authorization was missing its URL");
  }

  return data.signed_url;
}

export async function isVelocityOsIllustratedBookAvailable(): Promise<boolean> {
  const url = await createSignedObjectUrl("HEAD", 60);
  const response = await fetch(url, {
    method: "HEAD",
    signal: AbortSignal.timeout(30_000),
  });
  return response.ok;
}

export async function fetchVelocityOsIllustratedBook(
  range?: string,
): Promise<Response> {
  const url = await createSignedObjectUrl("GET", 120);
  return fetch(url, {
    headers: range ? { Range: range } : undefined,
    signal: AbortSignal.timeout(30_000),
  });
}