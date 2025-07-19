import React from 'react';
import MainLayout from "../../../layouts/MainLayout";
import {wrapper} from "../../../store/store";
import {
    fetchAuthorOne,
    fetchAuthors,
    fetchNovelsOfAuthor,
    followAuthor,
    unfollowAuthor
} from "../../../store/actions/author";
import {useAppSelector} from "../../../hooks/reducer";
import {selectAuthors} from "../../../store/selectors/author";
import Image from 'next/image';
import ThemeButton from '../../../components/Ui/ThemeButton';
import SectionTitle from '../../../components/SectionTitle';
import NovelCard from '../../../components/NovelCard';
import Pagination from '../../../components/Ui/Pagination';
import SectionListWrapper from "../../../components/SectionListWrapper";
import AuthorsListSection from "../../../components/AuthorsListSection";
import noPhoto from '../../../assets/images/noPhotoAvtor.jpg';
import useTranslation from "next-translate/useTranslation";
import {selectAuth} from "../../../store/selectors/auth";
import {deleteFromSavedNovel, saveNovel} from "../../../store/actions/novel";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import HeadMeta from '../../../components/HeadMeta';
import Link from 'next/link';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;


    const slug = encodeURI(ctx.query.slug + '');
    await dispatch(fetchAuthorOne({locale: ctx.locale, slug: slug, ctx}));

    await dispatch(fetchAuthors({locale: ctx.locale}));
    await dispatch(fetchNovelsOfAuthor({locale: ctx.locale, slug: slug, config: {
        params: {
            p: ctx.query.p
        }
    }, ctx}))

    return {
        props: {},
    };
});



const Index = () => {

    const {author, authors, loading, novels: {results, ...meta}} = useAppSelector(selectAuthors)
    const {isLogin} = useAppSelector(selectAuth)
    const dispatch = useDispatch();
    const {locale} = useRouter();
    const { t } = useTranslation('common')


    const addNovelToMark = async (slug, saved) => {
        if(!saved){
            await dispatch(saveNovel({
                locale:  locale,
                slug: slug
            }))
        }else {
            await dispatch(deleteFromSavedNovel({
                locale:  locale,
                slug: slug
            }))
        }
        await dispatch(fetchNovelsOfAuthor({
            locale: locale,
            slug: author.slug
        }))
}

    const followToAuthor = async (slug) => {
        await dispatch(followAuthor({
            locale: locale,
            slug: slug
        }));
        await dispatch(fetchAuthorOne({locale: locale, slug: author.slug, config: {},}));
    }

    const unfollowToAuthor = async (slug) => {
        await dispatch(unfollowAuthor({
            locale: locale,
            slug: slug
        }));
        await dispatch(fetchAuthorOne({locale: locale, slug: author.slug, config: {},}));
    }

    if(!author){
        return <div>RENDER ON SERVER!</div>
    }


    return (
        <MainLayout>
            <HeadMeta title={author.name} description={author.name} ogImg={ author?.photo?.src}/>
            <div className="container mx-auto px-3 mb-14">
                
                {/* Breadcrumb Navigation */}
                <div className="mb-6 mt-10 sm:mt-4">
                    <nav className="flex items-center text-sm text-gray-600">
                        <Link href="/">
                            <a className="text-primary hover:text-accent transition-colors">
                                {t('home')}
                            </a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <Link href="/authors">
                            <a className="text-primary hover:text-accent transition-colors">
                                {t('authorsPage')}
                            </a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="text-gray-900 font-medium truncate">
                            {author ? author.name : '...'}
                        </span>
                    </nav>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="md:col-span-3 lg:col-span-2 col-span-12">
                        <div className='bg-gray-100 p-4 rounded-md'>

                            <div className='md:w-full w-[120px] h-[200px] relative rounded-md overflow-hidden mb-5 mx-auto'>
                                {
                                    author.photo ?
                                        <Image src={author.photo.src} layout='fill' alt={author.name} objectFit='cover'/>
                                    :
                                        <Image src={noPhoto} layout='fill' alt={author.name} objectFit='cover'/>
                                }

                            </div>

                            <div>
                                {
                                    isLogin ?
                                        <>
                                            {
                                                author.followed ?
                                                    <ThemeButton color="white" block onClick={() => unfollowToAuthor(author.slug)} disabled={loading}>
                                                        {t('unfollow')}
                                                    </ThemeButton>
                                                :
                                                    <ThemeButton color="white" block onClick={() => followToAuthor(author.slug)} disabled={loading}>
                                                        {t('follow')}
                                                    </ThemeButton>
                                            }

                                        </>

                                    :
                                        null
                                }

                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-9 lg:col-span-10 col-span-12">
                        <div className='bg-gray-100 p-4 rounded-md'>
                            <h1 className='font-bold text-2xl'>{author.name}</h1>
                            <p className='text-gray-400 mb-5'>{author.novels_count} {t('novelCountTitle')}</p>

                            <h2 className='font-bold'>{t('aboutAuthor')}</h2>
                            <div dangerouslySetInnerHTML={{__html: author.biography}}></div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-3 mb-10">
                <SectionTitle>
                    {t('books')}
                </SectionTitle>

                <div className="grid lg:grid-cols-6 grid-cols-12 gap-4">
                    {
                        results.map((novel)=>{
                            return(
                                <div className='lg:col-span-1 md:col-span-3 sm:col-span-4 col-span-6' key={novel.slug}>
                                    <NovelCard novel={novel} addToMark={addNovelToMark}/>
                                </div>
                            )
                        })
                    }
                </div>

                <Pagination meta={meta}/>
            </div>



            <SectionListWrapper title={t('authorsPage')} moreBtn={'/authors/'}>
                <AuthorsListSection authors={authors.results}/>
            </SectionListWrapper>

        </MainLayout>
    );
};

export default Index;
