import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL("https://woori.today/quiz"),title:{default:"퀴즈테스트 | woori.today",template:"%s | woori.today Quiz"},description:"상식, 지리, 과학, 수학 퀴즈와 두뇌 테스트를 즐겨보세요.",robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>;}
