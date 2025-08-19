import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const COLORS = ["#3B82F6", "#9333EA", "#F472B6"]



export default function DailyOverview() {
    const [macros] = useState({
        calories: 1230,
        calorieGoal: 2400,
        carbs: 120,
        protein: 70,
        fat: 50,
    })

    const pieData = [
        { name: "Carbs", value: macros.carbs },
        { name: "Protein", value: macros.protein },
        { name: "Fat", value: macros.fat },
    ]

    return (
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
                    <span style={{ color: "#F472B6" }}>Fat: {macros.fat}g</span>
                </div>
            </div>
        </div>
    )
}
