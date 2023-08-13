import React, { useState, useEffect } from 'react'
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosinstance from '../../Axios/Axios';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCardBody,
    MDBCard,
} from "mdb-react-ui-kit";
import DocBarchart from '../Charts/DocBarchart/DocBarchart';
import DocLinechart from '../Charts/DocLinechart/DocLinechart';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            };
            newEntry[Status] = 1;
            acc.push(newEntry);
        }

        return acc;
    }, []);

    // console.log('groupedData of the doc :', groupedData);

    return groupedData;
}


function DocChart({ chartData }) {

    const [bookingData, setBookingData] = useState([])

    const targetId = chartData;

    const [revenueData, setRevenueData] = useState([]);

    const doctortoken = localStorage.getItem('doctortoken')

    useEffect(() => {
        const bookingData = async () => {
            try {
                const response = await axiosinstance.get('doctor/load-all-bookings',{
                    headers: {
                        Authorization: `Bearer ${doctortoken}`
                    }
                })
                if (response.status === 200) {

                    const sortedData = response.data.bookingData.filter((a) => {
                        if (a.DocId === targetId) {
                            // console.log(a);
                            return a;
                        }
                    });

                    setBookingData(sortedData);
                    setRevenueData(sortedData)
                } else {
                    toast.error('Something went wrong, Please try after sometime.')
                }
            } catch (error) {
                if (error.response) {
                    const status = error.response.status
                    if (status === 404 || status === 500) {
                        toast.error(error.response.data.message + 'Please try after sometime.')
                    }
                } else {
                    toast.error('Something went wrong, Please try after sometime.')
                }
                console.log(error);
            }
        }
        bookingData()
    }, []);

    if (!bookingData.length) {
        return null;
    }

    const groupedData = groupBookingData(bookingData);

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
            Revenue: revenueByMonth[month],
          };
        });
        return dataForChart;
      };
    
      const docRevenueData = formatDataForChart();


    return (


        <>
         <ToastContainer />
            <MDBContainer className="py-5">
                <MDBCard style={{ borderRadius: "10px" }}>
                    <MDBCardBody className="p-4">
                        <MDBCard className="shadow-0 border-0 m-4">
                            <MDBRow className="text-center">
                                <h2 className='p-3 text-center'>Your Bookings</h2>
                                <div >
                                    <div className="row row-cols-1 row-cols-md-1 row-cols-lg-2 ">
                                        <div className='the-chart-area'>
                                            <DocBarchart groupedData={groupedData} />
                                        </div>
                                        <div className='the-chart-area'>
                                            <DocLinechart docRevenueData={docRevenueData} />
                                        </div>
                                    </div>
                                </div>
                            </MDBRow>
                        </MDBCard>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </>

    )
}

export default DocChart