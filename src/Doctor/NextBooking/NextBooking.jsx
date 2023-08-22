import React from 'react';
import ReactModal from 'react-modal';

function NextBooking({ isOpen, onClose, onOpenAnotherModal }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Example Modal"
        >
            <h2>Custom Modal</h2>
            <p>This is a custom modal content.</p>
            <button onClick={onOpenAnotherModal}>Open Another Modal</button>
            <button onClick={onClose}>Close</button>
        </ReactModal>
    )
}

export default NextBooking