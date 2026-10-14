import { Nunito } from "next/font/google";

// Heavy, rounded geometric sans for figure numerals and labels.
export const essayFont = Nunito({
  variable: "--font-essay",
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});
