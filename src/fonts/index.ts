import { Hind_Siliguri } from "next/font/google";
import localFont from "next/font/local";

const hindShiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hind-shiliguri",
});

const solaimanLipi = localFont({
  src: [
    {
      path: "../../public/fonts/SolaimanLipi.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-solaiman-lipi",
  display: "swap",
  fallback: ["sans-serif"],
});

export { hindShiliguri, solaimanLipi };
