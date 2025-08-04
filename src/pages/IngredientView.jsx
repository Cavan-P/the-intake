import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'

const IngredientView = _ => {
    const params = useParams()

    const [ingredient, setIngredient] = useState(null)
    const [loading, setLoading] = useState(true)

    const ingredientId = params.id

    useEffect(_ => {
        const fetchIngredientData = async _ => {
            setLoading(true)

            const { data: ingredientData, error: ingredientError } = await supabase
                .from('ingredients')
                .select('*')
                .eq('id', ingredientId)
                .single()

            if(ingredientError){
                console.error('Error fetching ingredient:', ingredientError)
            }

            setIngredient(ingredientData)
            setLoading(false)
        }

        if(ingredientId){
            fetchIngredientData()
        }
    }, [ingredientId])

    if(loading) return <p>Loading ingredient...</p>
    if(!ingredient) return <p>Ingredient not found.</p>

    return (
        <div className="min-w-screen bg-black">

            <BackToHome />

            <div className="min-h-screen bg-black px-6 py-12 max-w-3xl mx-auto text-white font-extralight tracking-wide text-center">
                <h1 className="text-4xl font-thin mb-3 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent select-none">
                    {ingredient.name}
                </h1>
                <p className="text-lg font-thin italic tracking-widest text-white/80">{ingredient.brand}</p>

                <div className="max-w-md mx-auto mt-10 text-left space-y-4 text-white">
                    <h2 className="uppercase text-sm tracking-widest text-white">
                        Nutrition Facts
                    </h2>

                    <div className="flex justify-between text-base">
                        <span>Serving Size</span>
                        <span>{ingredient.serving_size} {ingredient.serving_size_units == 'piece' ? (ingredient.serving_size > 1 ? 'pieces' : 'piece') : ingredient.serving_size_units}</span>
                    </div>

                    <div className="relative pt-4">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-pink-500 to-indigo-600" />
    
                        <div className="flex justify-between text-lg font-semibold text-white">
                            <span>Calories</span>
                            <span>{ingredient.calories}</span>
                        </div>
                    </div>


                    <div className="relative pt-2 space-y-2 text-sm">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-pink-500 to-indigo-600" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Fat</span>
                            <span className="text-white">{ingredient.fat_g}g</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">Trans Fat</span>
                            <span className="text-white">{ingredient.trans_fat_g}g</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">Saturated Fat</span>
                            <span className="text-white">{ingredient.saturated_fat_g}g</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-400 font-semibold">Carbs</span>
                            <span className="text-white">{ingredient.carbs_g}g</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">Sugars</span>
                            <span className="text-white">{ingredient.sugar_g}g</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">Added Sugars</span>
                            <span className="text-white">{ingredient.added_sugar}g</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400 font-semibold">Protein</span>
                            <span className="text-white">{ingredient.protein_g}g</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">Sodium</span>
                            <span className="text-white">{ingredient.sodium_mg}mg</span>
                        </div>
                        
                    </div>

                    <div className="relative pt-4">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-pink-500 to-indigo-600" />
                        
                        <p className="text-xs text-white/50 italic">
                            * Per serving
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default IngredientView
