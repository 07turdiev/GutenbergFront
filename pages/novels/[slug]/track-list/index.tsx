import React, {useEffect} from 'react';
import MainLayout from "../../../../layouts/MainLayout";
import {wrapper} from "../../../../store/store";
import {fetchAudiosOfNovel, fetchNovelOne, rateNovel} from "../../../../store/actions/novel";
import Image from "next/image";
import {useAppSelector} from "../../../../hooks/reducer";
import ErrorBounder from "../../../../components/Ui/ErrorBounder";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import TrackTabList from "../../../../components/TrackTabList";
import {selectAuth} from "../../../../store/selectors/auth";
import {selectAudioListByLang} from "../../../../store/selectors/novel";
import {toast} from "react-toastify";
import ReactStars from "react-rating-stars-component";
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import HeadMeta from '../../../../components/HeadMeta';

export const getServerSideProps = wrapper.getServerSideProps(store => async ({locale, query}) => {
    const dispatch = store.dispatch;
    const slug = encodeURI(query.slug + '');
    await dispatch(fetchNovelOne({ locale, slug }));
    await dispatch(fetchAudiosOfNovel({locale, slug: slug}))
    return {
        props: {},
    };
});

const Index = () => {

    const {novel, loadingTracks} = useAppSelector(s=>s.novelReducer);
    const {...trackList} = useAppSelector(selectAudioListByLang);
    const dispatch = useDispatch();
    const {locale, query} = useRouter();
    const {isLogin} = useAppSelector(selectAuth);
    const { t } = useTranslation('common')

    if(!novel){
        return <ErrorBounder/>
    }

    const sendNovelRating = async (rate) => {
        if(!isLogin){
            toast.error('Оценивать могут только авторизованные пользователи', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                theme: 'dark',
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

    return (
        <MainLayout>
            <HeadMeta title={novel.name} description={novel.name} ogImg={novel.cover}/>

            <div className="container mx-auto px-3 mb-10">

                    <div className='max-w-3xl mx-auto'>

                        <div className="flex mb-10 gap-5">

                            <div className='w-24 h-24 relative rounded-md overflow-hidden'>
                                <Image src={novel.cover} layout='fill' objectFit='cover'/>
                            </div>

                            <div>
                                <h1 className='font-bold text-2xl'>{novel.name}</h1>

                                <Link href={`/authors/${novel.author.slug}`}>
                                    <a className='text-primary'>{novel.author.name}</a>
                                </Link>


                                <ReactStars
                                    count={5}
                                    value={novel.rating}
                                    size={24}
                                    color="#D0D0D0"
                                    edit={true}
                                    activeColor="#ffd700"
                                    onChange={sendNovelRating}
                                />

                            </div>

                        </div>




                        <div className='mb-10'>
                            {
                                trackList ?
                                    <div className='mb-10'>
                                        <TrackTabList trackList={trackList} novel={novel}/>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
            </div>

        </MainLayout>
    );
};

export default Index;
