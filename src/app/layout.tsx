import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL("https://www.woori.today"),title:{default:"퀴즈테스트 | woori.today",template:"%s | woori.today Quiz"},description:"상식, 지리, 과학, 수학 퀴즈와 두뇌 테스트를 즐겨보세요.",icons:{icon:"/_assets/quiz/icon.png",apple:"/_assets/quiz/apple-icon.png"},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>;}
