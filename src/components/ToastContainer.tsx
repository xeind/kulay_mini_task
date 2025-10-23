import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { useTheme } from "../hooks/useTheme";

export function ToastContainer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: isDark ? "#10b981" : "#059669",
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          borderLeftWidth: 5,
        }}
        text1Style={{
          color: isDark ? "#fafaf9" : "#1c1917",
          fontSize: 16,
          fontWeight: "600",
        }}
        text2Style={{
          color: isDark ? "#a8a29e" : "#57534e",
          fontSize: 14,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#ea580c",
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          borderLeftWidth: 5,
        }}
        text1Style={{
          color: isDark ? "#fafaf9" : "#1c1917",
          fontSize: 16,
          fontWeight: "600",
        }}
        text2Style={{
          color: isDark ? "#a8a29e" : "#57534e",
          fontSize: 14,
        }}
      />
    ),
  };

  return <Toast config={toastConfig} />;
}
