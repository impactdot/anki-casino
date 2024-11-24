// "use client";

// import "./globals.css";
// import { TonConnectUIProvider } from "@tonconnect/ui-react";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <title>TON Connect Demo</title>
//       </head>
//       <body>
//         <TonConnectUIProvider manifestUrl="https://emerald-abundant-panther-380.mypinata.cloud/ipfs/QmTVotRe7A4RrPvvH2YZZPjQhvXmeAJXNBjy4bJ3cmxqxd">
//           {children}
//         </TonConnectUIProvider>
//       </body>
//     </html>
//   );
// }
"use client";

import "./globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>TON Connect Demo</title>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TonConnectUIProvider manifestUrl="https://emerald-abundant-panther-380.mypinata.cloud/ipfs/QmTVotRe7A4RrPvvH2YZZPjQhvXmeAJXNBjy4bJ3cmxqxd">
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
