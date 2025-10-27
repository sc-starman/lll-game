'use client';

import { type PropsWithChildren, useEffect } from 'react';
import {
  initData,
  // miniApp,
  // useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ProgressProvider } from '@bprogress/next/app';

import { ErrorBoundary } from '@/components/Error/ErrorBoundary';
import { ErrorPage } from '@/components/Error/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';
import { setLocale } from '@/core/i18n/locale';

import './index.css';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { MobileBottomNav } from './MobileBottomNav';
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from './LoadingSplash';
import TelegramAnalytics from '@telegram-apps/analytics'
import { ProfileProvider } from '@/contexts/ProfileContext';


function RootInner({ children }: PropsWithChildren) {
  TelegramAnalytics.init({
    token: 'eyJhcHBfbmFtZSI6ImxsbF9sb3NzbGVzc19sb3R0ZXJ5X29uX3RvbiIsImFwcF91cmwiOiJodHRwczovL3QubWUvbGxsX3NwYWNlX2JvdCIsImFwcF9kb21haW4iOiJodHRwczovL3BsYXkubGxsLnNwYWNlIn0=!2qBYE2sXLAMg1iEnHvRDfiva13xIoMJCvfccdxvX5Gs=',
    appName: 'lll_lossless_lottery_on_ton',
  });

  // const lp = useLaunchParams(); // lp.tgWebAppPlatform ['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'

  // const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);
  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.language_code);
  }, [initDataUser]);

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <Sonner />
        <ProfileProvider>
          {children}
          <MobileBottomNav />
        </ProfileProvider>
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
    <ProgressProvider
      height="2px"
      color="#fffd00"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <ErrorBoundary fallback={ErrorPage}>
        <RootInner {...props} />
      </ErrorBoundary>
    </ProgressProvider>
  ) : (
    <SplashScreen />
  );
}
