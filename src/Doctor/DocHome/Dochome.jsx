import React from 'react';
import { useSelector } from 'react-redux';
import './DocHome.scss';

function Dochome() {
  const selector = useSelector((state) => state.schedule.schedule);

  return (
    <>
      <div className="mx-4 mt-5">
        <section className="rounded-3 doc-home-page">
        
          <div className="p-2">
          <p className="cookieHeading text-center mt-3">Your Schedule</p>
            <div className="home-sch-panel rounded-3">
              {selector && selector.schedule && Object.keys(selector.schedule).length > 0 ? (
                <>
                  <h3 className="text-center the-first-text">Selected Dates</h3>
                  <div className="view-day-slot-container">
                    {Object.values(selector.schedule).map((day) => (
                      <div className="view-day-box" key={day.day}>
                        <h6>{day.day}</h6>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-center the-first-text">Selected Time Slots</h3>
                  <div className="view-time-slot-container">
                    {Object.values(selector.schedule)[0].time.map((time) => (
                      <div className="view-time-box" key={time.timeslot}>
                        <h6>{time.timeslot}</h6>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <h1>Please Schedule</h1>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dochome;
