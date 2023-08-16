import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { createInstance } from '../../Axios/Axios'
import './Payment.scss'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux'
import { removeBooking } from '../../Redux- toolkit/bookingsSlice'
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

function Payment() {

    const navigate = useNavigate()

    const selector = useSelector((state) => state.bookings.booking)

    const [doctor, setDoctor] = useState(null)
    const [view, setView] = useState(false)
    const [userWallet, setUserWallet] = useState(false)
    const [walletBalance, setWalletBalance] = useState(null)
    const [selectedPayment, setSelectedPayment] = useState('paypal');

    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.value);
    };

    const dispatch = useDispatch()


    useEffect(() => {
        const fetchData = async () => {
            if (selector !== undefined && selector !== null) {
                let docId = selector.docId;
                
                try {

                    const axiosInstance = createInstance(token)

                    const response = await axiosInstance.get(`booking/load-doctors/${docId}`)

                    if (response.status === 200) {
                        setDoctor(response.data.doctorData)
                    } else {
                        toast.error('Cannot process now, Please try after sometime');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        if (selector !== undefined && selector !== null) {
            fetchData();
        }
    }, [selector]);


    const verifySlotAvailability = async (paymentType) => {

        const verifyData = {
            selectedDay: selector.selectedDay,
            selectedTime: selector.selectedTime,
            docId: selector.docId,
            paymentType: paymentType
        }
        console.log(selector, 'selector for booking data');


        try {

            const axiosInstance = createInstance(token)

            const response = await axiosInstance.post('booking/check-doc-availability', {
                verifyData
            });

            if (response.status === 200) {
                if (verifyData.paymentType === 'paypal') {
                    setView(true);
                } else if (verifyData.paymentType === 'wallet') {
                    walletBooking()
                }
            }
            else {
                toast.error('Cannot process the request now, Please try after sometime.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const walletBooking = async () => {
        const bookingData = {
            selectedDay: selector.selectedDay,
            selectedTime: selector.selectedTime,
            selectedDate: selector.selectedDate,
            docId: selector.docId,
            final_fare: doctor.final_fare
        }
        try {

            const axiosInstance = createInstance(token)

            const response = await axiosInstance.post('booking/wallet-booking-data' , {
                bookingData
            });

            if (response.status === 200) {

                const { Booked_date, Booked_day, Booked_timeSlot, Fare, Payment_id, _id } = response.data.bookingData;
                const alertMessage = `<div style="text-align: left;">
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
                    navigate('/home') ;
                });
            }
            else {
                toast.error('Cannot process the request now, Please try after sometime.')
            }

        } catch (error) {
            console.log(error);
        }
    }

    const openPayment = () => {
        verifySlotAvailability('paypal')
    }

    const openWalletPayment = () => {
        verifySlotAvailability('wallet')
    }

    const paypal = useRef()

    const token = localStorage.getItem('token')


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
                                    selectedDay: selector.selectedDay,
                                    selectedTime: selector.selectedTime,
                                    selectedDate: selector.selectedDate,
                                    docId: selector.docId,
                                    final_fare: doctor.final_fare,
                                    payment_create_time: order.create_time,
                                    payment_update_time: order.update_time,
                                    payment_id: order.id
                                };

                                try {

                                    const axiosInstance = createInstance(token)

                                    const response = await axiosInstance.post('booking/bookings-data', {
                                        paymentData
                                    });

                                    if (response.status === 200) {

                                        dispatch(removeBooking())

                                        const { Booked_date, Booked_day, Booked_timeSlot, Fare, Payment_id, _id } = response.data.bookingData;
                                        const alertMessage = `<div style="text-align: left;">
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
                                            navigate('/home');
                                        });
                                    }
                                    else {
                                        toast.error('Cannot process the reques now, Please try after sometime')
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

    return (
        <>
            <ToastContainer />

            <div className="payment-cookieCard ">
                <div className="payment-contentWrapper">
                    {!view && (
                        <div className="payment-sch-panel rounded-3 m-2">
                            {doctor && (
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
                                                Selected Day :{selector.selectedDay}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Selected Time Slot :{selector.selectedTime}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Selected Date :{selector.selectedDate}
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
                                            {/* <button onClick={selectedPayment === 'paypal' ? openPayment : checkWallet}>Pay</button> */}
                                            <CenteredButton size="small" onClick={selectedPayment === 'paypal' ? openPayment : checkWallet} >PAY </CenteredButton>
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
                                                        <CenteredButton size="small" onClick={openWalletPayment}  >PAY using Wallet </CenteredButton>
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

export default Payment