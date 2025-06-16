import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {fetchAuthors} from "../../store/actions/author";
import {fetchAdvertisingRight} from "../../store/actions/advertising";
import AuthorsPage from "../../components/Screens/AuthorsPage";

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchAuthors({locale: ctx.locale, config: {
        params: {
            p: ctx.query.p
        }
    }}))
    await dispatch(fetchAdvertisingRight({
        locale: ctx.locale,
        type: 'right'
    }));
    return {
        props: {},
    };
});

const Index = () => {



    return (
        <MainLayout>
            <AuthorsPage/>
        </MainLayout>
    );
};

export default Index;
