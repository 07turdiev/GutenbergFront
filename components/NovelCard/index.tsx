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
    
    const authors = (novel as any)?.mualliflars || (novel?.author ? [novel.author] : []) || (novel?.mualliflar ? [novel.mualliflar] : []);
    const firstAuthor = Array.isArray(authors) && authors.length > 0 ? authors[0] : null;
    const authorName = firstAuthor?.name || firstAuthor?.ismi || '';
    const allAuthorsNames = Array.isArray(authors) && authors.length > 0 
        ? authors.map((a: any) => a?.name || a?.ismi).filter(Boolean).join(', ')
        : '';

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
                    {authorName ? (
                        <div className={classes.authorOverlay}>
                            {authorName}
                        </div>
                    ) : null}
                </div>
                <div className={classes.bookInfo}>
                    <h3 className={classes.titleDefault}>{novel.name}</h3>
                    {allAuthorsNames ? (
                        <p className={classes.authorDefault}>{allAuthorsNames}</p>
                    ) : null}
                </div>
            </a>
        </Link>
    );
}

export default Index;
