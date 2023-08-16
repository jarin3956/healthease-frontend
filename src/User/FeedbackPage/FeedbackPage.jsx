import React, { useState } from 'react'
import './FeedbackPage.scss'
import { createInstance } from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeedbackPage() {

    const url = new URL(window.location.href);
    const bookingId = url.pathname.split('/').pop();

    const token = localStorage.getItem('token');

    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');

    const navigate = useNavigate()

    const submitFeedback = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating.');
            return;
        }

        if (comments.length < 4) {
            toast.error('Comments must contain at least 4 characters.');
            return;
        }

        const feedbackData = {
            rating,
            comments,
            bookingId
        };


        try {

            const axiosInstance = createInstance(token)

            const response = await axiosInstance.post('booking/submit-feedback', feedbackData)

            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/home')
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <ToastContainer />

            <div className="Feedback-submit ">
                <div className='spl-reg-main'>
                    <form className="reg-spl-form-main p-2" >
                        <p className="reg-spl-heading">Share Your Feedback</p>
                        
                        <div className="reg-spl-inputContainer">
                            <div className="rating">
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <React.Fragment key={value}>
                                        <input
                                            value={value}
                                            name="rating"
                                            id={`star${value}`}
                                            type="radio"
                                            onChange={(e) => setRating(e.target.value)}
                                            checked={parseInt(rating) === value}
                                        />
                                        <label htmlFor={`star${value}`}></label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input placeholder="Comments" className="reg-spl-inputField" type="text" value={comments} onChange={(e) => setComments(e.target.value)} />
                        </div>
                        <button className="reg-splbutton" onClick={(e) => submitFeedback(e)} >Sent</button>
                        <p className='text-danger thespl-backbtn' >Not Now</p>
                    </form>
                </div>
            </div>

        </>
    )
}

export default FeedbackPage
