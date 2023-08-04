import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function DocLinechart({docRevenueData}) {
    return (
        <div className="chart-container" >
            <h2 className='p-3 text-center'>Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    width={500}
                    height={300}
                    data={docRevenueData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Revenue" stroke="#328da8" activeDot={{ r: 8 }} />
                    
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DocLinechart