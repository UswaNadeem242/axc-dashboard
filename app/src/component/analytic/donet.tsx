import { PieChart as PieIcon } from 'lucide-react'
import React from 'react'
import { ResponsiveContainer, Pie, Cell, PieChart, Tooltip } from 'recharts'

export function ChartPie() {
    const distributionData = [
        { name: "Completed", value: 55, color: "#6B7280" },
        { name: "Pending", value: 30, color: "#232A76" },
        { name: "Processing", value: 15, color: "#B71519" },
    ];
    return (
        <div>

            <div className="flex flex-col items-center justify-center h-[240px]">
                <div className="h-[180px] w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                        <p className="text-2xl font-extrabold text-axc-navy">100+</p>
                        <p className="text-[10px] text-axc-gray uppercase font-semibold">Total Orders</p>
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    {distributionData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[10px] font-bold text-gray-600">
                                {entry.name} ({entry.value}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

