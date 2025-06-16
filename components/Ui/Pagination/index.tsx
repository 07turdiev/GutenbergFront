import React from 'react';
import {IMeta} from "../../../models/IMeta";
import {useRouter} from "next/router";
import ReactPaginate from "react-paginate";

interface Props {
    meta: IMeta;
}

const Index = ({meta}) => {

    const {locale, ...router} = useRouter();

    const pageChange = (page) => {

        router.query.p = page.selected  + 1
        router.push(router)
    }

    return (
        <div>
            {
               meta && meta.num_pages > 1 ?
                    <div className='container mx-auto px-3 my-10'>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={pageChange}
                            pageRangeDisplayed={meta.countItemsOnPage}
                            pageCount={meta.num_pages}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            className='flex justify-center'
                            pageLinkClassName='w-10 h-10 flex items-center justify-center border border-primary rounded mx-1 transition hover:bg-primary hover:text-white cursor-pointer'
                            activeLinkClassName='bg-primary text-white'
                            previousLinkClassName='w-10 h-10 flex items-center justify-center text-primary'
                            nextLinkClassName='w-10 h-10 flex items-center justify-center text-primary'
                            disableInitialCallback={ true }
                            initialPage={ meta.current_page - 1 }
                        />
                    </div>
                    : null
            }
        </div>
    );
};

export default Index;
