import { useEffect, useState } from 'react';
import { useSignal } from '@telegram-apps/sdk-react';
import { initDataRaw as _initDataRaw } from '@telegram-apps/sdk-react';

export function useTelegramAuth() {
  const initDataRaw = useSignal(_initDataRaw);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!initDataRaw) return;
    fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // include credentials so the session cookie is set/used
      credentials: 'include',
      body: JSON.stringify({ initData: initDataRaw }),
    }).then(a => setLoading(false)).catch(() => { });
  }, [initDataRaw]);

  return loading;
}