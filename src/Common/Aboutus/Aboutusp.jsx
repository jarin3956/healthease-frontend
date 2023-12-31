import React from 'react'
import './Aboutusp.scss'
function Aboutusp({ user }) {
    return (
        <>

            <div className="txtcontainer" style={{ maxWidth: "1750px" }}>
                <div className="ab-cookieCard ">
                    <div className="ab-contentWrapper">
                        <p className="ab-cookieHeading mt-3">About Us</p>
                        <h6 className="ab-cookieDescription">
                            HealthEase is a cutting-edge online medical consultation app that revolutionizes the way people access healthcare services. Our platform connects patients with a diverse network of qualified doctors and specialists, offering virtual consultations that are flexible, efficient, and personalized. With HealthEase, you can skip the long waiting times and appointment hassles, allowing you to receive prompt medical attention from the comfort of your own home.
                        </h6>
                        <h6 className="ab-cookieDescription">
                            Through our user-friendly interface, you can easily schedule appointments, securely share medical records and symptoms, and engage in video or chat consultations with healthcare professionals. Our team of experienced doctors is dedicated to providing comprehensive diagnoses, offering expert advice, and developing tailored treatment plans to address your specific needs.
                        </h6>
                        <h6 className="ab-cookieDescription">
                            HealthEase ensures that your sensitive medical information is handled with utmost confidentiality and adheres to strict privacy and security standards. We prioritize patient satisfaction and strive to deliver high-quality healthcare services that are accessible to all, breaking geographical barriers and providing healthcare solutions to individuals regardless of their location.
                        </h6>
                        <h6 className="ab-cookieDescription">
                            Experience the convenience and peace of mind that HealthEase brings, as we empower you to take control of your health journey with ease, convenience, and confidence. Say goodbye to long queues and limited accessibility, and embrace the future of medical consultations with HealthEase.
                        </h6>
                    </div>
                </div>
            </div>

        </>

    )
}

export default Aboutusp