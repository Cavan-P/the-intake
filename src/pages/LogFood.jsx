import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'

const LogFood = () => {
    const [entryType, setEntryType] = useState('ingredient') // ingredient | recipe | meal
    const [selectedEntry, setSelectedEntry] = useState(null)

    const [recipes, setRecipes] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [meals, setMeals] = useState([])

    const [servings, setServings] = useState(1)
    const [notes, setNotes] = useState('')
    const [user, setUser ] = useState(null)

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(_ => {
        const fetchUserAndFood = async _ => {
            const { data: { user } } = await supabase.auth.getUser()

            if(!user){
                navigate('/login')
            }
            setUser(user)

            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)

            if(error){
                console.error('Error fetching recipes:', error)
            }
            else {
                setRecipes(data)
            }

            const { data: ingData, error: ingError } = await supabase
                .from('ingredients')
                .select('*')
                .eq('user_id', user.id)

            if(ingError){
                console.error('Error fetching ingredients:', ingError)
            }
            else {
                setIngredients(ingData)
            }

            setLoading(false)
        }

        fetchUserAndFood()
    }, [navigate])

    const handleSave = async e => {
        e.preventDefault()

        console.log("adsasdad", selectedEntry)

        const loggedFood = {
            id: crypto.randomUUID(),
            user_id: user.id,
            entry_type: entryType,
            entry_id: selectedEntry.id,
            servings: servings,
            notes: notes,
            calories: Number(selectedEntry.calories),
            total_fat: Number(selectedEntry.total_fat),
            saturated_fat: Number(selectedEntry.saturated_fat),
            trans_fat: Number(selectedEntry.trans_fat),
            carbs: Number(selectedEntry.carbs),
            sugars: Number(selectedEntry.sugars),
            added_sugar: Number(selectedEntry.added_sugar),
            protein: Number(selectedEntry.protein),
            sodium: Number(selectedEntry.sodium)
        }

        console.log(loggedFood)

        const { error } = await supabase
            .from('log')
            .insert([loggedFood])

        if(error){
            console.error("Error logging food:", JSON.stringify(error, null, 2))
        }
        

    }

    const options = entryType === 'ingredient' ? ingredients 
        : entryType === 'recipe' ? recipes 
        : meals

    return (
        <div className="min-h-screen bg-black text-white px-6 py-8 flex flex-col items-center">
            <BackToHome />

            <h1 className="text-4xl font-thin bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-8">
                Log Food
            </h1>

            <div className="bg-white/5 rounded-lg p-6 w-full max-w-lg flex flex-col gap-6">
                {/* Entry Type Selector */}
                <div>
                    <label className="text-white/70 font-thin mb-2 block">Entry Type</label>
                    <select 
                        className="w-full p-2 rounded bg-black text-white border border-white/30"
                        value={entryType}
                        onChange={e => {
                            setEntryType(e.target.value)
                            setSelectedEntry(null)
                        }}
                    >
                        <option value="ingredient">Ingredient</option>
                        <option value="recipe">Recipe</option>
                        <option value="meal">Meal</option>
                    </select>
                </div>

                {/* Entry Selector */}
                <div>
                    <label className="text-white/70 font-thin mb-2 block">Select {entryType}</label>
                    <select 
                        className="w-full p-2 rounded bg-black text-white border border-white/30"
                        value={selectedEntry?.id || ''}
                        onChange={e => {
                            const selectedId = e.target.value
                            const entryObj = options.find(o => o.id == selectedId)
                            setSelectedEntry(entryObj)
                        }}
                    >
                        <option value="" disabled>Select an option</option>
                        {options.map((opt, i) => (
                            <option key={i} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                </div>

                {/* Servings */}
                <div>
                    <label className="text-white/70 font-thin mb-2 block">Servings</label>
                    <input 
                        type="number" 
                        className="w-full p-2 rounded bg-black text-white border border-white/30"
                        min={1}
                        value={servings}
                        onChange={e => setServings(Number(e.target.value))}
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="text-white/70 font-thin mb-2 block">Notes (optional)</label>
                    <textarea 
                        className="w-full p-2 rounded bg-black text-white border border-white/30"
                        rows={3}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Add anything extra you want to remember..."
                    />
                </div>

                {/* Save Button */}
                <button 
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:brightness-110 transition text-white font-thin"
                >
                    Save Entry
                </button>
            </div>
        </div>
    )
}

export default LogFood
