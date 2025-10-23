import "./global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/context/ThemeContext";
import { CartProvider } from "./src/context/CartContext";
import { CartScreen } from "./src/components/CartScreen";
import { ToastContainer } from "./src/components/ToastContainer";

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <ThemeProvider>
        <CartProvider>
          <CartScreen />
        </CartProvider>
        <ToastContainer />
      </ThemeProvider>
    </SafeAreaView>
  );
}
