import { useEffect, useState } from "react";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import './Books.scss'

function Books() {

    const [books, setBooks] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [displayCount, setDisplayCount] = useState(4);
    const query = 'medicine';

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=${query}`
                );

                if (response.data.items && response.data.items.length > 0) {
                    setBooks(response.data.items);
                } else {
                    setBooks([]);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
            }
        };

        fetchBooks();
    }, [query]);

    const handleSeeMore = () => {
        if (showMore) {
            setDisplayCount(4);
        } else {
            setDisplayCount(books.length);
        }
        setShowMore(!showMore);
    }


    return (
        <>
            <Grid container spacing={2}>
                {books.slice(0, displayCount).map((book, index) => (
                    <Grid key={index} item xs={12} md={6}>
                        <a href={book.volumeInfo.infoLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <div className='bookscard'>
                                <div style={{ flex: 1 }}>
                                    <img src={book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} onError={(e) => {
                                        e.target.src = '/Noimage.jpg';
                                    }}  className="booksimg" />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px', overflow: 'hidden' }}>
                                    <h3>{book.volumeInfo.title}</h3>
                                    <p>{book.volumeInfo.authors && book.volumeInfo.authors.join(', ')}</p>
                                </div>
                            </div>
                        </a>
                    </Grid>
                ))}
            </Grid>
            <button className="shbutton" onClick={handleSeeMore}>
                <span className="text">{showMore ? 'Show Less' : 'Show More'}</span>
                <svg className="arrow" viewBox="0 0 448 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
                </svg>
            </button>
        </>
    )
}

export default Books