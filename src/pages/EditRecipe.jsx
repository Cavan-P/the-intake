import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'

const units = ['tsp', 'tbsp', 'cup', 'pcs']

const EditRecipe = () => {
    const [ingredients, setIngredients] = useState([])
    const [selected, setSelected] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [steps, setSteps] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const navigate = useNavigate()
    const recipeId = useParams().id

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return navigate('/login')
            setUser(user)

            const [{ data: recipe }, { data: ingredientsData }, { data: stepsData }, { data: userIngredients }] = await Promise.all([
                supabase.from('recipes').select('*').eq('id', recipeId).single(),
                supabase.from('recipe_ingredients').select('ingredient_id, amount, unit, ingredients(name)').eq('recipe_id', recipeId),
                supabase.from('recipe_steps').select('step_number, instruction').eq('recipe_id', recipeId).order('step_number'),
                supabase.from('ingredients').select('id, name').eq('user_id', user.id).order('name')
            ])

            setTitle(recipe.name)
            setDescription(recipe.description)
            setSteps(stepsData.map(step => step.instruction))

            const formattedSelected = ingredientsData.map(({ ingredient_id, amount, unit, ingredients }) => ({
                id: ingredient_id,
                name: ingredients.name,
                amount,
                unit
            }))

            setSelected(formattedSelected)
            setIngredients(userIngredients)
            setLoading(false)
        }

        fetchData()
    }, [navigate, recipeId])

    const toggleIngredient = ingredient => {
        const exists = selected.find(i => i.id === ingredient.id)
        if (exists) setSelected(selected.filter(i => i.id !== ingredient.id))
        else setSelected([...selected, { ...ingredient, amount: '', unit: 'cup' }])
    }

    const updateSelected = (id, field, value) => {
        setSelected(selected.map(i => i.id === id ? { ...i, [field]: value } : i))
    }

    const updateStep = (index, value) => {
        const updated = [...steps]
        updated[index] = value
        setSteps(updated)
    }

    const removeStep = index => {
        const updated = [...steps]
        updated.splice(index, 1)
        setSteps(updated)
    }

    const addStep = () => setSteps([...steps, ''])

    const filteredIngredients = ingredients.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const saveRecipe = async () => {
        if (!title.trim() || selected.length === 0 || steps.length === 0) {
            alert("Title, ingredients, and steps are required.")
            return
        }

        setLoading(true)

        const { error: updateError } = await supabase.from('recipes')
            .update({ name: title, description })
            .eq('id', recipeId)

        await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId)
        await supabase.from('recipe_steps').delete().eq('recipe_id', recipeId)

        const ingredientInserts = selected.map(({ id, amount, unit }) => ({
            recipe_id: recipeId,
            ingredient_id: id,
            amount,
            unit
        }))

        const stepInserts = steps.map((instruction, index) => ({
            recipe_id: recipeId,
            step_number: index + 1,
            instruction
        }))

        const macroTotals = selected.reduce((acc, ing) => {
            acc.carbs += ing.carbs
            acc.protein += ing.protein
            acc.total_fat += ing.total_fat
            acc.trans_fat += ing.trans_fat
            acc.saturated_fat += ing.saturated_fat
            acc.sugar += ing.sugar
            acc.added_sugars += ing.added_sugars
            acc.sodium += ing.sodium
            acc.calories += ing.calories
            return acc
        }, { carbs: 0, protein: 0, total_fat: 0, trans_fat: 0, saturated_fat: 0, sugar: 0, added_sugars: 0, sodium: 0, calories: 0 })

        await supabase
            .from('recipes')
            .insert([
                {...macroTotals}
            ])

        await supabase.from('recipe_ingredients').insert(ingredientInserts)
        await supabase.from('recipe_steps').insert(stepInserts)

        if (updateError) {
            console.error('Error updating recipe:', updateError)
        }

        navigate(`/recipes/${recipeId}`)
    }

    if (loading) return <div className="text-white p-10">Loading...</div>

    return (
        <div className="min-h-screen bg-black text-white px-6 py-12">
            <BackToHome />
            <h1 className="text-4xl font-thin mb-8 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Edit Recipe
            </h1>

            <div className="space-y-4 max-w-3xl">
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Recipe title"
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30"
                />
                <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Recipe description"
                    className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30"
                />
            </div>

            <div className="flex mt-10">
                <div className="w-2/3 pr-6">
                    <h2 className="text-2xl mb-4">Ingredients</h2>
                    {selected.map(({ id, name, amount, unit }) => (
                        <div key={id} className="flex items-center space-x-4 mb-2">
                            <span className="w-1/3 truncate">{name}</span>
                            <input
                                type="number"
                                min="0"
                                value={amount}
                                onChange={e => updateSelected(id, 'amount', e.target.value)}
                                className="w-24 p-1 bg-black/30 border border-white/20 rounded text-white"
                            />
                            <select
                                value={unit}
                                onChange={e => updateSelected(id, 'unit', e.target.value)}
                                className="p-1 bg-black/30 border border-white/20 rounded text-white"
                            >
                                {units.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="w-1/3">
                    <h2 className="text-xl mb-2">Your Ingredients</h2>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full p-2 mb-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/30"
                    />
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredIngredients.map(({ id, name }) => (
                            <div
                                key={id}
                                onClick={() => toggleIngredient({ id, name })}
                                className="cursor-pointer bg-black hover:bg-white/10 p-2 rounded"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 max-w-3xl">
                <h2 className="text-2xl mb-4">Steps</h2>
                {steps.map((step, index) => (
                    <div key={index} className="flex space-x-2 mb-3">
                        <span className="text-purple-500">{index + 1}.</span>
                        <textarea
                            value={step}
                            onChange={e => updateStep(index, e.target.value)}
                            className="w-full p-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/30"
                        />
                        <button onClick={() => removeStep(index)} className="text-red-500">✕</button>
                    </div>
                ))}
                <button
                    onClick={addStep}
                    className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
                >
                    + Add Step
                </button>
            </div>

            <button
                onClick={saveRecipe}
                className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded text-lg"
            >
                Save Changes
            </button>
        </div>
    )
}

export default EditRecipe
