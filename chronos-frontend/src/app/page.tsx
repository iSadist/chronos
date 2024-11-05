'use client'

import React, { useState } from "react"
import LoginView from "@/components/LoginView"
import MainView from "@/components/MainView"

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return (
      <LoginView onLogin={() => {
        setLoggedIn(true)
      }} />
    )
  }

  return <MainView />
}
