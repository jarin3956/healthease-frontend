import React from 'react';
import {MDBFooter} from 'mdb-react-ui-kit';

function Footer() {

  return (
    <MDBFooter className='text-center text-white' style={{ backgroundColor: '#0490DB' }}>
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2023 Copyright:
        <a className='text-white text-decoration-none' href='https://jarin3956.github.io/JarinJayamurali/'>
           Jarin Jayamurali
        </a>
      </div>
    </MDBFooter>
  );
}

export default Footer;