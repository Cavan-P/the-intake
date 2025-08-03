import { useState, useEffect } from 'react'
import supabase from '../utils/supabase'
import { useNavigate } from 'react-router-dom'

import { PlusIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/outline'
import { EyeIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'



import BackToHome from '../components/BackToHome'

const Recipes = () => {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const handleDelete = async id => {
        if(!confirm('Are you sure you want to delete this recipe?')) return

        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', id)

        if(error){
            console.error('Error deleting recipe:', error)
            alert('Failed to delete recipe.  Please try again')
        }
        else {
            setRecipes(recipes.filter(recipe => recipe.id != id))
        }
    }

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
                                className="group relative p-4 rounded border border-white/10 hover:border-indigo-500 transition flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-lg font-semibold">{name}</p>
                                    {description && <p className="text-sm text-white/60">{description}</p>}
                                </div>

                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                            navigate(`/recipes/${id}/edit`)
                                        }}
                                        className="w-15 h-15 flex items-center justify-center rounded-full
                                            bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400
                                            hover:brightness-115 transition hover:cursor-pointer"
                                        title="Edit"
                                    >
                                        <PencilIcon className="w-8 h-8 text-indigo-700"/>
                                    </button>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                            handleDelete(id)
                                        }}
                                        className="w-15 h-15 flex items-center justify-center rounded-full
                                            bg-gradient-to-r from-pink-400 via-pink-500 to-red-400
                                            hover:brightness-115 transition hover:cursor-pointer"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-8 h-8 text-red-600"/>
                                    </button>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                            navigate(`/recipes/${id}`)
                                        }}
                                        className="w-15 h-15 flex items-center justify-center rounded-full
                                            bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-400
                                            hover:brightness-115 transition hover:cursor-pointer"
                                        title="View"
                                    >
                                        <EyeIcon className="w-8 h-8 text-blue-400"/>
                                    </button>
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
