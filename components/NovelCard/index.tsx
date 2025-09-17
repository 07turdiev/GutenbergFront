import React from 'react';
import {INovel} from "../../models/INovel";
import Image from 'next/image';
import Link from 'next/link';
import classes from './style.module.scss';
import noPhoto from '../../assets/images/noPhotoNovel.jpg';

interface Props {
    novel: INovel;
    addToMark?: (slug: string, saved: boolean) => void;
}

const Index:React.FC<Props> = ({novel}) => {
    const imageSrc = novel.cover ? novel.cover.src : noPhoto.src;

    return (
        <Link href={'/books/' + novel.slug}>
            <a className={classes.bookCard}>
                <div className={classes.imageWrapper}>
                    <Image
                        src={imageSrc}
                        alt={novel.name}
                        layout='fill'
                        objectFit='cover'
                        objectPosition='top center'
                        priority={false}
                        loading="lazy"
                    />
                    {novel.author ? (
                        <div className={classes.authorOverlay}>
                            {novel.author.name}
                        </div>
                    ) : null}
                </div>
                <div className={classes.bookInfo}>
                    <h3 className={classes.titleDefault}>{novel.name}</h3>
                    {novel.author ? (
                        <p className={classes.authorDefault}>{novel.author.name}</p>
                    ) : null}
                </div>
            </a>
        </Link>
    );
}

export default Index;
