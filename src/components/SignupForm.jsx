import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../utils/supabase'

const SignupForm = _ => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setError(null)

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { username }
            }
        })

        console.log("Here")

        if(error){
            console.log("Errored ", error)
            setError(error.message)
            return
        }

        if(data.session){
            console.log("Has session")
            navigate('/home')
        }
        else {
            console.log("No has session")
            setError('Check your email to confirm your account before logging in')
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            <form
                onSubmit={handleSignup}
                className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-700"
            >
                <h2 className="text-3xl font-semibold text-center mb-6 tracking-wide">
                    Create Account
                </h2>

                <input
                    className="w-full mb-4 p-3 rounded bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    className="w-full mb-4 p-3 rounded bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    className="w-full mb-6 p-3 rounded bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full py-3 rounded bg-gradient-to-r from-blue-500 via-fuchsia-500 to-indigo-600 hover:opacity-90 transition"
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignupForm