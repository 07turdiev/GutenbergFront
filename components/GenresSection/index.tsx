import React from 'react';

interface GenresSectionProps {
  genres: string[];
  activeGenre: string;
  onSelect: (genre: string) => void;
}

const GenresSection: React.FC<GenresSectionProps> = ({ genres, activeGenre, onSelect }) => {
  return (
    <div className="w-full py-8">
      <div className="flex justify-center">
        <div className="flex items-center gap-3 sm:gap-4 max-w-[1200px] overflow-x-auto pb-3 px-1">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onSelect(genre)}
              className={
                `flex items-center px-6 py-2 h-[50px] rounded-[75px] text-[20px] font-[400] whitespace-nowrap transition ` +
                (activeGenre === genre
                  ? 'bg-[#009DFF] text-white font-[700] border border-[#009DFF]'
                  : 'bg-[rgba(0,157,255,0.1)] text-[#009DFF] border border-[#009DFF] hover:bg-[rgba(0,157,255,0.15)]')
              }
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenresSection;


