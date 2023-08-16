import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createInstance } from '../../../Axios/Axios';

function Areachart() {

    const [revenueData, setRevenueData] = useState([]);

    const admintoken = localStorage.getItem('admintoken')


    useEffect(() => {
        const fetchData = async () => {
          try {

            const axiosInstance = createInstance(admintoken)

            const response = await axiosInstance.get('admin/bookings')

            if (response.status === 200) {
              setRevenueData(response.data.bookingData);
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, []);


    const getCompletedData = () => {
        return revenueData.filter((item) => item.Status === 'COMPLETED');
      };
    
      const getCombinedRevenueByMonth = () => {
        const completedData = getCompletedData();
        const revenueByMonth = completedData.reduce((acc, item) => {
          const date = new Date(item.Booked_date);
          const month = date.toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + parseFloat(item.Fare);
          return acc;
        }, {});
        return revenueByMonth;
      };
    
      const formatDataForChart = () => {
        const revenueByMonth = getCombinedRevenueByMonth();
        const dataForChart = Object.keys(revenueByMonth).map((month) => {
          const fullMonthName = new Date(`${month} 1, 2023`).toLocaleString('default', { month: 'long' }).toUpperCase();
          return {
            name: fullMonthName,
            revenue: revenueByMonth[month],
          };
        });
        return dataForChart;
      };
    
      const data = formatDataForChart();


    return (
        <div >
          <h2 className='p-3 text-center'>Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
          <AreaChart
                
                data={data} 
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0A8BC7" fill="#21ACCF" />
            </AreaChart>
          </ResponsiveContainer>
            
        </div>

    )
}

export default Areachart