

export interface GatewayApiProps {
  url: string | undefined;
  method: string | undefined;
  data?: unknown;
  headers: Headers;
  params?: unknown;
  telegramUserId?: string | undefined;
  responseType?: XMLHttpRequestResponseType;
}
