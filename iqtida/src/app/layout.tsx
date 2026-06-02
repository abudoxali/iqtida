import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import "@fontsource-variable/playpen-sans-arabic";
import "@fontsource-variable/playpen-sans-arabic/wght.css";

export const metadata: Metadata = {
  title: "اقتداء - يومك على هدي النبي ﷺ",
  description: "تطبيق يساعدك على معرفة ما ثبت عن النبي ﷺ في مواقف يومك، وتطبيق السنن الصحيحة خطوة بخطوة مع الدليل والمصدر.",
  keywords: ["إسلام", "سنة", "نبي", "هدي", "اقتداء", "حديث", "صحيح"],
  openGraph: {
    title: "اقتداء - يومك على هدي النبي ﷺ",
    description: "تطبيق يساعدك على معرفة ما ثبت عن النبي ﷺ في مواقف يومك",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full" suppressHydrationWarning>
      <body className="min-h-full font-arabic antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
