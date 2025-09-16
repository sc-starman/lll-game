import { getIronSession } from 'iron-session';
import { NextRequest } from 'next/server';


export async function getSession(req: NextRequest) {
  return getIronSession<TelegramSession>(
    req,
    { /* dummy Response not needed when reading in RSC */ } as any,
    {
      cookieName: 'tg_session',
      password: process.env.IRON_SESSION_PASSWORD!,   // <-- must be defined & >= 32 chars
    }
  );
}


export interface TelegramSession {
  userId: number;
  tg: {
    user: any;
    chat: any;
    auth_date: Date;
  };
  profile: TelegramProfile
}

export interface TelegramProfile {
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
}