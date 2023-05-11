import {ReactNode} from 'react'

export const metadata = {
  title: 'React Hook-Form + Zod'
}

export default function RootLayout({ children }: { children:ReactNode; }) {
  return (
    <html lang="pt">
      <head/>
      <body className='bg-gray-900 h-auto'>{children}</body>
    </html>
  );
}