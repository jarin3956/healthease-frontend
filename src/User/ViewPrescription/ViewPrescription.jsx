import React, { useEffect, useState } from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import axiosinstance from '../../Axios/Axios';
import Swal from 'sweetalert2';
import NotFound from '../../Common/NotFound/NotFound';


function ViewPrescription() {
    const url = new URL(window.location.href);
    const bookingId = url.pathname.split('/').pop();

    const token = localStorage.getItem('token')
    const [prescription, setPrescription] = useState(null)

    const viewPrescription = async (bookingId) => {
        try {
            const response = await axiosinstance.get(`booking/view-user-prescription/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
            if (response.status === 200) {
                setPrescription(response.data.presc)
            }

        } catch (error) {
            if (error.response) {
                const status = error.response.status
                if (status === 404 || status === 500) {
                    Swal.fire({
                        icon: 'Error',
                        title: 'Error!',
                        text: error.response.data.message + 'Please try again later',
                        confirmButtonText: 'OK',
                    })
                }

            } else {
                Swal.fire({
                    icon: 'Error',
                    title: 'Error!',
                    text: 'Something went wrong, Please try again later',
                    confirmButtonText: 'OK',
                })
            }
            console.log(error);
        }
    }

    useEffect(() => {
        if (bookingId) {
            viewPrescription(bookingId)
        }
    }, [])

    return (
        <>
            <section className="card p-3 py-4   rounded-0 " style={{ backgroundColor: 'rgb(70, 166, 210)' ,minHeight:'90vh'}} >
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="6" className="mb-4 mb-lg-0">

                            {prescription ? (
                                <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                                    <MDBRow className="g-0">
                                        {/* <MDBCol md="4" className="gradient-custom-adtble text-center text-white"
                                        style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                        <MDBCardImage src={`/DocImages/${doctor.profileimg}`}
                                            alt="Avatar" className=" rounded-3 my-5" style={{ width: '80px' }} fluid />
                                        <MDBTypography tag="h5" className='text-black' >Dr.{doctor.name}</MDBTypography>
                                        <MDBCardText className='text-black' >{doctor.specialization}</MDBCardText>
                                        <MDBIcon far icon="edit mb-5" />
                                    </MDBCol> */}
                                        <MDBCol md="8">
                                            <MDBCardBody className="p-4">
                                                <MDBTypography tag="h6">Doctor Information</MDBTypography>
                                                <hr className="mt-0 mb-4" />
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Doc Id</MDBTypography>
                                                        <MDBCardText className="text-muted">{prescription.docId}</MDBCardText>
                                                    </MDBCol>
                                                    {/* <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Experience</MDBTypography>
                                                    <MDBCardText className="text-muted">{doctor.experience} Years</MDBCardText>
                                                </MDBCol> */}
                                                </MDBRow>


                                                <MDBRow className="pt-1">
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Description</MDBTypography>
                                                        <MDBCardText className="text-muted">{prescription.description}</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Prescription</MDBTypography>
                                                        <MDBCardText className="text-muted">{prescription.prescription}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Recomentation</MDBTypography>
                                                        <MDBCardText className="text-muted">{prescription.recomentation ? prescription.recomentation : 'No recomentation'}</MDBCardText>
                                                    </MDBCol>
                                                    {/* <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Rating</MDBTypography>
                                                    <MDBCardText className="text-muted">None</MDBCardText>
                                                </MDBCol> */}
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
                            ) : (
                                <NotFound/>
                            )}


                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>
        </>
    )
}

export default ViewPrescription