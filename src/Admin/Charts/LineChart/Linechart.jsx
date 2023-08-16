import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createInstance } from '../../../Axios/Axios';
function groupMonthlyData(data) {
    const monthlyCounts = {};

    data.usersData.forEach((user) => {
        const month = new Date(user.createdAt).toLocaleString('default', { month: 'long' });
        monthlyCounts[month] = monthlyCounts[month] || { usersCount: 0, doctorsCount: 0 };
        monthlyCounts[month].usersCount++;
    });

    data.doctorsData.forEach((doctor) => {
        const month = new Date(doctor.createdAt).toLocaleString('default', { month: 'long' });
        monthlyCounts[month] = monthlyCounts[month] || { usersCount: 0, doctorsCount: 0 };
        monthlyCounts[month].doctorsCount++;
    });

    const monthlyChartData = Object.keys(monthlyCounts).map((month) => ({
        month,
        usersCount: monthlyCounts[month].usersCount,
        doctorsCount: monthlyCounts[month].doctorsCount,
    }));

    return monthlyChartData;
}


function Linechart() {

    const [chartData, setChartData] = useState([])

    const admintoken = localStorage.getItem('admintoken')


    useEffect(() => {
        const chartData = async () => {
            try {

                const axiosInstance = createInstance(admintoken)

                const response = await axiosInstance.get('admin/linechart-data')

                if (response.status === 200) {
                    const monthlyChartData = groupMonthlyData(response.data.chartData);
                    setChartData(monthlyChartData);
                }
            } catch (error) {
                console.log(error);
            }
        }
        chartData()
    }, [])

    return (
        <div className="chart-container">
            <h2 className='p-3 text-center'>Monthly users count</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart

                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="usersCount" stroke="#0A8BC7" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="doctorsCount" stroke="#0AC726" />
                </LineChart>
            </ResponsiveContainer>

        </div>

    )
}

export default Linechart