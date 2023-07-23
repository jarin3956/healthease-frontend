import React, { useState } from 'react';
import './Contactusp.scss';
import Swal from 'sweetalert2';

const Contactusp = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    setLoading(true);

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzBzBFIUcOYcWgv7gLvdMCCWIFm0oCHRkRGWWUncVJfTsxIj33q9Dm4nZqU9TrON6bg/exec', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        form.reset();
        Swal.fire('Success!', 'We will contact you soon.', 'success');
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Oops!', 'Something went wrong. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const Alert = ({ message, onClose }) => {
    return (
      <div className="alert">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  const closeAlert = () => {
    setAlertMessage('');
  };

  return (
    <>


      <div className="txtcontainer" style={{ maxWidth: "1750px" }}>
        <div className="con-cookieCard ">
          <div className="con-contentWrapper">
            <p className="cookieHeading mt-3">Contact Us</p>

            {alertMessage && <Alert message={alertMessage} onClose={closeAlert} />}
            <form
              action="forms/contact.php"
              method="post"
              role="form"
              className="php-email-form mt-4"
              id="frmSubmit"
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="col-md-6 form-group">
                  <input
                    pattern="^[a-zA-Z\s]+$"
                    title="Contains only alphabet"
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input
                    pattern="^\S+@\S+\.\S+$"
                    title="Not a correct email format"
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    required
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <textarea
                  pattern="^.+$"
                  title="Include anything"
                  className="form-control"
                  name="message"
                  rows="5"
                  placeholder="Message"
                  required
                />
              </div>
              <br />
              <div className="text-center">
                <button type="submit" className="acceptButton rounded-3" disabled={loading}>
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


    </>
  );
};

export default Contactusp;
