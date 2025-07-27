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

        // First, probe to see if this email already has an account
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password: crypto.randomUUID()
        })

        // If we got any error *except* for "Invalid login credentials" or "Email not confirmed"
        // then we can assume the user doesn't exist and it's safe to proceed
        const accountExists =
            loginError &&
            (loginError.message === 'Invalid login credentials' ||
            loginError.message === 'Email not confirmed')

        if (accountExists) {
            setError("An account already exists with that email. Try logging in instead.")
            return
        }

        // Proceed with signup if we didn't detect an existing account
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        })

        if (error) {
            setError(error.message)
            return
        }

        if (data.session) {
            navigate('/home')
        } else {
            // Optionally show email confirmation info
            // setError('Check your email to confirm your account before logging in')
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

            {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}
        </div>
    )
}

export default SignupForm