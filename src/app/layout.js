// src/app/layout.js
import "./globals.css";
import NetflixLoader from "../../components/NetflixLoader"; // corrected import path

export const metadata = {
  title: "Online Exam Platform",
  description: "An exam platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NetflixLoader />
        {children}
      </body>
    </html>
  );
}
