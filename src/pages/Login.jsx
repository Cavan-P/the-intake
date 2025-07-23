import React, { useState } from 'react'

//Components
import LoginForm from "../components/LoginForm"
import BackToLanding from '../components/BackToLanding'

const Login = _ => {
    return (
        <div className="min-h-screen bg-blue-500 text-black flex flex-col">
            <BackToLanding />
            <LoginForm />
        </div>
    )
  
}

export default Login