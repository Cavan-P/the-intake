import { useEffect, useState } from 'react'
import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'

const { data: { user } } = await supabase.auth.getUser()

const Input = ({ label, name, value, onChange, type = 'text', step, required }) => (
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
            step={step}
            required={required}
            className="rounded px-3 py-2 text-white outline-1 outline-indigo-400/20 font-thin focus:ring-2 focus:ring-indigo-500"
            autoComplete="off"
        />
    </div>
  )

const AddIngredient = _ => {

    const [user, setUser] = useState(null)
    const [form, setForm] = useState({
        name: '',
        brand: '',
        serving_size: '',
        serving_size_desc: '',
        serving_size_units: '',
        calories: '',
        protein: '',
        carbs: '',
        sugar: '',
        added_sugar: '',
        fat: '',
        saturated_fat: '',
        trans_fat: '',
        sodium: '',
        shared: false
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [potentialDuplicates, setPotentialDuplicates] = useState([])

    useEffect(_ => {
        const getUser = async _ => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser()
    }, [])

    useEffect(_ => {
        const checkForDuplicates = async _ => {
            if(!form.name.trim()){
                setPotentialDuplicates([])
                return
            }

            const { data, error } = await supabase
                .from('ingredients')
                .select('*')
                .ilike('name', `%${form.name.trim()}%`)
            
            if(error){
                console.error('Error fetching potential duplicates:', error)
            }
            else{
                const filtered = data.filter(ing => 
                    !form.brand.trim() || ing.brand?.toLowerCase().includes(form.brand.trim().toLowerCase())
                )
                setPotentialDuplicates(filtered)
            }
        }

        checkForDuplicates()
    }, [form.name, form.brand])

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type == 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setMessage('')

        if(!user){
            setMessage('You must be logged in to add ingredients.')
            return
        }

        if(!form.name.trim()){
            setMessage('Ingredient name is required')
            return
        }

        setLoading(true)

        const toNum = val => (val == '' ? 0 : parseFloat(val))

        const newIngredient = {
            id: crypto.randomUUID(),
            user_id: user.id,
            name: form.name.trim(),
            brand: form.brand.trim() || null,
            serving_size: toNum(form.serving_size_grams),
            serving_size_description: form.serving_size_desc.trim() || null,
            serving_size_units: form.serving_size_units,
            calories: toNum(form.calories),
            protein_g: toNum(form.protein),
            carbs_g: toNum(form.carbs),
            sugar_g: toNum(form.sugar),
            added_sugar: toNum(form.added_sugar),
            fat_g: toNum(form.fat),
            saturated_fat_g: toNum(form.saturated_fat),
            trans_fat_g: toNum(form.trans_fat),
            sodium_mg: toNum(form.sodium),
            shared: form.shared
        }

        const { error } = await supabase.from('ingredients').insert([newIngredient])

        setLoading(false)

        if(error){
            console.error("Error adding ingredient:", error)
            setMessage('Error adding ingredient.  Check console')
        }
        else {
            setMessage('Added ingredient ' + newIngredient.name)
            setForm({
                name: '',
                brand: '',
                serving_size: '',
                serving_size_desc: '',
                serving_size_units: '',
                calories: '',
                protein: '',
                carbs: '',
                sugar: '',
                added_sugar: '',
                fat: '',
                saturated_fat: '',
                trans_fat: '',
                sodium: '',
                shared: false
            })
        }
    }


    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12 text-white font-extralight tracking-wide">
            <h1 className="text-4xl font-thin mb-8 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Add Ingredient to Your Database
            </h1>

            <div className="flex gap-6 justify-around w-[70%]">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg space-y-6"
                autoComplete="off"
            >
                <Input label="Name *" name="name" value={form.name} onChange={handleChange} required />
                <Input label="Brand" name="brand" value={form.brand} onChange={handleChange} />
                <Input label="Serving Size" name="serving_size" value={form.serving_size} onChange={handleChange} type="number" />
                <Input label="Serving Size Units" name="serving_size_units" value={form.serving_size_units} onChange={handleChange} />
                <Input label="Serving Size Description" name="serving_size_desc" value={form.serving_size_description} onChange={handleChange} />
                <Input label="Calories" name="calories" value={form.calories} onChange={handleChange} type="number" setep="1" />
                <Input label="Protein (g)" name="protein" value={form.protein} onChange={handleChange} type="number" step="0.1" />
                <Input label="Carbohydrates (g)" name="carbs" value={form.carbs} onChange={handleChange} type="number" step="0.1" />
                <Input label="Sugar (g)" name="sugar" value={form.sugar} onChange={handleChange} type="number" step="0.1" />
                <Input label="Added Sugar (g)" name="added_sugar" value={form.added_sugar} onChange={handleChange} type="number" step="0.1" />
                <Input label="Fat (g)" name="fat" value={form.fat} onChange={handleChange} type="number" step="0.1" />
                <Input label="Saturated Fat (g)" name="saturated_fat" value={form.saturated_fat} onChange={handleChange} type="number" step="0.1" />
                <Input label="Trans Fat (g)" name="trans_fat" value={form.trans_fat} onChange={handleChange} type="number" step="0.1" />
                <Input label="Sodium (mg)" name="sodium" value={form.sodium} onChange={handleChange} type="number" step="1" />
      
                <label className="flex items-center space-x-3 text-indigo-400">
                    <input
                        type="checkbox"
                        name="shared"
                        checked={form.shared}
                        onChange={handleChange}
                        className="accent-indigo-500"
                    />
                    <span className="select-none">Make this ingredient public/shared</span>
                </label>
      
                {message && (
                    <p className="text-indigo-400 italic text-center">{message}</p>
                )}
      
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded font-thin text-white hover:brightness-110 transition disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Ingredient'}
                </button>
            </form>

            <BackToHome />

            <div className="w-[30%]">
                {potentialDuplicates.length >= 0 && (
                    <div className="mt-2 bg-indigo-900/20 rounded p-2 text-sm text-indigo-200">
                        <p className="mb-1 italic text-indigo-300 text-center select-none">Avoid cluttering your database with duplicates:</p>
                        {potentialDuplicates.length > 0 ? (
                        <ul className="space-y-1 max-h-48 overflow-y-auto pr-2 overflow-x-visible relative">
                            {potentialDuplicates.map((ing) => (
                                <li key={ing.id} className="group relative border border-indigo-600 rounded px-2 py-1 hover:bg-indigo-700/30">
                                    <div className="flex justify-between">
                                        <span>{ing.name}</span>
                                        {ing.brand && <span className="text-indigo-400">{ing.brand}</span>}
                                    </div>
                                    {/*
                                    <div className="absolute left-full ml-2 w-64 bg-indigo-950 p-2 rounded text-xs text-indigo-100 shadow-xl hidden group-hover:block z-10">
                                        <div>Calories: {ing.calories}</div>
                                        <div>Protein: {ing.protein_g}g</div>
                                        <div>Carbs: {ing.carbs_g}g</div>
                                        <div>Fat: {ing.fat_g}g</div>
                                    </div>
                                    */}
                                </li>
                            ))}
                        </ul>
                        ) : (
                          <p className="text-center my-10 font-extralight text-white">This ingredient doesn't closely match anything that's already in your database</p>
                        )}
                    </div>
                )}
            </div>

</div>
        </div>
      )
}

export default AddIngredient