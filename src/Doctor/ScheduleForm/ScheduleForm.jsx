import React from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCardBody,
    MDBCard,
} from "mdb-react-ui-kit";

import './ScheduleForm.scss'


function ScheduleForm({ selectedDays, selectedTimeSlotsByDay, handleSubmit, handleDaySlotClick, handleTimeSlotClick, day, timeSlots }) {
    function TimeSlotBox({ timeSlot, daySlot, isSelected, handleClick }) {
        const className = `time-slot-boxx ${isSelected ? 'selected' : ''}`;

        return (
            <div className={className} onClick={() => handleClick(timeSlot, daySlot)}>
                {timeSlot}
            </div>
        );
    }


    function DaySlotBox({ daySlot, isSelected, handleClick }) {
        const className = `day-slot-boxx ${isSelected ? 'selected' : ''}`;

        return (
            <div className={className} onClick={() => handleClick(daySlot)}>
                {daySlot}
            </div>
        );
    }
    return (
        <>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="12" xl="8">
                        <MDBCard style={{ borderRadius: "10px" }}>
                            <MDBCardBody >
                                <MDBCard className="shadow-0 border-0 m-4">
                                    <MDBRow>
                                        <form onSubmit={handleSubmit}>
                                            <h3 className='text-center the-first-heading'>Select your preferred day</h3>
                                            <div className="day-slot-container-fo">
                                                {day.map((daySlot) => (
                                                    <DaySlotBox
                                                        key={daySlot}
                                                        daySlot={daySlot}
                                                        isSelected={selectedDays.includes(daySlot)}
                                                        handleClick={handleDaySlotClick}
                                                    />
                                                ))}
                                            </div>

                                            {selectedDays.map((selectedDay) => (
                                                <div key={selectedDay}>
                                                    <h3 className="text-center the-first-heading">Available Time Slots for {selectedDay}</h3>
                                                    <div className="time-slot-container-fo">
                                                        {timeSlots.map((timeSlot) => (
                                                            <TimeSlotBox
                                                                key={timeSlot}
                                                                timeSlot={timeSlot}
                                                                daySlot={selectedDay}
                                                                isSelected={selectedTimeSlotsByDay[selectedDay]?.includes(timeSlot)}
                                                                handleClick={handleTimeSlotClick}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="time-set-butt-fo">
                                                <button type="submit" className="timesubmit-button">
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </MDBRow>
                                </MDBCard>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    )
}

export default ScheduleForm