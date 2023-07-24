import React, { useEffect, useState } from 'react';
import './Landingpage.scss';
import axiosinstance from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';




function Landingpage() {

    const [spec, setSpec] = useState([])

    useEffect(() => {
        const fetchSpec = async () => {
            try {
                const response = await axiosinstance.get('specialization/view')
                console.log(response);
                setSpec(response.data.spec)
            } catch (error) {
                console.log(error);
            }

        }
        fetchSpec()
    }, [])




    return (
        <div className="land-cookieCard ">
            <p className='text-center the-main-head-land'>Embrace the future of medical consultations with HealthEase.</p>
            <div className='d-flex justify-content-center p-2' >
                <img src="LandingImage.png" alt="" className="responsive-image" />
            </div>
            <div className="land-contentWrapper">
                <p className='text-center the-main-head-land'>Book an appointment for an online consultation</p>
                <div className='land-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                    {spec.map((special) => (
                        <Viewspec spec={special} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Landingpage