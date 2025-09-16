'use client';

import { type PropsWithChildren, useEffect } from 'react';
import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { ErrorBoundary } from '@/components/Error/ErrorBoundary';
import { ErrorPage } from '@/components/Error/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';
import { setLocale } from '@/core/i18n/locale';

import './index.css';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { MobileBottomNav } from '../MobileBottomNav';


function RootInner({ children }: PropsWithChildren) {
  const lp = useLaunchParams(); // lp.tgWebAppPlatform ['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'

  const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);

  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.language_code);
  }, [initDataUser]);

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      {children}
      <MobileBottomNav />

    </TonConnectUIProvider>
  );
}

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();
  const isLoading = useTelegramAuth()

  return didMount && !isLoading ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">Loading...</div>
  );
}
