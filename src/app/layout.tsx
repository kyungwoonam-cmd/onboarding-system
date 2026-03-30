import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '신규입사자 온보딩 관리',
  description: '신규입사자 온보딩 관리 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  )
}