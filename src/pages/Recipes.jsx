import { useState, useEffect } from 'react'
import supabase from '../utils/supabase'
import { useNavigate } from 'react-router-dom'

import { PlusIcon } from '@heroicons/react/24/outline'

import BackToHome from '../components/BackToHome'

const Recipes = () => {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
            const fetchUserAndRecipes = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                navigate('/login')
                return
            }
            setUser(user)

            const { data, error } = await supabase
                .from('recipes')
                .select('id, name, description, shared, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching recipes:', error)
            } else {
                setRecipes(data)
            }
            setLoading(false)
            }

            fetchUserAndRecipes()
    }, [navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white font-extralight tracking-wide">
                Loading recipes...
            </div>
        )
    }

    return (
        <div className="min-w-screen min-h-screen bg-black">
            <BackToHome />
            <div className="bg-black text-white max-w-4xl px-6 py-12 mx-auto font-extralight tracking-wide">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-thin bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Your Recipes
                    </h1>
                    <button
                        onClick={() => navigate('/add-recipe')}
                        aria-label="Add Recipe"
                        className="hover: cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:brightness-110 transition"
                    >
                        <PlusIcon className="h-6 w-6 text-white" />
                    </button>

                </header>

                {recipes.length === 0 ? (
                    <p className="text-white/70 text-center mt-16">No recipes found. Cook something up!</p>
                    ) : (
                    <ul className="space-y-4">
                        {recipes.map(({ id, name, description }) => (
                            <li
                                key={id}
                                className="p-4 rounded border border-white/10 hover:border-indigo-500 transition cursor-pointer"
                                onClick={() => navigate(`/recipes/${id}`)}
                            >
                                <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold">{name}</p>
                                    {description && <p className="text-sm text-white/60">{description}</p>}
                                </div>
                                <div className="text-sm text-white/40 italic">View</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Recipes
