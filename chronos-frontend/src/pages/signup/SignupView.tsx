import React, { useEffect, useState } from 'react'
import { CognitoUserPool } from 'amazon-cognito-identity-js'

import styles from './SignupView.module.css'

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '', // Your user pool id here
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID || '', // Your client id here
}

const userPool = new CognitoUserPool(poolData)

function SignupView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [valid, setValid] = useState(false)
  const [error, setError] = useState('')

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault()

    console.info('Sign up', password, email)

    userPool.signUp(email, password, [], [], (err, result) => {
        if (err) {
            console.error('Error signing up', err)
            setError(err.message)
            return
        }
        console.log('User signed up:', result)
        navigateToLogin()
        }
    )
  }

  function navigateToLogin() {
    window.location.href = '/login'
  }

  useEffect(() => {
    setValid(email.length > 0 && password.length > 0 && password === repeatPassword)
  }, [email, password, repeatPassword])

  return (
    <div className={styles.background}>
      <form className={styles.container} onSubmit={handleSignUp}>
        <h1 className={styles.title}>Sign Up</h1>
        <input
          className={styles.field}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className={styles.field}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          className={styles.field}
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Repeat password"
        />
        <button className={styles.button} type="submit" disabled={!valid}>Sign Up</button>
        {error ? <p className={styles.error}>{error}</p> : null}
        <a className={styles.link} href="/login">Already have an account? Log in</a>
      </form>
    </div>
  )
}

export default SignupView