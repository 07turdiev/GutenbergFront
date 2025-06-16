import React, {useEffect} from 'react';
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
import * as moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import useTranslation from 'next-translate/useTranslation';
import HeadMeta from '../../../components/HeadMeta';
momentDurationFormatSetup(moment);

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    const slug =  encodeURI(ctx.query.slug + '');

    await dispatch(fetchNovelOne({
        locale: ctx.locale,
        slug: slug,
        opt: {},
        ctx: ctx
    }));

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


    useEffect(()=>{
        if(!novel){
            return
        }
        const authorSlug = novel.author.slug;

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


    let durationH;
    if(novel){
        if(locale === 'uz'){
            durationH = moment.duration(novel.duration_uz, "second").format("hh:mm:ss", { trim: false});
        }else{
            durationH = moment.duration(novel.duration_ru, "second").format("hh:mm:ss", { trim: false});
        }
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

                        <div className="grid grid-cols-12 gap-4">

                            <div className="lg:col-span-2 md:col-span-3 col-span-12">
                                <AsideBookCard novel={novel} sendNovelRating={sendNovelRating}/>
                            </div>

                            <div className="lg:col-span-8 md:col-span-9 col-span-12">
                                <div className='p-4 bg-gray-100 rounded-lg mb-5'>

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
                                            {durationH}
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
                                            {novel.published_at}
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

                                    <div className='mb-5'>
                                        <h3 className='font-medium text-xl mb-3'>{ t('description') }</h3>
                                        <div dangerouslySetInnerHTML={{__html: novel.description}}/>
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
                                                            <span className='text-gray-500'>{author.novels_count} книг</span>
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

                                <SectionTitle>
                                    {t('bookChapters')}
                                </SectionTitle>

                                {
                                    trackList ?
                                        <div className='mb-10'>
                                            <TrackTabList trackList={trackList} novel={novel}/>
                                        </div>
                                    : null
                                }


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

                            <div className="lg:col-span-2  lg:block hidden relative">
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
            }

        </MainLayout>
    );
}

export default Index;
