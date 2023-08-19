import React, { useEffect, useState } from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { createInstance } from '../../Axios/Axios';
import Swal from 'sweetalert2';
import NotFound from '../../Common/NotFound/NotFound';
import './ViewPrescription.scss';
import html2pdf from 'html2pdf.js';


function ViewPrescription() {



    const handleDownloadPDF = () => {
        const element = document.getElementById('pdf-content'); 
        const opt = {
          margin:       [0.5, 0.5, 0.5, 0.5],
          filename:     'prescription.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        html2pdf().from(element).set(opt).save();
      };



    const url = new URL(window.location.href);
    const bookingId = url.pathname.split('/').pop();

    const token = localStorage.getItem('token')
    const [prescription, setPrescription] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [user, setUser] = useState(null)

    const viewPrescription = async (bookingId) => {
        try {
            
            const axiosInstance = createInstance(token)

            const response = await axiosInstance.get(`booking/view-user-prescription/${bookingId}`)

            if (response.status === 200) {
                setPrescription(response.data.presc);
                setDoctor(response.data.doctor);
                setUser(response.data.user);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (bookingId) {
            viewPrescription(bookingId)
        }
    }, [])

    const formattedDate = prescription ? new Date(prescription.createdAt).toLocaleString() : '';

    return (
        <>
            <section className="card p-3 py-4   rounded-0 " style={{ backgroundColor: 'rgb(70, 166, 210)', minHeight: '90vh' }} >
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="6" className="mb-4 mb-lg-0">
                        {prescription && doctor && user ? (
                            <>
                            <div className='d-flex justify-content-center p-3'>
                                <button className="down-pres-button" onClick={handleDownloadPDF}>
                                    <span className="button__text">Download</span>
                                        <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" id="bdd05811-e15d-428c-bb53-8661459f9307" data-name="Layer 2" class="svg"><path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg></span>
                                </button>
                            </div>
                            <div id="pdf-content">
                            <MDBCard className="mb-3"   style={{ borderRadius: '.5rem' }}>
                                    <MDBRow className="g-0">
                                        <MDBCol md="4" className="gradient-custom-adtble text-center text-white"
                                            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                            <MDBCardImage src={`/DocImages/${doctor.profileimg}`}
                                                alt="Avatar" className=" rounded-3 my-5" style={{ width: '80px' }} fluid />
                                            <MDBTypography tag="h5" className='text-black' >Dr.{doctor.name}</MDBTypography>
                                            <MDBCardText className='text-black' >{doctor.specialization}</MDBCardText>
                                            <MDBIcon far icon="edit mb-5" />
                                        </MDBCol>
                                        <MDBCol md="8">
                                            <MDBCardBody className="p-4">
                                                <MDBTypography tag="h6">HealthEase</MDBTypography>
                                                <hr className="mt-0 mb-2" />
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="4" className="mb-2">
                                                        <MDBTypography tag="h6">Date :</MDBTypography>
                                                    </MDBCol>
                                                    <MDBCol size="8" className="mb-2">
                                                        <MDBCardText className="text-muted">{formattedDate}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="8" className="mb-2">
                                                        <MDBTypography tag="h6">{user.name}</MDBTypography>
                                                        <MDBCardText className="text-muted">{user.age ? 'AGE : '+ user.age :user.email}, {user.gender ? 'GENDER : '+ user.gender :''}</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol size="4" className="mb-2">
                                                        <MDBCardImage src={user.image ? `/UserImages/${user.image}` : user.picture}
                                                            alt="Avatar" className=" rounded-3" style={{ width: '80px' }} fluid />
                                                    </MDBCol>
                                                </MDBRow>
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="12" className="mb-3">
                                                        <MDBTypography tag="h6">Prescription</MDBTypography>
                                                        <MDBCardText className="text-muted">{prescription.prescription}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>


                                                <MDBRow className="pt-1">
                                                    <MDBCol size="12" className="mb-3">
                                                        <MDBTypography tag="h6">Description</MDBTypography>
                                                        <MDBCardText className="text-muted">{prescription.description}</MDBCardText>
                                                    </MDBCol>
                                                    
                                                </MDBRow>
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="12" className="mb-3">
                                                        <MDBTypography tag="h6">Recomentation</MDBTypography>
                                                        <MDBCardText className="text-muted">{prescription.recomentation ? prescription.recomentation : 'No recomentation'}</MDBCardText>
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
                            </div>
                            
                                
                            </>
                            
                            ) : (
                                <NotFound />
                            )}

                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>
        </>
    )
}

export default ViewPrescription