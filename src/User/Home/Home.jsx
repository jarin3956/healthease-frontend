import React, { useEffect, useState } from 'react';
import './Home.scss';
import { createInstance } from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';
import DisplayCards from '../DisplayCards/DisplayCards';


function Home() {

    const token = localStorage.getItem('token')
    const [spec, setSpec] = useState([])

    useEffect(() => {
        if (token) {
            const fetchSpec = async () => {
                
                try {

                    const axiosInstance = createInstance(token)

                    const response = await axiosInstance.get('view-specialization')

                    if (response.status === 200) {
                        setSpec(response.data.spec)
                    }

                } catch (error) {
                    console.log(error);
                }
            }
            fetchSpec()
        }
    }, [])


    return (
        <>
            <div className="">
                <div className="ho-cookieCard ">
                    <div >
                        <p className="ho-cookieHeading mt-3 text-center">Home</p>
                        <p className='text-center the-main-head'>Book an appointment for an online consultation</p>
                        <div className='ho-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                            {spec && spec.map((special) => (
                                <Viewspec spec={special} />
                            ))}
                        </div>
                        <p className='text-center m-3' style={{ fontSize: '40px', fontWeight: '500' }}>Medical History</p>
                        <div className='thedisCard row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-4'  >
                            <DisplayCards />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Home