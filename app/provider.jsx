"use client"
import React from 'react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

function Provider({children}) {
  return (
    <div>
      <NextThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemeProvider>
    </div>
  );
}

export default Provider
