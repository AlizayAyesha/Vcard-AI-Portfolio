'use client'

import dynamicImport from 'next/dynamic'

export const dynamic = 'force-dynamic'

export default function Page() {
  const Home = dynamicImport(() => import('./Home'), { ssr: false })

  return <Home />
}
