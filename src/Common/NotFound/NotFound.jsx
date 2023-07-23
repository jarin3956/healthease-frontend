import React from 'react'
import {
    MDBCard,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

function NotFound() {
    return (
        <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
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
    )
}

export default NotFound