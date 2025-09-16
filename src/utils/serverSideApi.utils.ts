import { GatewayApiProps } from "./apiUtils.types";

type NextFetchOptions = {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;
};

export async function serverSideApi<T = unknown>({
  method = "GET",
  url,
  data,
  headers,
  params,
  responseType = "json",
  nextOptions,
  telegramUserId = undefined,
}: GatewayApiProps & {
  nextOptions?: NextFetchOptions;
}): Promise<{ data: T; status: number }> {
  if (!url) throw new Error("BAD REQUEST!");

  const baseUrl = process.env.API_URL || "";

  const fullUrl = new URL(`${baseUrl}${url}`)


  if (params && typeof params === "object") {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fullUrl.searchParams.append(key, String(value));
      }
    });
  }

  headers.append("telegram_id", `${telegramUserId}`);

  try {
    const res = await fetch(fullUrl.toString(), {
      method,
      headers: headers,
      body: ["GET", "HEAD"].includes(method.toUpperCase())
        ? undefined
        : JSON.stringify(data),
      ...nextOptions,
    });
    if (!res.ok) {

      const result = await res.json().catch(() => ({}));
      throw {
        ...result,
        status: res.status,
        message: result?.message || "API error",
      };
    }

    const parsedResponse = await parseResponse<T>(responseType, res);

    return { data: parsedResponse, status: res.status };
  } catch (err) {
    if (
      (err instanceof DOMException && err.name === "AbortError") || // browser fallback
      (err as any)?.code === "ETIMEDOUT" // Node.js timeout error
    ) {
      throw { status: 408, message: "Request timeout" };
    }
    throw err;
  }
}

async function parseResponse<T>(responseType: XMLHttpRequestResponseType, res: Response): Promise<T> {
  try {
    switch (responseType) {
      case "blob":
        return await res.blob() as T;
      case "arraybuffer":
        return await res.arrayBuffer() as T;
      case "text":
        return await res.text() as T;
      default:
        return await res.json() as T;
    }
  } catch {
    return {} as T
  }
}
