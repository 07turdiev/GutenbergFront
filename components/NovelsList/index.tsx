import React, {useState} from 'react';
import {INovel} from "../../models/INovel";
import NovelCard from "../NovelCard";
import Pagination from "../Ui/Pagination";
import {IMeta} from "../../models/IMeta";
import {
    deleteFromSavedNovel,
    fetchNovels,
    saveNovel
} from "../../store/actions/novel";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";

interface Props {
    novels: INovel[];
    meta: IMeta;
    addNovelToMark: (slug:string, saved: boolean) => void;

}

const Index:React.FC<Props> = ({novels, meta, addNovelToMark}) => {

    const dispatch = useDispatch();
    const {locale, query} = useRouter();



    return (
        <div>

            <div className='grid lg:grid-cols-10 grid-cols-12 gap-2'>
                {
                    novels.map((novel)=>{
                        return (
                            <div className="lg:col-span-2 sm:col-span-3 col-span-6" key={novel.slug}>
                                <NovelCard novel={novel} addToMark={addNovelToMark}/>
                            </div>
                        )
                    })
                }
            </div>

            <Pagination meta={meta}/>
        </div>
    );
};

export default Index;
