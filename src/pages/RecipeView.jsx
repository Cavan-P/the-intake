import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'

const RecipeView = _ => {
    const params = useParams()
    const [recipe, setRecipe] = useState(null)
    const [ingredients, setIngredients] = useState([])
    const [steps, setSteps] = useState([])
    const [loading, setLoading] = useState(true)

    const recipeId = params.id

    useEffect(() => {
        const fetchRecipeData = async () => {
            setLoading(true)

            const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', recipeId)
                .single()

            if (recipeError) {
                console.error('Error fetching recipe:', recipeError)
                return
            }

            const { data: ingredientData, error: ingError } = await supabase
                .from('recipe_ingredients')
                .select(`
                id,
                amount,
                unit,
                ingredient:ingredient_id (
                    id,
                    name
                )
                `)
                .eq('recipe_id', recipeId)

            if (ingError) {
                console.error('Error fetching ingredients:', ingError)
            }

            const { data: stepData, error: stepError } = await supabase
                .from('recipe_steps')
                .select('*')
                .eq('recipe_id', recipeId)
                .order('step_number', { ascending: true })

            if (stepError) {
                console.error('Error fetching steps:', stepError)
            }

            setRecipe(recipeData)
            setIngredients(ingredientData || [])
            setSteps(stepData || [])
            setLoading(false)
        }

        if (recipeId) {
            fetchRecipeData()
        }
    }, [recipeId])

    if (loading) return <p>Loading recipe...</p>
    if (!recipe) return <p>Recipe not found.</p>

    return (
        <div className="min-w-screen bg-black">

            <BackToHome />

            <div className="min-h-screen bg-black px-6 py-12 max-w-3xl mx-auto text-white font-extralight tracking-wide">
            
            <h1 className="text-4xl font-thin mb-6 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent select-none">
                {recipe.name}
            </h1>
        
            <p className="text-white/70 mb-8 italic leading-relaxed">
                {recipe.description || "No description provided."}
            </p>
        
            <section className="mb-12">
                <h2 className="text-3xl font-thin mb-4 border-b border-white/20 pb-2">
                    Ingredients
                </h2>
                <ul className="list-disc list-inside space-y-3 pl-5">
                    {ingredients.map(item => (
                        <li key={item.id} className="text-white/90">
                            <span className="font-semibold">{item.amount} {item.unit}</span> {item.ingredient?.name}
                        </li>
                    ))}
                </ul>
            </section>
        
            <section>
                <h2 className="text-3xl font-thin mb-4 border-b border-white/20 pb-2">
                    Steps
                </h2>
                <ol className="list-decimal list-inside space-y-4 pl-6">
                    {steps.map(step => (
                        <li key={step.id} className="text-white/90 leading-relaxed">
                            {step.instruction}
                        </li>
                    ))}
                </ol>
            </section>
        
            </div>
        </div>
    )
}

export default RecipeView
