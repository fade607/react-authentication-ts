import React from 'react'
import { useNavigate } from 'react-router-dom'

type PageNotFoundTypes = {}

const PageNotFound: React.FC<PageNotFoundTypes> = () => {
    const navigate = useNavigate()

    return (
        <div className='page-not-found' >
            <img src='../images/page-not-found.gif'
                className='page-not-found-img'
                alt='not-found'
            />

            <h2>Sorry, Page not Found</h2>
            <button className='btn'
                onClick={() => navigate(-1)}
            >Go Back</button>

        </div>
    )

}

export default PageNotFound