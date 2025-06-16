import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {fetchAbout, fetchStatistics} from "../../store/actions/about";
import AboutPage from "../../components/Screens/AboutPage";

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchAbout({locale: ctx.locale}))
    await dispatch(fetchStatistics({locale: ctx.locale}))
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
