import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'

const EditRecipe = () => {
    const params = useParams()
    const navigate = useNavigate()
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

            const { data: ingredientData } = await supabase
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

            const { data: stepData } = await supabase
                .from('recipe_steps')
                .select('*')
                .eq('recipe_id', recipeId)
                .order('step_number', { ascending: true })

            setRecipe(recipeData)
            setIngredients(ingredientData || [])
            setSteps(stepData || [])
            setLoading(false)
        }

        if (recipeId) fetchRecipeData()
    }, [recipeId])

    const handleSave = async () => {
        const { error } = await supabase
        .from('recipes').update({
            name: recipe.name,
            description: recipe.description,
        }).eq('id', recipeId)

        for(const item of ingredients){
            if(item.id && item.ingredient?.id){
                await supabase.from('ingredients').update({ name: item.ingredient.name }).eq('id', item.ingredient.id)
                await supabase.from('recipe_ingredients').update({ amount: item.amount, unit: item.unit }).eq('id', item.id)
            }
        }

        for(const step of steps){
            await supabase.from('recipe_steps').update({ instruction: step.instruction, step_number: step.step_number }).eq('id', step.id)
        }

        if(error){
            console.error("Error updating recipe:", error)
        }
        else{
            navigate(`/recipes/${recipeId}`) // back to view mode
        }
        
    }

    const handleInputChange = (field, value) => {
        setRecipe(prev => ({ ...prev, [field]: value }))
    }

    if (loading) return <p>Loading recipe...</p>
    if (!recipe) return <p>Recipe not found.</p>

    return (
        <div className="min-w-screen bg-black">
            <BackToHome />

            <div className="min-h-screen bg-black px-6 py-12 max-w-3xl mx-auto text-white font-extralight tracking-wide">

                <h1 className="text-4xl font-thin mb-6 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent select-none">
                    Edit Recipe
                </h1>

                <input
                    type="text"
                    value={recipe.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="bg-black border border-white/30 rounded px-3 py-2 w-full text-white mb-4"
                    placeholder="Recipe Name"
                />

                <textarea
                    value={recipe.description || ''}
                    onChange={e => handleInputChange('description', e.target.value)}
                    className="bg-black border border-white/30 rounded px-3 py-2 w-full text-white mb-8"
                    placeholder="Recipe Description"
                    rows={3}
                />

                <section className="mb-12">
                    <h2 className="text-2xl font-light mb-4 border-b border-white/20 pb-2">
                        Ingredients
                    </h2>
                    <ul className="space-y-2">
                        {ingredients.map((item, index) => (
                            <div key={item.id} className="flex gap-2 mb-3">
                                <input
                                    className="bg-white/10 p-2 rounded text-white w-16"
                                    type="text"
                                    value={item.amount}
                                    onChange={e => {
                                        const updated = [...ingredients]
                                        updated[index].amount = e.target.value
                                        setIngredients(updated)
                                    }}
                                />
                                <input
                                    className="bg-white/10 p-2 rounded text-white w-20"
                                    type="text"
                                    value={item.unit}
                                    onChange={e => {
                                        const updated = [...ingredients]
                                        updated[index].unit = e.target.value
                                        setIngredients(updated)
                                    }}
                                />
                                <input
                                    className="bg-white/10 p-2 rounded text-white flex-1"
                                    type="text"
                                    value={item.ingredient?.name || ''}
                                    onChange={e => {
                                        const updated = [...ingredients]
                                        updated[index].ingredient.name = e.target.value
                                        setIngredients(updated)
                                    }}
                                />
                                <button onClick={() => {
                                    const updated = [...ingredients]
                                    updated.splice(index, 1)
                                    setIngredients(updated)
                                }}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-light mb-4 border-b border-white/20 pb-2">
                        Steps
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        {steps.map((step, index) => (
                            <div key={step.id} className="mb-3">
                                <textarea
                                    className="w-full bg-white/10 p-2 rounded text-white"
                                    value={step.instruction}
                                    onChange={e => {
                                        const updated = [...steps]
                                        updated[index].instruction = e.target.value
                                        setSteps(updated)
                                    }}
                                />
                                <button onClick={() => {
                                    const updated = [...steps]
                                    updated.splice(index, 1)
                                    setSteps(updated)
                                }}>
                                    Remove
                                </button>
                            </div>
                        ))}

                    </ol>
                </section>

                <button
                    onClick={handleSave}
                    className="mt-10 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white rounded hover:opacity-90 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}

export default EditRecipe
