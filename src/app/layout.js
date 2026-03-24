import "./globals.css";
import Providers from "./provider.js";

export const metadata = {
  title: "Warehouse AI",
  description: "Warehouse Management System",
  icons: {
    icon: "/favicon.png", // Explicitly using the new PNG
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}