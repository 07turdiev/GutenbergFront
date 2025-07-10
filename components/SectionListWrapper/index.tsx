import React from 'react';
import SectionTitle from "../SectionTitle";
import classNames from "classnames";
import ThemeButton from "../Ui/ThemeButton";
import Link from 'next/link';
import MoreBtn from "../Ui/MoreBtn";
import {useRouter} from "next/router";
import useTranslation from "next-translate/useTranslation";

interface Props {
    title: string;
    moreBtn?: string;
}

const Index:React.FC<Props> = ({
    children,
    moreBtn,
    title
}) => {

    const router = useRouter();
    const { t } = useTranslation('common');



    return (
        <section className='container mx-auto px-3 mb-10'>

            <div className="grid grid-cols-2 gap-2 mb-5 mx-2 sm:mx-0 items-center">
                <div className="col-span-1 min-w-0">
                    <SectionTitle>{title}</SectionTitle>
                </div>
                {
                    moreBtn ?
                        <div className='col-span-1 text-right flex justify-end'>
                            <MoreBtn onClick={() => router.push(moreBtn)}>{t('showAll')}</MoreBtn>
                        </div>
                    : null
                }
            </div>

            {children}
        </section>
    );
};

export default Index;