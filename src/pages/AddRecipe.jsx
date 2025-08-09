import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'


const units = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pcs']

const Input = ({ label, name, value, onChange, type = 'text', required }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-indigo-400 text-sm tracking-wide" htmlFor={name}>
            {label}
        </label>
        <input
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            required={required}
            className="rounded px-3 py-2 text-white outline-1 outline-indigo-400/20 font-thin focus:ring-2 focus:ring-indigo-500"
            autoComplete="off"
        />
    </div>
)

const AddRecipe = _ => {

    const [ingredients, setIngredients] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    
    const [selected, setSelected] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const [steps, setSteps] = useState([])

    const addStep = _ => setSteps([...steps, ''])

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

    useEffect(() => {
            const fetchUserAndIngredients = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                navigate('/login')
                return
            }
            setUser(user)

            const { data, error } = await supabase
                .from('ingredients')
                .select('id, name, brand, serving_size, serving_size_description')
                .eq('user_id', user.id)
                .order('name', { ascending: true })

            if (error) {
                console.error('Error fetching ingredients:', error)
            } else {
                setIngredients(data)
            }
            setLoading(false)
            }

            fetchUserAndIngredients()
    }, [navigate])

    const toggleIngredient = ingredient => {
        const found = selected.find(i => i.id == ingredient.id)

        if(found){
            setSelected(selected.filter(i => i.id != ingredient.id))
        }

        else {
            setSelected([...selected, { ...ingredient, amount: '', unit: 'cups'}])
        }
    }

    const updateSelected = (id, field, value) => {
        setSelected(
            selected.map(i => i.id == id ? { ...i, [field]: value } : i )
        )
    }

    const filteredIngredients = ingredients.filter(ingredient => 
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const saveRecipe = async _ => {
        if(!title.trim() || selected.length == 0 || steps.length == 0){
            alert("Title, ingredients, and steps are required.")
            return
        }

        setLoading(true)

        const { data: recipe, error: recipeError } = await supabase
            .from('recipes')
            .insert([
                {
                    user_id: user.id,
                    name: title,
                    description: description,
                    shared: false
                }
            ])
            .select()
            .single()

        if(recipeError){
            console.error('Error inserting recipe:', recipeError)
            setLoading(false)
            return
        }

        const recipeId = recipe.id

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

        const { error: ingError } = await supabase.from('recipe_ingredients').insert(ingredientInserts)

        if(ingError){
            console.error("Error inserting ingredients:", ingError)
            setLoading(false)
            return
        }

        const { error: stepError } = await supabase.from('recipe_steps').insert(stepInserts)

        if(stepError){
            console.error("Error inserting steps:", stepError)
            setLoading(false)
            return
        }

        navigate(`/recipes/${recipeId}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white font-extralight tracking-wide">
                Loading ingredients...
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12 text-white font-extralight tracking-wide">

            <BackToHome />

            <h1 className="text-4xl font-thin mb-8 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Create a Recipe
            </h1>

            <div className="px-6 pt-6 pb-4 space-y-4 min-w-[70vw]">
                <div>
                    <label className="block text-sm text-white/70 mb-1" htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Low-Fat Air Fried Orange Chicken"
                        className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/70 mb-1" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe the dish in a few sentences - taste, texture, and when it's best enjoyed"
                        className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>
            </div>

            <div className="flex w-full max-w-6xl overflow-hidden">
                <div className="w-[70%] p-6 overflow-y-auto">
                    <h2 className="text-4xl mb-4">Selected Ingredients</h2>
                    
                    {selected.length == 0 && (
                        <p className="text-white/70 italic">Click ingredients on the right to add them to your recipe</p>
                    )}

                    <ul className="space-y-4">
                        {selected.map(({ id, name, amount, unit }) => (
                            <li key={id} className="flex items-center space-x-4">
                                <span className="w-1/3 truncate">{name}</span>
                                <input 
                                    type="number"
                                    min="0"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={e => updateSelected(id, 'amount', e.target.value)}
                                    className="bg-black/30 border border-white/20 rounded px-3 py-1 w-24 text-white placeholder-white/50"
                                />

                                <select
                                    value={unit}
                                    onChange={e => updateSelected(id, 'unit', e.target.value)}
                                    className="bg-black/30 border border-white/20 rounded px-3 py-1 text-white"
                                >
                                    {units.map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-[30%] p-6">
                    <h2 className="text-2xl mb-4">Your Ingredients</h2>
                    <input 
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full p-3 mb-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                    <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                        {filteredIngredients.map(({ id, name }) => {
                            const isSelected = selected.find(i => i.id == id)

                            return (
                                <li
                                    key={id}
                                    onClick={_ => toggleIngredient({ id, name })}
                                    className="cursor-pointer select-none transition"
                                >
                                    <div
                                        className={`rounded p-[2px] ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600'
                                                : 'bg-transparent hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="bg-black rounded p-3 hover:bg-white/5">
                                            {name}
                                        </div>
                                    </div>
                                </li>
                            )
                            
                        })}
                    </ul>
                </div>
            </div>

            <div className="w-full max-w-4xl mt-12">
                <h2 className="text-2xl mb-4 text-white/80">Steps</h2>

                {steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-4">
                        <span className="text-purple-500 text-lg mt-2">{index + 1}.</span>
                        <textarea
                            value={step}
                            onChange={e => updateStep(index, e.target.value)}
                            rows={2}
                            placeholder={`Step ${index + 1}...`}
                            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                            onClick={_ => removeStep(index)}
                            className="text-red-400 hover:text-red-600 mt-2"
                            title="Remove Step"
                        >
                            ✕
                        </button>
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
                Save Recipe
            </button>

        </div>
    )
}

export default AddRecipe
