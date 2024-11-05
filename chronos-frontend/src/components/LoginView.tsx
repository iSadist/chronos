import React, { useState } from 'react'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '', // Your user pool id here
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID || '', // Your client id here
}

const userPool = new CognitoUserPool(poolData)

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignIn() {
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
        const token = result.getIdToken().getJwtToken()
        const username = result.getIdToken().payload['cognito:username']
        storeUserId(username)
        storeAccessToken(token)
        onLogin()
      },
      onFailure: (err) => {
        console.error('Error signing in', err)
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
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  )
}

export default LoginView