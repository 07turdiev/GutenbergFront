import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {fetchAbout, fetchStatistics} from "../../store/actions/about";
import {fetchNovels} from "../../store/actions/novel";
import {fetchTeamMembers} from "../../store/actions/team";
import AboutPage from "../../components/Screens/AboutPage";

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchAbout({locale: ctx.locale}))
    await dispatch(fetchStatistics({locale: ctx.locale}))
    await dispatch(fetchTeamMembers({locale: ctx.locale}))
    await dispatch(fetchNovels({ locale: ctx.locale, opt: { params: { 'pagination[pageSize]': 5, 'sort[0]': 'createdAt:desc' } }, ctx }))
    return {
        props: {},
    };
});

const Index = () => {


    return (
        <MainLayout>
            <AboutPage/>
        </MainLayout>
    );
};

export default Index;
