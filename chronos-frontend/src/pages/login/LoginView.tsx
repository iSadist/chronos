import React, { useState } from 'react'
import Loader from "react-spinners/PulseLoader"
import Link from 'next/link'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'

import styles from './LoginView.module.css'

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '', // Your user pool id here
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID || '', // Your client id here
}

const userPool = new CognitoUserPool(poolData)

function LoginView() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    })

    const userData = {
      Username: username,
      Pool: userPool,
    }

    const cognitoUser = new CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        setLoading(false)

        const token = result.getIdToken().getJwtToken()
        const username = result.getIdToken().payload['cognito:username']
        storeUserId(username)
        storeAccessToken(token)

        if (typeof window !== "undefined") {
          window.location.href = '/'
        }
      },
      onFailure: (err) => {
        console.error('Error signing in', err)
        setLoading(false)
        setError(err.message)
      },
    })
  }

  function storeAccessToken(token: string) {
    localStorage.setItem('accessToken', token)
  }

  function storeUserId(userId: string) {
    localStorage.setItem('userId', userId)
  }

  return (
    <div className={styles.background}>
      <form className={styles.container} onSubmit={handleSignIn}>
        <h1 className={styles.title}>Sign In</h1>
        <input
          className={styles.field}
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.field}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={loading} className={styles.signin}>{loading ? <Loader color='white' /> : 'Sign In'}</button>
        {error && <p className={styles.error}>{error}</p>}
        <Link href="/reset-password" className={styles.link}>
          Forgot your password?
        </Link>
        <div className={styles.signup}>
          <Link href="/signup" className={styles.link}>
            {"Don't have an account? Sign up"}
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginView