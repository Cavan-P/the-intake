import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

import supabase from "../utils/supabase"

const COLORS = ["#3B82F6", "#9333EA", "#F472B6"]



const DailyOverview = _ => {

    const [macros, setMacros] = useState({})
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect( _ => {

        const loadMacros = async _ => {

            const { data: { user } } = await supabase.auth.getUser()

            if(!user){
                navigate('/login')
            }
            setUser(user)

            const { data: macroData, error: macroError } = await supabase
                .from('log')
                .select('*')
                .eq('user_id', user?.id)

            if(macroError){
                console.error('Error loading macros', macroError)
            }
            else{
                const totals = macroData.reduce((acc, row) => {
                    acc.carbs += row.carbs;
                    acc.protein += row.protein;
                    acc.total_fat += row.total_fat
                    acc.calories += row.calories * row.servings
                    acc.calorieGoal = 2400
                    return acc
                }, {carbs: 0, protein: 0, total_fat: 0, calories: 0, calorieGoal: 0})
                
                setMacros(totals ? totals : {carbs: 0, protein: 0, total_fat: 0, calories: 0, calorieGoal: 0})
            }
            setLoading(false)
        }

        loadMacros()

    }, [])

    const pieData = [
        { name: "Carbs", value: macros.carbs },
        { name: "Protein", value: macros.protein },
        { name: "Fat", value: macros.total_fat },
    ]

    return loading ? 
        <div>Loading...</div> 
    : (
        <div className="w-full p-4 flex flex-col gap-4 text-gray-200">
            {/* Calories */}
            <div className="bg-neutral-900 rounded-2xl p-6 flex flex-col items-center shadow-md">
                <h2 className="text-lg font-thin tracking-[5px] text-gray-100">
                    Today's Intake:
                </h2>
                <p className="text-3xl font-light my-2 text-white">
                    {macros.calories} / {macros.calorieGoal}
                </p>
                <h2 className="text-lg font-thin tracking-[5px] text-gray-100">
                    calories
                </h2>
            </div>

            {/* Donut Chart */}
            <div className="bg-neutral-900 rounded-2xl p-6 shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-100">Macros</h2>
                <div className="w-full h-48">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={50}
                                paddingAngle={4}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-around mt-4 text-sm">
                    <span style={{ color: "#3B82F6" }}>Carbs: {macros.carbs}g</span>
                    <span style={{ color: "#9333EA" }}>Protein: {macros.protein}g</span>
                    <span style={{ color: "#F472B6" }}>Fat: {macros.total_fat}g</span>
                </div>
            </div>
        </div>
    )
}

export default DailyOverview