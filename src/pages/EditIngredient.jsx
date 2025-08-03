import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';

import BackToHome from '../components/BackToHome';

const EditIngredient = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
        serving_size: '',
        serving_unit: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIngredient = async () => {
            const { data, error } = await supabase
                .from('ingredients')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching ingredient:', error);
            } else {
                setFormData(data);
            }

            setLoading(false);
        };

        fetchIngredient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('ingredients')
            .update(formData)
            .eq('id', id);

        if (error) {
            console.error('Error updating ingredient:', error);
        } else {
            navigate('/'); // or wherever you want to send them
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            <BackToHome />
            <h2 className="text-2xl font-bold mb-4">Edit Ingredient</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Calories</label>
                        <input
                            type="number"
                            name="calories"
                            value={formData.calories}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Protein (g)</label>
                        <input
                            type="number"
                            name="protein_g"
                            value={formData.protein_g}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Carbs (g)</label>
                        <input
                            type="number"
                            name="carbs_g"
                            value={formData.carbs_g}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Fat (g)</label>
                        <input
                            type="number"
                            name="fat_g"
                            value={formData.fat_g}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Serving Size</label>
                        <input
                            type="number"
                            name="serving_size"
                            value={formData.serving_size}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Serving Unit</label>
                        <input
                            type="text"
                            name="serving_unit"
                            value={formData.serving_unit || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditIngredient;
