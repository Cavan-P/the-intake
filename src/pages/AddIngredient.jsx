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
        serving_size_grams: '',
        serving_size_desc: '',
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

    useEffect(_ => {
        const getUser = async _ => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser()
    }, [])

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
            serving_size_grams: toNum(form.serving_size_grams),
            serving_size_description: form.serving_size_desc.trim() || null,
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
            console.error("ERror adding ingredient:", error)
            setMessage('Error adding ingredient.  Check console')
        }
        else {
            setMessage('Added ingredient ' + newIngredient.name)
            setForm({
                name: '',
                brand: '',
                serving_size_grams: '',
                serving_size_desc: '',
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
    
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-6"
            autoComplete="off"
          >
            <Input label="Name *" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Brand" name="brand" value={form.brand} onChange={handleChange} />
            <Input label="Serving Size (grams)" name="serving_size_grams" value={form.serving_size_grams} onChange={handleChange} type="number" />
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
        </div>
      )
}

export default AddIngredient