import { Hind_Siliguri, Poppins } from "next/font/google";
import localFont from "next/font/local";

const hindShiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hind-shiliguri",
});

const solaimanLipi = localFont({
  src: [
    {
      path: "./fontfiles/SolaimanLipi.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-solaiman-lipi",
  display: "swap",
  fallback: ["sans-serif"],
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export { hindShiliguri, poppins, solaimanLipi };
