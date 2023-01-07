import React, { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import 'reactjs-popup/dist/index.css';

// ...

/**
 * Let's say we have 10 pages and we set pageNeighbours to 2
 * Given that the current page is 6
 * The pagination control will look like the following:
 *
 * (1) < {4 5} [6] {7 8} > (10)
 *
 * (x) => terminal pages: first and last page(always visible)
 * [x] => represents current page
 * {...x} => represents page neighbours
 */

function Pagination(props) {

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [countPerPage, setCountPerPage] = useState(0);

    useEffect(() => {
        setTotalRecords(typeof props.total === 'number' ? props.total : 0);
        setPage(typeof props.page === 'number' ? props.page : 0);
        setCountPerPage(typeof props.countPerPage === 'number' ? props.countPerPage : 10);
    }, [props.total, props.page, props.countPerPage]);

    const isLastPage = () => {
        return totalRecords <= (page + 1) * countPerPage;
    };

    const totalPages = () => {
        return countPerPage === 0 ? 0 : Math.ceil(totalRecords / countPerPage);
    };

    const setPageNumber = (pageNumber) => {
        if (props.setPage && typeof props.setPage === 'function') {
            props.setPage(pageNumber);
        }
    };

    if (totalRecords <= countPerPage) {
        return (
            <nav className='centered d-flex justify-content-center'></nav>
        );
    }

    return (
        <nav className='centered d-flex justify-content-center'>
            <ul className="pagination">
                {
                    page > 0 && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(0) }}>
                            <a className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span className="sr-only">Previous</span>
                            </a>
                        </li>
                    )
                }
                {
                    page > 3 && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(page - 3) }}><a className="page-link">{'...'}</a></li>
                    )
                }
                {
                    page > 2 && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(page - 2) }}><a className="page-link">{page - 1}</a></li>
                    )
                }
                {
                    page > 1 && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(page - 1) }}><a className="page-link">{page}</a></li>
                    )
                }
                <li className="page-item active" role="button"><a className="page-link">{page + 1}</a></li>
                {
                    page + 1 <= (totalPages() - 1) && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(page + 1) }}><a className="page-link">{page + 2}</a></li>
                    )
                }
                {
                    page + 2 <= (totalPages() - 1) && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(page + 2) }}><a className="page-link">{page + 3}</a></li>
                    )
                }
                {
                    page + 3 <= (totalPages() - 1) && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(page + 3) }}><a className="page-link">{'...'}</a></li>
                    )
                }
                {
                    !isLastPage() && (
                        <li className="page-item" role="button" onClick={() => { setPageNumber(totalPages() - 1) }}>
                            <a className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span className="sr-only">Next</span>
                            </a>
                        </li>
                    )
                }
            </ul>
        </nav>
    );
}

export default Pagination;