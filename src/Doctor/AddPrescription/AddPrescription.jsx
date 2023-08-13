import React,{ useState } from 'react'
import './AddPrescription.scss'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosinstance from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';

function AddPrescription() {

    const url = new URL(window.location.href);
    const bookingId = url.pathname.split('/').pop();

    const [description, setDescription] = useState('');
    const [prescription, setPrescription] = useState('');
    const [recomentations, serRecomentations] = useState('');

    const doctortoken = localStorage.getItem('doctortoken');
    const navigate = useNavigate()

    const updatePrescription = async (e) => {
        e.preventDefault();

        if (description.length < 10 || prescription.length < 10) {
            toast.error('Description and Prescription must contain at least 10 characters.');
            return;
        }

        const prescriptionData = {
            bookingId,
            description,
            prescription,
            recomentations
        }

        try {
            
            const response = await axiosinstance.post('booking/submit-prescription',prescriptionData, {
                headers: {
                    Authorization: `Bearer ${doctortoken}`,
                  },
            })
            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/doctor/view-schedule')
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status
                if (status === 400 || status === 404 || status === 500) {
                    toast.error(error.response.data.message+', Please try after sometime')
                }else if (status === 409) {
                    toast.error(error.response.data.message+', Will be updated soon')
                }
            } else {
                toast.error('Something went wrong, Please try after sometime')   
            }
            console.log(error);
        }
    }

    return (
        <>
        <ToastContainer />
            <div className="add-Prescription">
                <div className='add-pre-main'>
                    <form className="add-pre-form p-2" >
                        <p className="add-pre-heading">Add Prescription</p>
                        <div className="add-pre-cont">
                            <input placeholder="Description" className="pre-spl-inputField" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="add-pre-cont">
                            <input placeholder="Prescription" className="pre-spl-inputField" type="text" value={prescription} onChange={(e) => setPrescription(e.target.value)} />
                        </div>
                        <div className="add-pre-cont">
                            <input placeholder="Recomentation" className="pre-spl-inputField" type="text" value={recomentations} onChange={(e) => serRecomentations(e.target.value)} />
                        </div>
                        <button className="add-pre-butt" onClick={(e) => updatePrescription(e)} >Save</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddPrescription