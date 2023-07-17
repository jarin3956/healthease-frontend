import React from 'react'
import {
    MDBCarousel,
    MDBCarouselItem,
} from 'mdb-react-ui-kit';


function Banner() {
    return (
        <>
            <div className='p-3'>
                <MDBCarousel showIndicators showControls fade>
                    <MDBCarouselItem
                        className='w-100  d-block'
                        itemId={1}
                        src='/Endocrinology.jpg'
                        style={{ height: '500px' }}
                        alt='...'
                    >
                        <h5>First slide label</h5>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </MDBCarouselItem>

                    <MDBCarouselItem
                        className='w-100 d-block'
                        itemId={2}
                        src='/general medicine.jpg'
                        style={{ height: '500px' }}
                        alt='...'
                    >
                        <h5>Second slide label</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </MDBCarouselItem>

                    <MDBCarouselItem
                        className='w-100 d-block'
                        itemId={3}
                        src='/Neurology.jpg'
                        style={{ height: '500px' }}
                        alt='...'
                    >
                        <h5>Third slide label</h5>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </MDBCarouselItem>
                </MDBCarousel>
            </div>

        </>
    )
}

export default Banner