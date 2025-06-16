import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import HeadMeta from '../../components/HeadMeta';
import Image from 'next/image';

// Vaqtincha test ma'lumotlari (keyinroq API dan keladi)
const mockTeamMembers = [
    {
        id: 1,
        name: "Alisher Navoiy",
        position: "Bosh direktor",
        description: "10 yillik tajribaga ega boshqaruv mutaxassisi",
        image: "/images/team/member1.jpg"
    },
    {
        id: 2,
        name: "Zarina Abdullayeva",
        position: "Texnik direktor",
        description: "IT sohasida 8 yillik tajriba",
        image: "/images/team/member2.jpg"
    },
    {
        id: 3,
        name: "Bobur Karimov",
        position: "Marketing menejeri",
        description: "Raqamli marketing bo'yicha mutaxassis",
        image: "/images/team/member3.jpg"
    },
    {
        id: 4,
        name: "Nilufar Saidova",
        position: "Dizayner",
        description: "UX/UI dizayni bo'yicha professional",
        image: "/images/team/member4.jpg"
    }
];

const TeamPage = () => {
    const { t } = useTranslation('common');

    return (
        <MainLayout>
            <HeadMeta title={t('team')} description={t('team')} />
            <div className="container mx-auto px-3 mb-10">
                
                {/* Sarlavha */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('team')}</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Bizning professional jamoamiz bilan tanishing
                    </p>
                </div>

                {/* Jamoa a'zolari */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mockTeamMembers.map((member) => (
                        <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            
                            {/* Rasm */}
                            <div className="relative h-64 bg-gray-200">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-gray-400 text-6xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Ma'lumotlar */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-gray-800">
                                    {member.name}
                                </h3>
                                
                                <p className="text-primary font-medium mb-3">
                                    {member.position}
                                </p>
                                
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Qo'shimcha ma'lumot */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Bizga qo'shiling!</h2>
                        <p className="text-lg mb-6">
                            Agar siz ham bizning jamoamizning bir qismi bo'lishni istasangiz, biz bilan bog'laning
                        </p>
                        <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            Aloqa
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TeamPage; 