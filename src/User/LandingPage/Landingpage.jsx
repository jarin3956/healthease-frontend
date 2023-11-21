import React, { useEffect, useState } from 'react';
import './Landingpage.scss';
import { axiosinstance } from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import News from '../../Common/News/News';


function Landingpage() {

    const [spec, setSpec] = useState([])

    useEffect(() => {
        const fetchSpec = async () => {
            try {
                const response = await axiosinstance.get('specialization/view')
                if (response.status === 200) {
                    setSpec(response.data.spec)
                } else {
                    toast.error('Could not process now, Please try after sometime');
                }
            } catch (error) {
                console.log(error);
            }

        }
        fetchSpec()
    }, [])


    return (
        <>
            <ToastContainer />
            <div className="land-cookieCard ">
                <div className='d-flex justify-content-center p-2' >
                    <img src="HEALTHEASE_BANNER.png" alt="HEALTHEASE" className="responsive-image" />
                </div>
                <div className="land-contentWrapper">
                    <p className='text-center the-main-head-land'>Book an appointment for an online consultation</p>
                    <div className='land-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                        {spec.map((special) => (
                            <Viewspec spec={special} />
                        ))}
                    </div>
                </div>
                <div className="land-contentWrapper">
                    <p className='text-center the-main-head-land'>News</p>
                    <News/>
                </div>
            </div>
        </>
    )
}

export default Landingpage