import './globals.css'

export const metadata = {
  title: 'Reflexionsfragen: Vibe Coding',
  description: 'Ein Online-Fragebogen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
