import React from 'react'
import "./Login.scss"

const Login = () => {
  return (
    <div className="login_parent">
      <div className="login_cont">
        <h1>Login</h1>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" placeholder="Enter your username" />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" />
        </div>

        <button type="button">Login</button>
      </div>
    </div>
  )
}

export default Login
