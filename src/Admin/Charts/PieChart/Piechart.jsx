import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { createInstance } from '../../../Axios/Axios';


function groupBookingData(data) {
    const groupedData = data.reduce((acc, curr) => {
      const {  Status } = curr;
  
      const existingEntry = acc.find((entry) => entry.Status === Status);
  
      if (existingEntry) {
        existingEntry.count++; 
      } else {
        const newEntry = {
          Status,
          count: 1,
        };
        acc.push(newEntry);
      }
  
      return acc;
    }, []);
  
    const sortedData = groupedData.sort((a, b) => b.count - a.count); 
    
    return sortedData;
  }
  



function Piechart() {

    const [bookingData, setBookingData] = useState([])

    const admintoken = localStorage.getItem('admintoken')


    useEffect(() => {
        const bookingData = async () => {
            try {

                const axiosInstance = createInstance(admintoken)

                const response = await axiosInstance.get('admin/bookings')

                if (response.status === 200) {
                    setBookingData(response.data.bookingData)
                } else {
                    console.log('error');
                }
            } catch (error) {
                console.log(error);
            }
        }
        bookingData()
    }, [])

    if (!bookingData.length) {
        return null;
    }

    const groupedData = groupBookingData(bookingData);

    const COLORS = ['#D4D416', '#30D727', '#C71009', '#21ACCF'];


    return (
        <div className="chart-container">
            <h2 className='p-3 text-center'>Total Bookings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={groupedData}
              dataKey="count" 
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
                return (
                  <text x={x} y={y} fill="#000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${groupedData[index].Status} (${(percent * 100).toFixed(0)}%)`}
                  </text>
                );
              }}
            >
              {groupedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Tooltip formatter={(value) => `Count: ${value}`}  />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
}

export default Piechart