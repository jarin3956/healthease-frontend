import React from 'react'
import './DisplayCards.scss'

function DisplayCards() {
    const images = [
        'Insulinimg.jpg',
        'Xrayimg.png',
        'Sethimg.png',
        'Antibioticsimg.png',
       
    ];

    const descriptions = [
        "Insulin's history, vital for diabetes, began in 1921 with Banting and Best's discovery. Extracted from animals, it saved lives. Later, human insulin was synthesized through genetic engineering, reducing immune reactions. Innovations led to diverse forms, like rapid-acting and long-lasting insulin analogs. While revolutionary, insulin access remains challenging due to costs.",
        "X-rays, a breakthrough in medical imaging, were discovered in 1895 by Wilhelm Conrad Roentgen. These electromagnetic waves penetrate tissues, revealing internal structures. Initially used for bone fractures, X-rays transformed medical diagnosis. Despite their convenience, excessive exposure can be harmful due to radiation. Advances like digital radiography and CT scans enhance accuracy and safety.",
        "Stethoscope's history dates to the early 19th century. Laennec's invention revolutionized medicine, enabling direct auscultation of internal sounds. Wooden tubes gave way to modern designs with dual-sided chest pieces for varied frequencies. Electronic stethoscopes amplified sounds, aiding diagnosis. Despite technological advancements, the stethoscope endures as a symbol of medical practice.",
        "Fleming's accidental discovery of penicillin in 1928 marked a turning point, combating bacterial infections. This breakthrough led to the mass production of antibiotics, saving countless lives during wars and surgeries. However, overuse led to antibiotic resistance, a growing concern. Ongoing research seeks new solutions, from different classes of antibiotics to alternative therapies.",
        

    ]


    return (
        <>

            {images.map((imageName, index) => (
                <div className='thehomecontbox'>
                    <div key={index} className="hodisplaycardBox">
                        <div className="hodisplaycard">
                            <div className="doc-logo-container">
                                <img src={`/${imageName}`} alt="Logo" />
                            </div>

                            <div className="content">
                                <div className="h3">Do you know the history ?</div>
                                <p>{descriptions[index]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}


        </>
    )
}

export default DisplayCards