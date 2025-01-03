import './globals.css'
import { Inter } from 'next/font/google'
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Flashcard and Quiz ',
  description: 'Generated by Sanket Shinde',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>    
        <CopilotKit runtimeUrl="/api/copilotkit">
        {children}
        <footer className="fixed bottom-0 left-0 right-0 bg-tranparent text-white py-4 text-center  z-10">
            <p>Made by <a href="https://github.com/sanketshinde3001" target='blank' className='text-blue-400 cursor-pointer'>Sanket Shinde</a></p>
          </footer>
      </CopilotKit> </body>
    </html>
  )
}
