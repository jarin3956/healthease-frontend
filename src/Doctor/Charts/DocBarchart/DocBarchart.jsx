import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function DocBarchart({ groupedData }) {
    return (
        <div className="chart-container" >
            <h2 className='p-3 text-center'>Monthly Bookings</h2>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupedData} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthYear" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="CANCELLED" fill="#C71009" />
                <Bar dataKey="PENDING" fill="#21ACCF" />
                <Bar dataKey="COMPLETED" fill="#30D727" />
            </BarChart>
            </ResponsiveContainer>
            
        </div>

    )
}

export default DocBarchart