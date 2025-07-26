import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import supabase from '../utils/supabase'

const LoginForm = _ => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async e => {
        e.preventDefault()
        setError('')

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if(error){
            setError(error.message)
            return
        }

        if(data.session){
            navigate('/home')
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-700"
            >
                <h2 className="text-3xl font-semibold text-center mb-6 tracking-wide">
                    Welcome Back
                </h2>

                <input
                    className="w-full mb-4 p-3 rounded bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    className="w-full mb-2 p-3 rounded bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <div className="flex justify-end text-sm text-blue-400 hover:underline mb-4">
                    <button
                        type="button"
                        onClick={() => alert('Password reset not implemented yet')}
                        className="hover:cursor-pointer"
                    >
                        Forgot password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded bg-gradient-to-r from-blue-500 via-fuchsia-500 to-indigo-600 hover:opacity-90 transition"
                >
                    Log In
                </button>

                {error && (
                    <div className="mt-4 text-red-500 text-sm text-center">
                        <p>{error}</p>
                        {error == "No account found with this email" && (
                            <div className="mt-2">
                                <span className="text-blue-400 transition">Don't have an account yet?  </span>
                                <button
                                    type="button"
                                    onClick={_ => navigate("/signup")}
                                    className="text-blue-500 hover:text-blue-300 transition hover:cursor-pointer hover:underline"
                                >
                                    Sign up here
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    )
}

export default LoginForm
