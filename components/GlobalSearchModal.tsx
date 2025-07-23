import React, { useState, useRef, useEffect } from "react";
import NovelService from "../services/novels";
import AuthorService from "../services/author";
import BlogService from "../services/blog";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import classNames from "classnames";

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "") + url
    : url;
};

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text.replace(regex, "<b>$1</b>"),
      }}
    />
  );
};

type Book = {
  id: number;
  nomi: string;
  slug: string;
  muqova?: { url?: string };
};

type Author = {
  id: number;
  ismi: string;
  slug: string;
  rasmi?: { url?: string };
};

type Blog = {
  id: number;
  sarlavha: string;
  slug: string;
  rasmi?: { url?: string };
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const GlobalSearchModal: React.FC<Props> = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [groupedResults, setGroupedResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) {
      setQuery("");
      setBooks([]);
      setAuthors([]);
      setBlogs([]);
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (groupedResults.length === 0) return;
      if (e.key === "ArrowDown") {
        setActiveIndex((i) => Math.min(i + 1, groupedResults.length - 1));
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        setActiveIndex((i) => Math.max(i - 1, 0));
        e.preventDefault();
      }
      if (e.key === "Enter") {
        const item = groupedResults[activeIndex];
        if (item) {
          router.push(item.link);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, groupedResults, activeIndex, onClose, router]);

  useEffect(() => {
    if (!debouncedQuery) {
      setBooks([]);
      setAuthors([]);
      setBlogs([]);
      setGroupedResults([]);
      return;
    }
    setLoading(true);
    const locale = router.locale || "uz";
    Promise.all([
      NovelService.fetchNovels(locale, {
        params: {
          "filters[nomi][$containsi]": debouncedQuery,
          "pagination[pageSize]": 5,
          "populate": "muqova"
        }
      }).then((res) => res.data.data),
      AuthorService.fetchAuthors({
        locale,
        config: {
          params: {
            "filters[ismi][$containsi]": debouncedQuery,
            "pagination[pageSize]": 5,
            "populate": "rasmi"
          }
        }
      }).then((res) => res.data.data),
      BlogService.fetchBlogPosts({
        locale,
        config: {
          params: {
            "filters[sarlavha][$containsi]": debouncedQuery,
            "pagination[pageSize]": 5,
            "populate": "rasmi"
          }
        }
      }).then((res) => res.data.data),
    ])
      .then(([books, authors, blogs]) => {
        setBooks(books || []);
        setAuthors(authors || []);
        setBlogs(blogs || []);
        const grouped: any[] = [];
        if (books.length)
          grouped.push(
            ...books.map((b: Book) => ({
              type: "book",
              id: b.id,
              label: b.nomi,
              image: b.muqova?.url ? ensureAbsoluteUrl(b.muqova.url) : null,
              link: `/books/${b.slug}`,
            }))
          );
        if (authors.length)
          grouped.push(
            ...authors.map((a: Author) => ({
              type: "author",
              id: a.id,
              label: a.ismi,
              image: a.rasmi?.url ? ensureAbsoluteUrl(a.rasmi.url) : null,
              link: `/authors/${a.slug}`,
            }))
          );
        if (blogs.length)
          grouped.push(
            ...blogs.map((b: Blog) => ({
              type: "blog",
              id: b.id,
              label: b.sarlavha,
              image: b.rasmi?.url ? ensureAbsoluteUrl(b.rasmi.url) : null,
              link: `/blog/${b.slug}`,
            }))
          );
        setGroupedResults(grouped);
        setActiveIndex(0);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, router.locale]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const renderResults = () => {
    if (!debouncedQuery) return null;
    if (loading)
      return <div className="p-6 text-center text-gray-400">Qidirilmoqda...</div>;
    if (
      books.length === 0 &&
      authors.length === 0 &&
      blogs.length === 0
    )
      return (
        <div className="p-6 text-center text-gray-400">
          Hech narsa topilmadi
        </div>
      );
    return (
      <div className="max-h-96 overflow-y-auto">
        {books.length > 0 && (
          <div>
            <div className="px-4 pt-4 pb-1 text-xs font-bold text-gray-500">
              Kitoblar
            </div>
            {books.map((b, i) => (
              <div
                key={`book-${b.id}`}
                className={classNames(
                  "flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100",
                  groupedResults[activeIndex]?.id === b.id &&
                    groupedResults[activeIndex]?.type === "book"
                    ? "bg-gray-100"
                    : ""
                )}
                onClick={() => {
                  router.push(`/books/${b.slug}`);
                  onClose();
                }}
              >
                {b.muqova?.url && (
                  <img
                    src={ensureAbsoluteUrl(b.muqova.url)}
                    alt={b.nomi}
                    className="w-8 h-8 rounded object-cover mr-3"
                  />
                )}
                <span>{highlightMatch(b.nomi, debouncedQuery)}</span>
              </div>
            ))}
          </div>
        )}
        {authors.length > 0 && (
          <div>
            <div className="px-4 pt-4 pb-1 text-xs font-bold text-gray-500">
              Mualliflar
            </div>
            {authors.map((a, i) => (
              <div
                key={`author-${a.id}`}
                className={classNames(
                  "flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100",
                  groupedResults[activeIndex]?.id === a.id &&
                    groupedResults[activeIndex]?.type === "author"
                    ? "bg-gray-100"
                    : ""
                )}
                onClick={() => {
                  router.push(`/authors/${a.slug}`);
                  onClose();
                }}
              >
                {a.rasmi?.url && (
                  <img
                    src={ensureAbsoluteUrl(a.rasmi.url)}
                    alt={a.ismi}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                )}
                <span>{highlightMatch(a.ismi, debouncedQuery)}</span>
              </div>
            ))}
          </div>
        )}
        {blogs.length > 0 && (
          <div>
            <div className="px-4 pt-4 pb-1 text-xs font-bold text-gray-500">
              Bloglar
            </div>
            {blogs.map((b, i) => (
              <div
                key={`blog-${b.id}`}
                className={classNames(
                  "flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100",
                  groupedResults[activeIndex]?.id === b.id &&
                    groupedResults[activeIndex]?.type === "blog"
                    ? "bg-gray-100"
                    : ""
                )}
                onClick={() => {
                  router.push(`/blog/${b.slug}`);
                  onClose();
                }}
              >
                {b.rasmi?.url && (
                  <img
                    src={ensureAbsoluteUrl(b.rasmi.url)}
                    alt={b.sarlavha}
                    className="w-8 h-8 rounded object-cover mr-3"
                  />
                )}
                <span>{highlightMatch(b.sarlavha, debouncedQuery)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg shadow-lg mt-32 w-full max-w-xl mx-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
          aria-label="Yopish"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          className="w-full border border-gray-200 h-14 rounded-md outline-none px-5 text-xl focus:border-primary"
          placeholder="Qidirish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Qidirish"
        />
        <div className="mt-2">{renderResults()}</div>
      </div>
    </div>
  );
};

export default GlobalSearchModal; 