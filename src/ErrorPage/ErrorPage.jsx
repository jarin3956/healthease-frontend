import React, { useEffect, useRef } from 'react';
import { gsap, Linear } from 'gsap';
import './ErrorPage.scss'
function ErrorPage() {
    const containerRef = useRef(null);

    useEffect(() => {
        const t1 = gsap.timeline();
        const t2 = gsap.timeline();
        const t3 = gsap.timeline();

        t1.to('.cog1', {
            transformOrigin: '50% 50%',
            rotation: '+=360',
            repeat: -1,
            ease: Linear.easeNone,
            duration: 8,
        });

        t2.to('.cog2', {
            transformOrigin: '50% 50%',
            rotation: '-=360',
            repeat: -1,
            ease: Linear.easeNone,
            duration: 8,
        });

        t3.fromTo(
            '.wrong-para',
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 1,
                stagger: {
                    repeat: -1,
                    yoyo: true,
                },
            }
        );
    }, []);
    return (
        <>

            <div className="err-container rounded-3" ref={containerRef}>
                <h1 className="first-four">4</h1>
                <div className="cog-wheel1">
                    <div className="cog1">
                        <div className="top"></div>
                        <div className="down"></div>
                        <div className="left-top"></div>
                        <div className="left-down"></div>
                        <div className="right-top"></div>
                        <div className="right-down"></div>
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                </div>

                <div className="cog-wheel2">
                    <div className="cog2">
                        <div className="top"></div>
                        <div className="down"></div>
                        <div className="left-top"></div>
                        <div className="left-down"></div>
                        <div className="right-top"></div>
                        <div className="right-down"></div>
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                </div>

                <h1 className="second-four">4</h1>
                <p className="wrong-para">Uh Oh! Page not found!</p>
            </div>


        </>
    )
}

export default ErrorPage