"use client";

// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import styles from './page.module.css'
import { usePathname, useRouter } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Customer Churn",
//   description: "Predict customer churn",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let path: string|null = usePathname()
  let user: string|null = null
  let route: any = useRouter()

  try{
    user = localStorage.getItem('session')
  }catch(error){
    console.log(error)
  }

  const logout = (e: any)=>{
    localStorage.removeItem('session')
    route.push('/')
  }
  
  return (
    <html lang="en">
      <body className={`container text-center bg-img ${geistSans.variable} ${geistMono.variable}`}>
      <div className={`${styles.header} h-auto w-100 border rounded-1 d-flex flex-row-reverse align-items-center justify-content-between mt-2 my-1 bg-dark bg-gradient bg-opacity-25`}>
        <div className="d-flex flex-row mx-2 p-2 my-1 mx-2 align-items-end">
        {
          !user ?
          <>
            {path != '/login'? <Link href={'/login'} className="p-2 mx-1 my-1 bg-white bg-gradient bg-opacity-50 rounded">Signin</Link> : <></>}
            {path != '/join'? <Link href={'/join'} className="p-2 mx-1 my-1 bg-white bg-gradient bg-opacity-50 rounded">Signup</Link> : <></>}
          </>
          :
          <>
            <Link href={'/'} className="p-2 mx-1 my-1 bg-white bg-gradient bg-opacity-50 rounded" onClick={logout}>Logout</Link>
          </>
        }
        </div>
        <div className="d-flex p-2 mx-2 text-center text-white fs-5 fw-bolder"><Link href={'/'} className="p-2 mx-1 my-1 rounded" onClick={logout}>GlobalTel</Link></div>
      </div>
        {children}
      </body>
    </html>
  );
}
