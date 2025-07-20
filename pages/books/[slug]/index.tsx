import React, {useEffect, useState} from 'react';
import MainLayout from "../../../layouts/MainLayout";
import {wrapper} from "../../../store/store";
import {
    deleteFromSavedNovel,
    fetchAudiosOfNovel,
    fetchNovelOne,
    rateNovel,
    saveNovel
} from "../../../store/actions/novel";
import {useAppSelector} from "../../../hooks/reducer";
import classNames from "classnames";
import Link from "next/link";
import Image from 'next/image';
import ThemeButton from "../../../components/Ui/ThemeButton";
import SectionTitle from "../../../components/SectionTitle";
import {useRouter} from "next/router";
import {selectAudioListByLang, selectNovels} from "../../../store/selectors/novel";
import {selectAuth} from "../../../store/selectors/auth";
import AsideBookCard from '../../../components/AsideBookCard';
import ReactStars from "react-rating-stars-component";
import TrackTabList from "../../../components/TrackTabList";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {fetchAdvertisingRight} from "../../../store/actions/advertising";
import SpinnerDots from "../../../components/Ui/SpinnerDots";
import {fetchAuthorOne, fetchNovelsOfAuthor, followAuthor, unfollowAuthor} from "../../../store/actions/author";
import {selectAuthors} from "../../../store/selectors/author";
import {Navigation} from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import NovelCard from "../../../components/NovelCard";
import noPhotoAuthor from "../../../assets/images/noPhotoAvtor.jpg";
import useTranslation from 'next-translate/useTranslation';
import HeadMeta from '../../../components/HeadMeta';
import { formatPublishedDate } from '../../../utils/dateFormatter';
import { useNovelAudioDuration } from '../../../hooks/useAudioDuration';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    const slug =  encodeURI(ctx.query.slug + '');

    await dispatch(fetchNovelOne({
        locale: ctx.locale,
        slug: slug,
        opt: {},
        ctx: ctx
    }));

    // Check if the novel exists in the redux store
    const state = store.getState();
    const novel = state.novelReducer.novel;
    if (!novel) {
        return { notFound: true };
    }

    await dispatch(fetchAdvertisingRight({
        locale: ctx.locale,
        type: 'right'
    }));

    await dispatch(fetchAudiosOfNovel({locale: ctx.locale, slug: slug}))

    return {
        props: {},
    };
});




const Index = () => {

    const dispatch = useDispatch();
    const { novel, audioList } = useAppSelector(selectNovels);
    const {t} = useTranslation('common')

    const {author, novels, loading: authorLoading} = useAppSelector(selectAuthors);

    const {isLogin} = useAppSelector(selectAuth)
    const {...trackList} = useAppSelector(selectAudioListByLang);
    const {right: asideBanner} = useAppSelector(s=>s.advertisingReducer)
    const {locale, query} = useRouter();
    const router = useRouter();
    
    const { duration: durationH, isLoading: isLoadingDuration } = useNovelAudioDuration(novel, 'hh:mm:ss');
    const [activeTab, setActiveTab] = useState('read');


    useEffect(()=>{
        if(!novel){
            return
        }
        const authorSlug = novel.author?.slug;

        if(authorSlug){
            dispatch(fetchAuthorOne({locale: locale, slug: authorSlug, config: {},}))
            dispatch(fetchNovelsOfAuthor({
                locale: locale,
                slug: authorSlug
            }))
        }
    }, [novel])


    const sendNovelRating = async (rate) => {
        if(!isLogin){
            toast.error('Оценивать могут только авторизованные пользователи', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
            });
            return
        }
        const slug = encodeURI( novel.slug + '');

        await dispatch(rateNovel({
            locale: locale,
            slug: slug,
            rating: rate
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
            slug: novel.author[0].slug
        }))
    }

    

    return (
        <MainLayout>
            <HeadMeta title={novel ? novel.name : 'Сервис аудиокниг'} description={novel ? novel.name : 'Сервис аудиокниг'} ogImg={novel && novel?.cover?.src } />

            {
                !novel ?
                    <SpinnerDots/>
                    :
                    <div className="container mx-auto px-3">
                        
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
                                <Link href="/books">
                                    <a className="text-primary hover:text-accent transition-colors">
                                        {t('books')}
                                    </a>
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                                <span className="text-gray-900 font-medium truncate">
                                    {novel ? novel.name : '...'}
                                </span>
                            </nav>
                        </div>

                        <div className="grid grid-cols-12 gap-4">

                            <div className="lg:col-span-3 md:col-span-4 col-span-12">
                                <AsideBookCard novel={novel} sendNovelRating={sendNovelRating}/>
                            </div>

                            <div className="lg:col-span-9 md:col-span-8 col-span-12">
                                <div className='p-4 lg:p-6 bg-gray-100 rounded-lg mb-5'>

                                    <div className="hidden lg:block">

                                        <h1 className='font-bold text-2xl mb-3'>{novel.name}</h1>

                                        <div className='flex items-center mb-3'>

                                            <div>
                                                {
                                                    novel && novel.author ?
                                                        <Link key={novel.author.slug} href={`/authors/${novel.author.slug}`}>
                                                            <a className='text-primary mr-5 cursor-pointer block'>
                                                                {novel.author.name}
                                                            </a>
                                                        </Link>
                                                    : null
                                                }
                                            </div>

                                            <ReactStars
                                                count={5}
                                                value={novel.rating}
                                                size={24}
                                                color="#D0D0D0"
                                                half={true}
                                                edit={true}
                                                activeColor="#ffd700"
                                                onChange={sendNovelRating}
                                            />

                                            <span className='ml-2 font-bold'>
                                              {novel.rating.toFixed(0)}
                                            </span>
                                        </div>

                                    </div>


                                    <div className='flex flex-wrap sm:justify-start justify-between w-full text-gray-600 mb-5'>


                                        <span className='flex items-center md:mr-8 mr-3'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {isLoadingDuration ? '...' : durationH}
                                        </span>


                                        {
                                            novel.language &&
                                            <span className='flex items-center md:mr-8 mr-3'>
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                    {novel.language}
                                            </span>
                                        }


                                        <span className='flex items-center md:mr-8 mr-3'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatPublishedDate(novel.published_at)}
                                        </span>

                                        {
                                            novel.age_rate ?
                                                <span className={classNames(' w-6 h-6 rounded-full border-2  border-green-600 text-green-600 flex items-center justify-center text-xs font-bold', {
                                                        'border-red-600 text-red-600': Number(novel.age_rate) >= 16
                                                    })} style={{fontSize: 9}}>
                                                    {novel.age_rate}+
                                                </span>
                                            : null
                                        }

                                    </div>

                                    <div className='mb-5'>
                                        {
                                            novel && novel.reader ?
                                                <>
                                                    <h3 className='font-medium text-xl mb-3'>{t('novelReader')}</h3>
                                                    <Link  href={'/readers/' + novel.reader}>
                                                        <a className='text-primary mr-3 hover:underline'>{novel.reader}</a>
                                                    </Link>
                                                </>
                                            : null
                                        }
                                    </div>

                                    <div className='mb-5'>
                                        <h3 className='font-medium text-xl mb-3'>{t('genre')}</h3>
                                        {
                                            novel.genre.map((genre)=>(
                                                <span key={genre} className='mr-1'>
                                                    <Link href={`/genres/${genre}`}>
                                                        <a className='px-3 py-1 rounded-md bg-red-50 text-primary truncate transition hover:bg-red-200'>{genre}</a>
                                                    </Link>
                                                </span>

                                            ))
                                        }
                                    </div>

                                    {
                                        author ?
                                            <div className='pt-3 border-t border-gray-400'>
                                                <div className='flex items-center justify-between mb-3' key={author.slug}>
                                                    <div className='flex items-center' >
                                                        <div className='w-14 h-14 rounded-full relative'>
                                                            <div className='absolute w-16 h-16  bg-gradient-to-r from-orange-300 via-red-500 to-pink-500 rounded-full'/>

                                                            <div className='absolute top-[4px] left-[4px] bg-gray-50 z-12 w-full h-full rounded-full text-2xl flex items-center justify-center font-medium cursor-pointer overflow-hidden'
                                                                 onClick={()=>router.push(`/authors/${author.slug}`)}
                                                            >
                                                                {
                                                                    author.photo ?
                                                                        <Image src={author.photo.src} layout='fill' objectFit='cover' objectPosition='top center'/>
                                                                        :
                                                                        <Image src={noPhotoAuthor} layout='fill' objectFit='cover' objectPosition='top center'/>
                                                                }

                                                            </div>
                                                        </div>
                                                        <div className='pl-4'>
                                                            <h4 className='font-bold cursor-pointer' onClick={()=>router.push(`/authors/${author.slug}`)}>{author.name}</h4>
                                                            <span className='text-gray-500'>{author.novels_count} ta kitob</span>
                                                        </div>
                                                    </div>
                                                    {
                                                        isLogin ?
                                                            <>
                                                                {
                                                                    author.followed ?
                                                                        <ThemeButton className="" onClick={() => unfollowToAuthor(author.slug)}  disabled={authorLoading}>
                                                                            {t('unfollow')}
                                                                        </ThemeButton>
                                                                        :
                                                                        <ThemeButton onClick={() => followToAuthor(author.slug)} disabled={authorLoading}>
                                                                            {t('follow')}
                                                                        </ThemeButton>
                                                                }
                                                            </>
                                                        : null
                                                    }

                                                </div>
                                            </div>
                                        : null
                                    }



                                </div>



                            </div>

                        </div>

                        {/* Description Section - Full Site Width */}
                        <div className='w-full bg-gray-100 py-8 lg:py-12 rounded-lg'>
                            <div className="container mx-auto px-3">
                                <div className='mb-6 flex justify-center sm:justify-start'>
                                    <div className='inline-flex rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm'>
                                        <button 
                                            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                                                activeTab === 'read' 
                                                    ? 'bg-primary text-white' 
                                                    : 'bg-white text-primary hover:bg-gray-50'
                                            }`}
                                            onClick={() => setActiveTab('read')}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13 3H3V5H13V3ZM3 7H13V9H3V7ZM3 11H9V13H3V11Z" />
                                            </svg>
                                            {t('read')}
                                        </button>
                                        <button 
                                            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                                                activeTab === 'listen' 
                                                    ? 'bg-primary text-white' 
                                                    : 'bg-white text-primary hover:bg-gray-50'
                                            }`}
                                            onClick={() => setActiveTab('listen')}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M13.2692 5.55C12.9792 4.85 12.5592 4.22 12.0192 3.68C11.4792 3.14 10.8592 2.72 10.1492 2.43C8.75922 1.86 7.15922 1.85 5.75922 2.44C5.05922 2.73 4.42922 3.15 3.88922 3.69C3.34922 4.23 2.92922 4.85 2.63922 5.56C2.34922 6.26 2.19922 7 2.19922 7.76V11.96C2.19922 12.95 3.00922 13.76 3.99922 13.76H4.39922C5.38922 13.76 6.19922 12.95 6.19922 11.96V10.56C6.19922 9.57 5.38922 8.76 4.39922 8.76H3.99922C3.89922 8.76 3.79922 8.77 3.69922 8.79V7.76C3.69922 7.2 3.80922 6.65 4.01922 6.13C4.22922 5.61 4.53922 5.15 4.93922 4.75C5.33922 4.35 5.79922 4.04 6.31922 3.83C7.35922 3.4 8.53922 3.4 9.56922 3.83C10.0892 4.05 10.5492 4.36 10.9492 4.75C11.3492 5.15 11.6592 5.61 11.8692 6.13C12.0792 6.65 12.1892 7.19 12.1892 7.76V8.79C12.0892 8.77 11.9892 8.76 11.8892 8.76H11.4892C10.4992 8.76 9.68922 9.57 9.68922 10.56V11.96C9.68922 12.95 10.4992 13.76 11.4892 13.76H11.8892C12.8792 13.76 13.6892 12.95 13.6892 11.96V7.76C13.6892 7 13.5392 6.26 13.2492 5.56L13.2692 5.55Z" />
                                            </svg>
                                            {t('listen')}
                                        </button>
                                    </div>
                                </div>
                                
                                {activeTab === 'listen' && (
                                    <div className='mb-4 flex items-center gap-2'>
                                        <div className='bg-primary text-white px-3 py-1 rounded-full flex items-center gap-1'>
                                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13 3H3V5H13V3ZM3 7H13V9H3V7ZM3 11H9V13H3V11Z" />
                                            </svg>
                                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M13.2692 5.55C12.9792 4.85 12.5592 4.22 12.0192 3.68C11.4792 3.14 10.8592 2.72 10.1492 2.43C8.75922 1.86 7.15922 1.85 5.75922 2.44C5.05922 2.73 4.42922 3.15 3.88922 3.69C3.34922 4.23 2.92922 4.85 2.63922 5.56C2.34922 6.26 2.19922 7 2.19922 7.76V11.96C2.19922 12.95 3.00922 13.76 3.99922 13.76H4.39922C5.38922 13.76 6.19922 12.95 6.19922 11.96V10.56C6.19922 9.57 5.38922 8.76 4.39922 8.76H3.99922C3.89922 8.76 3.79922 8.77 3.69922 8.79V7.76C3.69922 7.2 3.80922 6.65 4.01922 6.13C4.22922 5.61 4.53922 5.15 4.93922 4.75C5.33922 4.35 5.79922 4.04 6.31922 3.83C7.35922 3.4 8.53922 3.4 9.56922 3.83C10.0892 4.05 10.5492 4.36 10.9492 4.75C11.3492 5.15 11.6592 5.61 11.8692 6.13C12.0792 6.65 12.1892 7.19 12.1892 7.76V8.79C12.0892 8.77 11.9892 8.76 11.8892 8.76H11.4892C10.4992 8.76 9.68922 9.57 9.68922 10.56V11.96C9.68922 12.95 10.4992 13.76 11.4892 13.76H11.8892C12.8792 13.76 13.6892 12.95 13.6892 11.96V7.76C13.6892 7 13.5392 6.26 13.2492 5.56L13.2692 5.55Z" />
                                            </svg>
                                        </div>
                                        <span className='text-sm text-gray-600'>{t('synchronizedWithAudio')}</span>
                                    </div>
                                )}
                                
                                {activeTab === 'read' && (
                                    <div>
                                        <h3 className='font-medium text-xl mb-3'>{ t('description') }</h3>
                                        <div dangerouslySetInnerHTML={{__html: novel.description}}/>
                                    </div>
                                )}
                                
                                {activeTab === 'listen' && (
                                    <div>
                                        <h3 className='font-medium text-xl mb-3'>{ t('audioDescription') }</h3>
                                        <div className='mb-6'>
                                            <TrackTabList trackList={trackList} novel={novel}/>
                                        </div>
                                        <div className='mt-8'>
                                            <h4 className='font-medium text-lg mb-3'>{ t('description') }</h4>
                                            <div dangerouslySetInnerHTML={{__html: novel.description}}/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="container mx-auto px-3 mt-8">
                            <SectionTitle>
                               {t('otherBooks')}
                            </SectionTitle>

                            {
                                novels.results && !novels.results.length ?
                                    null
                                    :
                                    <Swiper
                                        slidesPerView={2}
                                        spaceBetween={5}
                                        navigation={true}
                                        modules={[Navigation]}
                                        className='grid grid-cols-4 gap-5 mb-6'
                                        breakpoints={{
                                            768: {
                                                slidesPerView: 3,
                                                spaceBetween: 10,
                                            },
                                            1024: {
                                                slidesPerView: 4,
                                                spaceBetween: 10,
                                            },
                                        }}
                                    >
                                        {
                                            novels.results.filter(item=>item.slug !== novel.slug).map((novel)=>(
                                                <SwiperSlide key={novel.slug} className='col-span-1'>
                                                    <NovelCard novel={novel} addToMark={addNovelToMark}/>
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
                            }

                        </div>

                    </div>
            }

        </MainLayout>
    );
}

export default Index;
