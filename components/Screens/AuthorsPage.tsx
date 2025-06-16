import React from 'react';
import HeadMeta from "../HeadMeta";
import SectionTitle from "../SectionTitle";
import AuthorListItem from "../AuthorListItem";
import Image from "next/image";
import Pagination from "../Ui/Pagination";
import {useAppSelector} from "../../hooks/reducer";
import {selectAuthors} from "../../store/selectors/author";
import useTranslation from "next-translate/useTranslation";

const AuthorsPage = () => {

    const {authors} = useAppSelector(selectAuthors);
    const {right: asideBanner} = useAppSelector(s=>s.advertisingReducer)
    const {t} = useTranslation('common')

    return (
        <div>
            <HeadMeta title={t('authorsPage')} description={t('authorsPage')} />
            <div className="container mx-auto px-3 mb-10">

                <SectionTitle>{t('authorsPage')}</SectionTitle>

                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 md:col-span-9">
                        {
                            authors.results.map((author)=>{
                                return(
                                    <AuthorListItem author={author} key={author.slug}/>
                                )
                            })
                        }
                    </div>

                    <div className="col-span-3 relative">
                        {
                            asideBanner && asideBanner.img ?
                                <div className='relative cursor-pointer'>
                                    <Image src={asideBanner.img.src} width={asideBanner.img.width} height={asideBanner.img.height}/>
                                </div>
                                : null
                        }
                    </div>
                </div>

            </div>

            <Pagination meta={authors.meta}/>
        </div>
    );
};

export default AuthorsPage;