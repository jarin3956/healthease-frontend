import React, { useState, useEffect } from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import './Viewdoctor.scss'
import { useLocation } from 'react-router-dom';
import { createInstance } from '../../Axios/Axios';



function Viewdoctor() {

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const doctorId = searchParams.get('id');

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const admintoken = localStorage.getItem('admintoken')


    const viewDoctorProfile = async (doctorId) => {
        try {

            const axiosInstance = createInstance(admintoken)

            const response = await axiosInstance.get(`admin/view-doctor-profile/${doctorId}`)

            if (response.status === 200) {
                setDoctor(response.data.doctorData);
            } else {
                setError(true);
            }
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (doctorId) {
            viewDoctorProfile(doctorId)
        }
    }, [location, doctorId])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !doctor) {
        return <div>Error occurred while fetching doctor's profile.</div>;
    }

    return (
        <>
            <section className="card p-3 py-4 mb-5  rounded-0 vh-100" style={{ backgroundColor: 'rgb(70, 166, 210)' }} >
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="6" className="mb-4 mb-lg-0">
                            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                                <MDBRow className="g-0">
                                    <MDBCol md="4" className="gradient-custom-adtble text-center text-white"
                                        style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                        <MDBCardImage src={doctor.profileimg}
                                            alt="Avatar" className=" rounded-3 my-5" style={{ width: '80px' }} fluid />
                                        <MDBTypography tag="h5" className='text-black' >Dr.{doctor.name}</MDBTypography>
                                        <MDBCardText className='text-black' >{doctor.specialization}</MDBCardText>
                                        <MDBIcon far icon="edit mb-5" />
                                    </MDBCol>
                                    <MDBCol md="8">
                                        <MDBCardBody className="p-4">
                                            <MDBTypography tag="h6">Doctor Information</MDBTypography>
                                            <hr className="mt-0 mb-4" />
                                            <MDBRow className="pt-1">
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Email</MDBTypography>
                                                    <MDBCardText className="text-muted">{doctor.email}</MDBCardText>
                                                </MDBCol>
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Experience</MDBTypography>
                                                    <MDBCardText className="text-muted">{doctor.experience} Years</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>


                                            <MDBRow className="pt-1">
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Age</MDBTypography>
                                                    <MDBCardText className="text-muted">{doctor.age} Years</MDBCardText>
                                                </MDBCol>
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Gender</MDBTypography>
                                                    <MDBCardText className="text-muted">{doctor.gender}</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className="pt-1">
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Fare</MDBTypography>
                                                    <MDBCardText className="text-muted">{doctor.fare} Rupees</MDBCardText>
                                                </MDBCol>
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Rating</MDBTypography>
                                                    <MDBCardText className="text-muted">None</MDBCardText>
                                                </MDBCol>
                                            </MDBRow>

                                            <div className="d-flex justify-content-start">
                                                <a href="#!"><MDBIcon fab icon="facebook me-3" size="lg" /></a>
                                                <a href="#!"><MDBIcon fab icon="twitter me-3" size="lg" /></a>
                                                <a href="#!"><MDBIcon fab icon="instagram me-3" size="lg" /></a>
                                            </div>
                                        </MDBCardBody>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>
        </>
    )
}

export default Viewdoctor