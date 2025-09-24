import React from 'react';
import styles from './style.module.scss';
import Link from 'next/link';

const BookipediaHero: React.FC = () => {
    return (
        <section className={styles.heroContainer}>
                <div className={styles.imageColumn}>
                    <div className={styles.imageWrapper}>
                        <img
                            src="https://placehold.co/452x585/e0e0e0/ffffff?text=&font=poppins"
                            alt="Qanday qilib ko'proq kitob o'qish mumkin?"
                        />
                    </div>
                </div>

                <div className={styles.contentColumn}>
                    <div className={styles.statsCard}>
                        <span>1K+</span>
                        <p>O'quvchilar</p>
                        <div className={styles.userIcons}>
                            <img src="https://placehold.co/33x33/e0e0e0/e0e0e0" alt="user" />
                            <img src="https://placehold.co/33x33/d4d4d4/d4d4d4" alt="user" />
                            <img src="https://placehold.co/33x33/c8c8c8/c8c8c8" alt="user" />
                        </div>
                        <button className={styles.arrowBtn} aria-label="Keyingi">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none">
                        <path d="M6.07692 1L12 7.5M12 7.5L6.07692 14M12 7.5L1 7.5" stroke="#009DFF" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </button>
                    </div>

                    <h1 className={styles.mainTitle}>Qanday qilib ko'proq kitob o'qish mumkin?</h1>

                    <div className={styles.descriptionAndActions}>
                        <div className={styles.actions}>
                            <Link href="#">
                                <a className={styles.btnRead}>O'qish</a>
                            </Link>
                            <button className={styles.btnShare} aria-label="Ulashish">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none">
                            <path d="M4.99902 0.90625C2.23802 0.90625 -0.000976562 3.14525 -0.000976562 5.90625V6.90625C-0.000976562 8.00625 0.329029 9.20024 1.28003 10.2192C1.65703 10.6222 2.28303 10.6582 2.68703 10.2812C3.09003 9.90425 3.12602 9.24724 2.74902 8.84424C2.20902 8.26524 1.99902 7.54725 1.99902 6.90625V5.90625C1.99902 4.24925 3.34202 2.90625 4.99902 2.90625H10.999C12.656 2.90625 13.999 4.24925 13.999 5.90625V6.90625C13.999 8.56325 12.656 9.90625 10.999 9.90625H8.99902C8.44702 9.90625 7.99902 10.3542 7.99902 10.9062C7.99902 11.4583 8.44702 11.9062 8.99902 11.9062H10.999C13.76 11.9062 15.999 9.66725 15.999 6.90625V5.90625C15.999 3.14525 13.76 0.90625 10.999 0.90625H4.99902ZM8.99902 5.90625C6.23802 5.90625 3.99902 8.14525 3.99902 10.9062V11.9062C3.99902 14.6672 6.23802 16.9062 8.99902 16.9062H14.999C17.76 16.9062 19.999 14.6672 19.999 11.9062V10.9062C19.999 9.80625 19.669 8.61224 18.718 7.59424C18.341 7.19024 17.715 7.15425 17.311 7.53125C16.908 7.90825 16.872 8.56524 17.249 8.96924C17.789 9.54724 17.999 10.2653 17.999 10.9062V11.9062C17.999 13.5632 16.656 14.9062 14.999 14.9062H8.99902C7.34202 14.9062 5.99902 13.5632 5.99902 11.9062V10.9062C5.99902 9.24925 7.34202 7.90625 8.99902 7.90625H10.999C11.551 7.90625 11.999 7.45825 11.999 6.90625C11.999 6.35425 11.551 5.90625 10.999 5.90625H8.99902Z" fill="#58BB43"/>
                            </svg>
                            </button>
                            {/* <button className={styles.btnBookmark} aria-label="Saqlash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
                            <path d="M4.98242 0.0141602C2.42942 0.0141602 0.982422 1.46186 0.982422 4.01416V19.0142C0.982422 19.7321 1.72843 20.2027 2.38843 19.9204L8.98242 17.108L15.5754 19.9204C16.2354 20.2033 16.9824 19.732 16.9824 19.0142V4.01416C16.9824 1.39076 15.6774 0.0141602 12.9824 0.0141602H4.98242ZM8.98242 5.01416C9.53442 5.01416 9.98242 5.46186 9.98242 6.01416V8.01416H11.9824C12.5344 8.01416 12.9824 8.46186 12.9824 9.01416C12.9824 9.56646 12.5344 10.0142 11.9824 10.0142H9.98242V12.0142C9.98242 12.5665 9.53442 13.0142 8.98242 13.0142C8.42942 13.0142 7.98242 12.5665 7.98242 12.0142V10.0142H5.98242C5.42942 10.0142 4.98242 9.56646 4.98242 9.01416C4.98242 8.46186 5.42942 8.01416 5.98242 8.01416H7.98242V6.01416C7.98242 5.46186 8.42942 5.01416 8.98242 5.01416Z" fill="#009DFF"/>
                            </svg>
                            </button> */}
                           
                        </div>
                        <p className={styles.description}>
                            Noaniq sharoitda qanday qilib dadil qarorlar qabul qilish, omadsizliklardan
                            imkoniyat sifatida foydalanish va uzoq muddatli, barqaror muvaffaqiyatga
                            erishish haqidagi fundamental qo'llanma.
                        </p>
                    </div>
                </div>
        </section>
    );
};

export default BookipediaHero;


