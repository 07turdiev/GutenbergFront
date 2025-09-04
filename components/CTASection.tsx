import React from 'react';

const CTASection: React.FC = () => {
    return (
        <section className="w-full bg-[#F5F5F5] md:py-10 py-8 md:mb-12 mb-7">
            <div className="container mx-auto px-3 w-full flex flex-col items-center text-center">
                <p className="text-gray-800 text-lg sm:text-2xl md:text-3xl font-medium leading-snug">
                    “<span className="font-bold">Gutenberg Nashriyot Uyi</span>” tomonidan chop etilayotgan
                    kitoblar haqida hammadan oldin xabardor bo‘ling!
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-6 w-full max-w-md mx-auto">
                    <a
                        href="https://gutenbergnu.uz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 sm:px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center w-full sm:w-auto"
                    >
                        Gutenberg NU
                    </a>
                    <a
                        href="https://ovozly.uz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 sm:px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-center w-full sm:w-auto"
                    >
                        Ovozly
                    </a>
                </div>
            </div>
        </section>
    );
}

export default CTASection;


