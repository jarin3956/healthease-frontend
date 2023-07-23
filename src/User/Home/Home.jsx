import React, { useEffect, useState } from 'react';
import './Home.scss';
import axiosinstance from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';

function Home() {


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
        <>

            <div className="">
                <div className="ho-cookieCard ">
                    <div className="ho-contentWrapper">
                        <p className="ho-cookieHeading mt-3">Home</p>
                        <p className='text-center the-main-head'>Book an appointment for an online consultation</p>
                        <div className='ho-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                            {spec.map((special) => (
                                <Viewspec spec={special} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Home