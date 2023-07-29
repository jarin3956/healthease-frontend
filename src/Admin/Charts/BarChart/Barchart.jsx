import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend , ResponsiveContainer } from 'recharts';
import axiosinstance from '../../../Axios/Axios';

import './Barchart.scss'


function getMonthName(monthNum) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months[monthNum];
}


function groupBookingData(data) {
    const groupedData = data.reduce((acc, curr) => {
        const { Booked_date, Status } = curr;
        const date = new Date(Booked_date);
        const year = date.getFullYear();
        const month = date.getMonth(); 
        const monthName = getMonthName(month);
        const monthYear = `${monthName} ${year}`; 

        const existingEntry = acc.find((entry) => entry.monthYear === monthYear);

        if (existingEntry) {
            existingEntry[Status]++;
        } else {
            const newEntry = {
                monthYear,
                CANCELLED: 0,
                PENDING: 0,
                COMPLETED: 0,
                FAILED: 0,
            };
            newEntry[Status] = 1;
            acc.push(newEntry);
        }

        return acc;
    }, []);

    // console.log('groupedData:', groupedData);

    return groupedData;
}






function Barchart() {



    const [bookingData, setBookingData] = useState([])

    useEffect(() => {
        const bookingData = async () => {
            try {
                const response = await axiosinstance.get('admin/bookings')
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


    return (


        <div className="chart-container">
            <h2 className='p-3 text-center'>Monthly Bookings</h2>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart  data={groupedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthYear" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="CANCELLED" fill="#C71009" />
                <Bar dataKey="PENDING" fill="#21ACCF" />
                <Bar dataKey="COMPLETED" fill="#30D727" />
                <Bar dataKey="FAILED" fill="#D4D416" />
            </BarChart>
            </ResponsiveContainer>
             
           
        </div>



    )
}

export default Barchart