import "tailwindcss/tailwind.css";
import "../styles/schedule.css";
import "../components/AddEventFloating/styles.css";

import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
