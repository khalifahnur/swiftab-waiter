import Toast from "react-native-toast-message";

/** Short messages at the top of the screen. */
export const notify = {
  success: (title: string, detail?: string) => Toast.show({ type: "success", text1: title, text2: detail }),
  error: (title: string, detail?: string) => Toast.show({ type: "error", text1: title, text2: detail }),
};
