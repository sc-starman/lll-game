import { NextRequest, NextResponse } from 'next/server';
import { isValid, parse } from '@telegram-apps/init-data-node';
import { getIronSession } from 'iron-session';
import { getSession, TelegramSession } from '@/utils/getSession';

const sessionOptions = {
  cookieName: 'tg_session',
  password: process.env.IRON_SESSION_PASSWORD!,   // <-- must be defined & >= 32 chars
  cookieOptions: {
    secure: true,
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function POST(req: NextRequest) {
  const { initData } = await req.json();

  if (!initData) {
    return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
  }

  const ok = isValid(initData, process.env.TELEGRAM_BOT_TOKEN!);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid initData' }, { status: 401 });
  }

  const data = parse(initData); // { user, chat, auth_date, ... }
  // find-or-create your user in DB with data.user.id (number)
  // const userId = await upsertUser(data.user)


  try {
    const res = await fetch(`${process.env.API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({
        initData: initData
      })
    });
    const result = await res.json();
    
    if (!res.ok || result.success) {
      // create user
    }
  } catch (error) {
    console.log({ error });
  }

  // create/update session
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<TelegramSession>(
    req,
    res,
    sessionOptions
  );

  if (data === undefined || data?.user === undefined) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }
  session.userId = data.user.id;
  session.tg = { user: data.user, chat: data.chat, auth_date: data.auth_date };
  session.profile = {
    username: data.user.username,
    first_name: data.user.first_name,
    last_name: data.user.last_name,
    photo_url: data.user.photo_url,
  }

  await session.save();
  return res;
}


export async function GET(req: NextRequest) {
  const session = await getSession(req)
  return NextResponse.json({ profile: session.profile }, { status: 200 });
}
