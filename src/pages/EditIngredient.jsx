import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import supabase from '../utils/supabase'

import BackToHome from '../components/BackToHome'

const EditIngredient = _ => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
        serving_size: '',
        serving_size_units: '',
        serving_size_description: ''
    })

    const [loading, setLoading] = useState(true)

    useEffect(_ => {
        const fetchIngredient = async _ => {
            const { data, error } = await supabase
                .from('ingredients')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error fetching ingredient:', error)
            } else {
                setFormData(data)
            }

            setLoading(false)
        };

        fetchIngredient()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { error } = await supabase
            .from('ingredients')
            .update(formData)
            .eq('id', id)

        if (error) {
            console.error('Error updating ingredient:', error)
        } else {
            navigate('/ingredients')
        }
    }

    if (loading) return <p className="text-indigo-300">Loading...</p>

    const Input = ({ label, name, type = 'text', step, required }) => (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-indigo-400 text-sm tracking-wide">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                step={step}
                value={formData[name] || ''}
                onChange={handleChange}
                required={required}
                className="rounded px-3 py-2 text-white bg-black outline-1 outline-indigo-400/20 font-thin focus:ring-2 focus:ring-indigo-500"
                autoComplete="off"
            />
        </div>
    )

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12 text-white font-extralight tracking-wide">
            <h1 className="text-4xl font-thin mb-8 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Edit Ingredient
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
                <Input label="Name *" name="name" required />
                <Input label="Brand" name="brand" />
                <Input label="Calories" name="calories" type="number" />
                <Input label="Protein (g)" name="protein_g" type="number" step="0.1" />
                <Input label="Carbs (g)" name="carbs_g" type="number" step="0.1" />
                <Input label="Fat (g)" name="fat_g" type="number" step="0.1" />
                <Input label="Serving Size (accepts fraction or decimal)" name="serving_size" />
                <div className="flex flex-col">
                    <label htmlFor="serving_size_units" className="mb-1 text-indigo-400 text-sm tracking-wide">
                        Serving Size Units
                    </label>
                    <select
                        name="serving_size_units"
                        value={formData.serving_size_units || ''}
                        onChange={handleChange}
                        className="rounded px-3 py-2 bg-black text-white outline-1 outline-indigo-400/20 font-thin focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select a unit</option>
                        <option value="cup">Cup(s)</option>
                        <option value="tbsp">Tablespoon(s)</option>
                        <option value="tsp">Teaspoon(s)</option>
                        <option value="piece">Piece(s)</option>
                    </select>
                </div>
                <Input label="Serving Size Description" name="serving_size_description" />
                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded font-thin text-white hover:brightness-110 transition"
                >
                    Save Changes
                </button>
            </form>

            <div className="mt-6">
                <BackToHome />
            </div>
        </div>
    )
}

export default EditIngredient
