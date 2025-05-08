import { Exo_2 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "@/components/shared/CartContext";

export const metadata = {
  title: {
    default: "HOK TOK",
    template: "%s | Car Doctor",
  },
  description: "HOK TOK",
};

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-exo-2",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={exo2.variable}>
      <body className={exo2.variable}>
        <CartProvider>
          <Navbar className={exo2.variable} />
          {children}
          <Footer className={exo2.variable} />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CartProvider>
      </body>
    </html>
  );
}