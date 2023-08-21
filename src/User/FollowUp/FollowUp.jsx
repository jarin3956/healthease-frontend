import React, { useEffect, useState, useRef } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { styled } from '@mui/system';
import { createInstance } from '../../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const CenteredButton = styled(Button)({
    display: 'block',
    margin: '0 auto',
    backgroundColor: 'rgb(70, 166, 210)',
    color: '#fff',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: 'black',
    },
    '&:active': {
        backgroundColor: 'black',
    },
});

function FollowUp() {

    const token = localStorage.getItem('token');

    const url = new URL(window.location.href);
    const bookingId = url.pathname.split('/').pop();

    const navigate = useNavigate()

    const [doctor, setDoctor] = useState([]);
    const [booking, setBooking] = useState([]);
    const [view, setView] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('paypal');
    const [userWallet, setUserWallet] = useState(false);
    const [walletBalance, setWalletBalance] = useState(null);



    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.value);
    };



    useEffect(() => {
        if (token) {
            const getBookingData = async () => {
                try {
                    const axiosInstance = createInstance(token)
                    const response = await axiosInstance.get(`booking/followup-bookingData/${bookingId}`);
                    if (response.status === 200) {
                        setDoctor(response.data.doctor);
                        setBooking(response.data.booking);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            getBookingData()
        }
    }, [])

    const openPayment = () => {
        setView(true)
    }

    const checkWallet = async () => {

        try {

            const axiosInstance = createInstance(token)
            const response = await axiosInstance.get('booking/check-wallet')
            if (response.status === 200) {
                setUserWallet(true)
                const formattedBalance = response.data.wallet.toFixed(2);
                setWalletBalance(formattedBalance)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Something went wrong, please try after sometime',
                    confirmButtonText: 'OK',
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const walletBooking = async () => {
        const paymentData = {
            bookingId,
            fare: doctor.final_fare
        }
        try {
            const axiosInstance = createInstance(token)
            const response = await axiosInstance.post('booking/followup-walletBooking', {
                paymentData
            })
            if (response.status === 200) {
                const { Booked_date, Booked_day, Booked_timeSlot, Fare, Payment_id, _id } = response.data.updatebooking;

                const alertMessage =
                    `<div style="text-align: left;">
                        <strong>Booking ID:</strong> ${_id}<br>
                        <strong>Payment ID:</strong> ${Payment_id}<br>
                        <strong>Amount:</strong> ${Fare}<br>
                        <strong>Booked Date:</strong> ${Booked_date}<br>
                        <strong>Booked Day:</strong> ${Booked_day}<br>
                        <strong>Time Slot:</strong> ${Booked_timeSlot}
                     </div>`;

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Successfully booked your slot',
                    confirmButtonText: 'OK',
                    html: alertMessage,
                    customClass: {
                        container: 'my-swal-container',
                        title: 'my-swal-title',
                        htmlContainer: 'my-swal-html-container',
                        confirmButton: 'my-swal-confirm-button',
                    },
                }).then(() => {
                    navigate('/view-Bookings');
                });
            }
        } catch (error) {
            console.log(error);
        }
    }


    const paypal = useRef()

    useEffect(() => {

        if (view) {
            window.paypal
                .Buttons({
                    style: {
                        color: 'blue',
                        shape: 'pill',
                        label: 'pay',
                    },
                    createOrder: (data, actions, err) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    description: "Welcome to HealthEase",
                                    amount: {
                                        currency_code: "USD",
                                        value: doctor.final_fare,
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {

                        try {
                            const order = await actions.order.capture();
                            console.log(order);

                            if (order.status === 'COMPLETED') {
                                toast.success('Payment Successfull')

                                const paymentData = {
                                    bookingId,
                                    payment_create_time: order.create_time,
                                    payment_update_time: order.update_time,
                                    payment_id: order.id
                                };

                                try {

                                    const axiosInstance = createInstance(token)

                                    const response = await axiosInstance.post('booking/followUp-paymentdata', {
                                        paymentData
                                    });

                                    if (response.status === 200) {

                                        const { Booked_date, Booked_day, Booked_timeSlot, Fare, Payment_id, _id } = response.data.updatebooking;

                                        const alertMessage =
                                            `<div style="text-align: left;">
                                            <strong>Booking ID:</strong> ${_id}<br>
                                            <strong>Payment ID:</strong> ${Payment_id}<br>
                                            <strong>Amount:</strong> ${Fare}<br>
                                            <strong>Booked Date:</strong> ${Booked_date}<br>
                                            <strong>Booked Day:</strong> ${Booked_day}<br>
                                            <strong>Time Slot:</strong> ${Booked_timeSlot}
                                        </div>`;

                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Success!',
                                            text: 'Successfully booked your slot',
                                            confirmButtonText: 'OK',
                                            html: alertMessage,
                                            customClass: {
                                                container: 'my-swal-container',
                                                title: 'my-swal-title',
                                                htmlContainer: 'my-swal-html-container',
                                                confirmButton: 'my-swal-confirm-button',
                                            },
                                        }).then(() => {
                                            navigate('/view-Bookings');
                                        });
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            } else {
                                toast.warning('Payment status :' + order.status)
                            }
                        } catch (error) {
                            console.log("Payment error", error);
                            toast.error('Payment failed')
                        }
                    },
                    onError: (err) => {
                        console.error("Payment error:", err);
                        toast.error("Payment failed!");
                    },

                })
                .render(paypal.current);
        }

    }, [view, doctor]);




    return (
        <>
            <ToastContainer />
            <div className="payment-cookieCard ">
                <div className="payment-contentWrapper">
                    {!view && (
                        <div className="payment-sch-panel rounded-3 m-2">
                            {bookingId && (
                                <div className='p-2' >
                                    <Card sx={{ maxWidth: 330 }}>
                                        <CardMedia
                                            component="img"
                                            alt="specialization"
                                            height="140"
                                            src={`/DocImages/${doctor.profileimg}`}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Dr.{doctor.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Specialization :{doctor.specialization}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Amount :{doctor.final_fare}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Selected Day :{booking.Booked_day}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Selected Time Slot :{booking.Booked_timeSlot}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Selected Date :{booking.Booked_date}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <div>
                                                <input
                                                    type="radio"
                                                    value="paypal"
                                                    checked={selectedPayment === 'paypal'}
                                                    onChange={handlePaymentChange}
                                                />
                                                <label>PAY ₹ {doctor.final_fare} using PayPal</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio"
                                                    value="wallet"
                                                    checked={selectedPayment === 'wallet'}
                                                    onChange={handlePaymentChange}
                                                />
                                                <label>PAY ₹ {doctor.final_fare} using Wallet</label>
                                            </div>
                                        </CardActions>

                                        <CardActions>
                                            <CenteredButton size="small" onClick={selectedPayment === 'paypal' ? openPayment : checkWallet} > PAY </CenteredButton>
                                        </CardActions>
                                        {userWallet && (
                                            <>
                                                <CardContent>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Walllet Balance :{walletBalance} Rupees
                                                    </Typography>
                                                </CardContent>
                                                {walletBalance >= doctor.final_fare ? (
                                                    <CardActions>
                                                        <CenteredButton size="small" onClick={walletBooking} >PAY using Wallet </CenteredButton>
                                                    </CardActions>
                                                ) : (
                                                    <CardContent>
                                                        <Typography variant="body2" color="text.danger">
                                                            Not enough balance
                                                        </Typography>
                                                    </CardContent>
                                                )}
                                            </>
                                        )}
                                    </Card>
                                </div>
                            )}
                        </div>
                    )}

                    {view && (
                        <div className='razorpay-box rounded-3 m-2' >
                            <div ref={paypal}></div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default FollowUp