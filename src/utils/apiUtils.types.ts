
import { IncomingHttpHeaders } from "http2";

export interface GatewayApiProps {
  url: string | undefined;
  method: string | undefined;
  data?: unknown;
  headers?: IncomingHttpHeaders;
  params?: unknown;
  telegramUserId?: string | undefined;
  responseType?: XMLHttpRequestResponseType;
}
