import { z } from "zod";

export async function fetchAndParse<S extends z.ZodType>(
  url: string,
  schema: S,
  options?: RequestInit,
): Promise<z.infer<S>> {
  const res = await fetch(url, { ...options, cache: "no-store" });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  const json = await res.json();

  const result = schema.safeParse(json);

  if (!result.success) {
    console.error(result.error);
    throw new Error("Invalid API response");
  }

  return result.data;
}

export const apiGet = fetchAndParse;

export async function apiPost<Req extends z.ZodType, Res extends z.ZodType>(
  url: string,
  reqSchema: Req,
  resSchema: Res,
  body: z.infer<Req>,
): Promise<z.infer<Res>> {
  // Validate requests
  const validBody = reqSchema.parse(body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validBody),
  });

  if (!res.ok) {
    handleErrorResponse(res);
  }

  const json = await res.json();
  return resSchema.parse(json);
}

export async function apiPut<Req extends z.ZodType, Res extends z.ZodType>(
  url: string,
  reqSchema: Req,
  resSchema: Res,
  body: z.infer<Req>,
): Promise<z.infer<Res>> {
  // Validate requests
  const validBody = reqSchema.parse(body);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validBody),
  });

  if (!res.ok) {
    handleErrorResponse(res);
  }

  const json = await res.json();
  return resSchema.parse(json);
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
}

export async function apiDeleteResponse<S extends z.ZodType>(
  url: string,
  schema: S,
): Promise<z.infer<S>> {
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  const json = await res.json();
  return schema.parse(json);
}

export async function apiPostNoContent<Req extends z.ZodType>(
  url: string,
  reqSchema: Req,
  body: z.infer<Req>,
): Promise<void> {
  const validBody = reqSchema.parse(body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validBody),
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
}

// Better error handling for put and post since the backend api uses structured errors
export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string>;
};

async function handleErrorResponse(response: Response): Promise<never> {
  let errors: Record<string, string> | undefined;

  try {
    const body = await response.json();
    errors = body.errors;
  } catch {
    // il body non era json skippa
  }

  const err = new Error(`HTTP error ${response.status}`) as Error & {
    apiError: ApiError;
  };
  err.apiError = { status: response.status, message: err.message, errors };
  throw err;
}
