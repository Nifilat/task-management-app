"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { store } from "@/store/store";
import { listenToAuth } from "@/store/authSlice";
import { useAppDispatch } from "@/hooks";

function InitAuth() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(listenToAuth());
  }, [dispatch]);
  return null;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <InitAuth />
        {children}
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
}
