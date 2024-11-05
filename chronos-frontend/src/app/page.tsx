'use client'

import React from "react"
import MainView from "@/components/MainView"

export default function Home() {
  if (typeof window !== "undefined") {
    // Check if there is a token and user id in local storage
    const accessToken = localStorage.getItem("accessToken")
    const userId = localStorage.getItem("userId")
  
    if (!accessToken || !userId) {
      // Navigate to login page if not logged in
      window.location.href = "/login"
    }
  }

  return <MainView />
}
