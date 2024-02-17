import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useRouter } from 'next/router'
import SystemLayout from '../resources/layouts/SystemLayout'
import clientSideEmotionCache from '../mui/clientSideEmotionCache'
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../resources/theme';
import { QueryClientProvider ,Hydrate, QueryClient} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'


const clientEmotionCache = clientSideEmotionCache();
function MyApp({ Component, pageProps }: AppProps) {

    const [queryClient] = useState(() => new QueryClient({
            defaultOptions : {
                queries : {
                    cacheTime : 1000 * 60 * 60 * 2, // 2 horus
                    refetchOnWindowFocus : false
                }
            }
        })
    )
    const { session } = pageProps
  const router = useRouter()
  const isPrivateRoute = router.pathname.startsWith("/app")
  const emotionCache = clientEmotionCache
   // Create a client
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ReactQueryDevtools initialIsOpen={false} />
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {
                (() =>
                isPrivateRoute ?
                <SystemLayout>
                  <Component {...pageProps} />
                </SystemLayout>
                : <Component {...pageProps} />
                )()
              }
            </ThemeProvider>
          </CacheProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
