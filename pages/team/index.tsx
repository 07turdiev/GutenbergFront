import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import HeadMeta from '../../components/HeadMeta';
import { wrapper } from "../../store/store";
import { fetchTeamMembers } from "../../store/actions/team";
import { useSelector } from "react-redux";
import { selectTeamMembers, selectTeamLoading } from "../../store/selectors/team";
import SpinnerDots from "../../components/Ui/SpinnerDots";
import Link from 'next/link';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchTeamMembers({
        locale: ctx.locale,
        config: {}
    }));
    return {
        props: {},
    };
});

const TeamPage = () => {
    const { t } = useTranslation('common');
    const teamMembers = useSelector(selectTeamMembers);
    const loading = useSelector(selectTeamLoading);

    if (loading) {
        return (
            <MainLayout>
                <HeadMeta title={t('team')} description={t('team')} />
                <div className="container mx-auto px-3 mb-10">
                    <div className="flex justify-center items-center h-96">
                        <SpinnerDots />
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <HeadMeta title={t('team')} description={t('team')} />
            <div className="container mx-auto px-3 mb-10">
                
                {/* Breadcrumb Navigation */}
                <div className="mb-4 mt-2 sm:mt-2">
                    <nav className="flex items-center text-sm text-gray-600">
                        <Link href="/">
                            <a className="text-primary hover:text-accent transition-colors">
                                {t('home')}
                            </a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="text-gray-900 font-medium">
                            {t('team')}
                        </span>
                    </nav>
                </div>

                {/* Sarlavha */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('team')}</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t('teamSubtitle')}
                    </p>
                </div>

                {/* Jamoa a'zolari */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            
                            {/* Rasm */}
                            <div className="relative h-64 bg-gray-200">
                                {member.rasmi && member.rasmi.url ? (
                                    <img 
                                        src={member.rasmi.formats?.medium?.url || member.rasmi.url}
                                        alt={member.ismi}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-gray-400 text-6xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Ma'lumotlar */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-gray-800">
                                    {member.ismi}
                                </h3>
                                
                                <p className="text-primary font-medium mb-3">
                                    {member.Lavozimi}
                                </p>
                                
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {member.tarjimai_holi}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Qo'shimcha ma'lumot - only show if there are team members */}
                {teamMembers.length > 0 && (
                    <div className="mt-16 text-center">
                        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-4">{t('joinUs')}</h2>
                            <p className="text-lg mb-6">
                                {t('joinUsDescription')}
                            </p>
                            <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                {t('contact')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {teamMembers.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">{t('noDataFound')}</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default TeamPage; 