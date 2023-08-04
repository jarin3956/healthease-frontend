import React from 'react'
import {
    MDBCard,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

function NotFound() {
    return (
        <div style={{background:'#3498eb',minHeight:'90vh'}} className='d-flex align-items-center' >
            <MDBContainer className="py-5 h-100">
            <MDBRow >
                <MDBCol lg="12" xl="12">
                    <MDBCard>
                        <picture>
                            <source srcSet="/nodata.png" media="(min-width: 576px)" />
                            <img src="/nodatamobile.png" alt="No data" className="img-fluid" />
                        </picture>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
        </div>
        
    )
}

export default NotFound