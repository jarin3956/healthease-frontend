import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Grid from '@mui/material/Grid';
import './News.scss';


function News() {

    const newsApi = `70b8e6622e3343cea2178a2ce3f8c6d3`;
    const apiUrl = 'https://newsapi.org/v2/top-headlines';

    const [news, setNews] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [displayCount, setDisplayCount] = useState(4);

    const params = {
        apiKey: newsApi,
        q: 'medical',
        category: 'health',
        language: 'en',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, { params });
                
                setNews(response.data.articles);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };
        fetchData();
    }, []);


    const handleSeeMore = () => {
        if (showMore) {
            setDisplayCount(4);
        } else {
            setDisplayCount(news.length);
        }
        setShowMore(!showMore);
    }

    return (
        <>
            <Grid container spacing={2}>
                {news.slice(0, displayCount).map((article, index) => (
                    <Grid key={index} item xs={12} md={6}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                            <div className='newscard' >
                                <div style={{ flex: 1 }}>
                                    <img src={article.urlToImage} alt={article.title} onError={(e) => {
                                        e.target.src = '/Noimage.jpg';
                                    }} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px', overflow: 'hidden' }}>
                                    <h3 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '500', color: 'rgb(70, 166, 210)' }}>{article.title}</h3>
                                </div>
                            </div>
                        </a>
                    </Grid>
                ))}
            </Grid>
            
            <button className="shobutton" onClick={handleSeeMore}>
                <span className="text">{showMore ? 'Show Less' : 'Show More'}</span>
                <svg className="arrow" viewBox="0 0 448 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                </svg>
            </button>
        </>
    )
}

export default News