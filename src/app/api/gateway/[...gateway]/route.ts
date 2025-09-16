import { getSession } from "@/utils/getSession";
import { serverSideApi } from "@/utils/serverSideApi.utils";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type DataWithStatus = { status?: number;[key: string]: unknown };

const handleRequest = async (req: NextRequest) => {
  const session = await getSession(req);
  
  if (!session)
    return NextResponse.json("User Should be signed out!!!", { status: 401 });

  try {
    const headerList = await headers();

    const responseType = headerList.get("response-type") as XMLHttpRequestResponseType;

    let body = null;
    if (req.body) {
      try {
        //@ts-ignore
        body = await req.json();
      } catch { }
    }

    
    const result = await serverSideApi({
      url: req.url?.slice(req.url?.indexOf("gateway") + 7),
      method: req.method,
      data: body,
      headers: req.headers,
      responseType: responseType === "blob" ? "arraybuffer" : responseType,
      telegramUserId: session.userId ? String(session.userId) : undefined,
    });

    if ((responseType === "blob" || responseType === "arraybuffer") && result.data instanceof ArrayBuffer) {
      return NextResponse.json({ error: "Invalid response type" }, {
        status: 500,
      });
    }

    const dataWithStatus = result.data as DataWithStatus;

    return NextResponse.json(dataWithStatus, {
      status: result.status || dataWithStatus.status || 200,
    });
  } catch (err: unknown) {
    console.log({ err });

    const error = err as { status?: number;[key: string]: unknown };
    return NextResponse.json(error, { status: error.status ?? 500 });
  }
};

export const GET = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
