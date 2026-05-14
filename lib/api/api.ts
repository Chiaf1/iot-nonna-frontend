import { z } from "zod";

export async function fetchAndParse<S extends z.ZodType>(
  url: string,
  schema: S,
  options?: RequestInit,
): Promise<z.infer<S>> {
  const res = await fetch(url, options);

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
    throw new Error(`HTTP error ${res.status}`);
  }

  const json = await res.json();

  return resSchema.parse(json);
}
