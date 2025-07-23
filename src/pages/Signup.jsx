import React, { useState } from 'react'

//Components
import SignupForm from '../components/SignupForm'
import BackToLanding from '../components/BackToLanding'

const Signup = _ => {
return (
    <div className="min-h-screen bg-red-500 text-white flex flex-col">
        <BackToLanding />
        <SignupForm />
    </div>
  )
  
}

export default Signup