import {wrapper} from "../store/store";
import {NextPage} from "next";
import MainLayout from "../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import {
    fetchNovelActual,
    fetchNovels,
} from "../store/actions/novel";
import {useAppSelector} from "../hooks/reducer";
import NovelMain from "../components/NovelMain";
import {selectNovels} from "../store/selectors/novel";
import AdvertisingCard from "../components/AdvertisingCard";
import TabSection from "../components/TabSection";
import {fetchCategories} from "../store/actions/genre";
import {selectCategories} from "../store/selectors/genre";
import NovelsListSection from "../components/NovelsListSection";
import {fetchAuthors} from "../store/actions/author";
import {selectAuthors} from "../store/selectors/author";
import AuthorsListSection from "../components/AuthorsListSection";
import SectionListWrapper from "../components/SectionListWrapper";
import CategoriesListSection from "../components/CategoriesListSection";
import {
    fetchAdvertisingMainBottom,
    fetchAdvertisingMainTop,
    fetchAdvertisingSection
} from "../store/actions/advertising";
import { fetchLatestBlogPosts } from "../store/actions/blog";
import React, {useState} from "react";
import Image from 'next/image';
import {useRouter} from "next/router";
import { useDispatch } from "react-redux";
import HeadMeta from "../components/HeadMeta";
import HomePage from "../components/Screens/HomePage";



export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;


    await dispatch(fetchNovels({
        locale: ctx.locale,
        opt: {
          params: {
              popular: 'true'
          }
        },
        ctx,
    }))

    await dispatch(fetchNovelActual({locale: ctx.locale, ctx}));
    await dispatch(fetchCategories({locale: ctx.locale}))
    await dispatch(fetchAuthors({locale: ctx.locale}))
    await dispatch(fetchAdvertisingMainTop({locale: ctx.locale, type: 'main-top'}))
    await dispatch(fetchAdvertisingMainBottom({locale: ctx.locale, type: 'main-bottom'}))
    await dispatch(fetchAdvertisingSection({locale: ctx.locale, type: 'middle'}))
    await dispatch(fetchLatestBlogPosts({locale: ctx.locale, ctx, limit: 6}))

    return {
        props: {

        },
    };
});

const Index: NextPage = () => {
    return <HomePage />;
};

export default Index;
