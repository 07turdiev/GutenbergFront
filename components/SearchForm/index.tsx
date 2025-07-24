import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import NovelService from "../../services/novels";
import AuthorService from "../../services/author";
import BlogService from "../../services/blog";
import { INovel } from "../../models/INovel";
import { IAuthor } from "../../models/IAuthors";
import { IBlogPost } from "../../models/IBlog";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./style.module.scss";

// Helper: Ensure absolute image URL
const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_API_URL || "http://localhost:1337";
  return `${baseUrl}${url}`;
};

// Helper: Get author image (handles different data structures)
const getAuthorImage = (author: IAuthor): string => {
  const photo = author?.photo;
  const rasmi = author?.rasmi;
  
  if (photo?.src) return photo.src;
  if (rasmi?.url) return ensureAbsoluteUrl(rasmi.url);
  
  return "";
};

// Helper: Highlight matching text
const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className={styles.highlightText}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

interface Props {
  open?: boolean;
  onClose: () => void;
}

const SearchForm = ({ open = false, onClose }: Props) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<INovel[]>([]);
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [blogs, setBlogs] = useState<IBlogPost[]>([]);

  interface GroupedResult {
    type: "book" | "author" | "blog";
    id: number;
    label: string;
    image?: string;
    link: string;
  }

  const [groupedResults, setGroupedResults] = useState<GroupedResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) {
      setQuery("");
      setBooks([]);
      setAuthors([]);
      setBlogs([]);
      setGroupedResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Keyboard navigation and close
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

  // Search logic
  useEffect(() => {
    // Only search if query is at least 2 non-whitespace characters
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setBooks([]);
      setAuthors([]);
      setBlogs([]);
      setGroupedResults([]);
      return;
    }
    setLoading(true);
    const locale = router.locale || "uz";
    const filter = debouncedQuery.trim();
    Promise.all([
      NovelService.fetchNovels({
        ...(filter ? {"filters[nomi][$containsi]": filter} : {}),
        "locale": locale,
        "pagination[pageSize]": 5,
        "populate": "muqova"
      }),
      AuthorService.fetchAuthors({
        ...(filter ? {"filters[ismi][$containsi]": filter} : {}),
        "locale": locale,
        "pagination[pageSize]": 5,
        "populate": "rasmi"
      }),
      BlogService.fetchBlogPosts({
        ...(filter ? {"filters[sarlavha][$containsi]": filter} : {}),
        "locale": locale,
        "pagination[pageSize]": 5,
        "populate": "rasmi"
      }),
    ])
      .then(([books, authors, blogs]) => {
        setBooks(books?.data?.data || []);
        setAuthors(authors?.data?.data || []);
        setBlogs(blogs?.data?.data || []);
        // Flatten for keyboard navigation
        const grouped: GroupedResult[] = [];
        if (books?.data?.data?.length)
          grouped.push(
            ...books.data.data.map((b: INovel) => ({
              type: "book" as const,
              id: b.id,
              label: b.nomi,
              image: b.muqova?.url ? ensureAbsoluteUrl(b.muqova.url) : "",
              link: `/books/${b.slug}`,
            }))
          );
        if (authors?.data?.data?.length)
          grouped.push(
            ...authors.data.data.map((a: IAuthor) => ({
              type: "author" as const,
              id: a.id,
              label: a.ismi,
              image: getAuthorImage(a),
              link: `/authors/${a.slug}`,
            }))
          );
        if (blogs?.data?.data?.length)
          grouped.push(
            ...blogs.data.data.map((b: IBlogPost) => ({
              type: "blog" as const,
              id: b.id,
              label: b.sarlavha,
              image: b.rasmi?.url ? ensureAbsoluteUrl(b.rasmi.url) : undefined,
              link: `/blog/${b.slug}`,
            }))
          );
        setGroupedResults(grouped);
        setActiveIndex(0);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, router.locale, router]);

  // Modal close on outside click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Grouped display for UI
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
            {books.map((b) => (
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
            {authors.map((a) => (
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
                {getAuthorImage(a) && (
                  <img
                    src={getAuthorImage(a)}
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
            {blogs.map((b) => (
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
      className={classNames("fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm", styles.searchModal)}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className={classNames("bg-white rounded-2xl shadow-2xl mt-20 w-full max-w-2xl mx-4 relative transition-all duration-300 transform", styles.searchContent)}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header Section */}
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{t('searchTitle')}</h2>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-[#cd1b17] hover:bg-red-50 transition-all"
              onClick={onClose}
              aria-label={t('searchClose')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:border-[#cd1b17] focus:outline-none transition-colors"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('searchLabel')}
            />
            {query && (
              <button
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setQuery('')}
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-[#cd1b17] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#cd1b17] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-[#cd1b17] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-[#cd1b17] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          ) : books.length === 0 && authors.length === 0 && blogs.length === 0 && debouncedQuery && debouncedQuery.trim().length >= 2 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">{t('searchNoResults')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('searchNoResultsDescription')}</p>
            </div>
          ) : !debouncedQuery || debouncedQuery.trim().length < 2 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-[#cd1b17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">{t('searchStartSearching')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('searchMinChars')}</p>
            </div>
          ) : (
            <>
              {books.length > 0 && (
                <div className="border-b border-gray-100 last:border-0">
                  <div className="px-6 py-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-700">{t('searchBooksSection')}</h3>
                      </div>
                      <span className="text-xs text-gray-500">{books.length} {t('searchResultsCount')}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {books.map((b) => (
                      <div
                        key={`book-${b.id}`}
                        className={classNames(
                          "flex items-center px-6 py-3 cursor-pointer transition-all hover:bg-red-50 group",
                          groupedResults[activeIndex]?.id === b.id &&
                            groupedResults[activeIndex]?.type === "book"
                            ? "bg-red-50"
                            : ""
                        )}
                        onClick={() => {
                          router.push(`/books/${b.slug}`);
                          onClose();
                        }}
                      >
                        <div className="relative">
                          {b.muqova?.url ? (
                            <img
                              src={ensureAbsoluteUrl(b.muqova.url)}
                              alt={b.nomi}
                              className="w-12 h-16 rounded-lg object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                          {b.yangi && (
                            <span className="absolute -top-1 -right-1 bg-[#cd1b17] text-white text-xs px-1.5 py-0.5 rounded-full font-medium">{t('searchNewLabel')}</span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-[#cd1b17]">{highlightMatch(b.nomi, debouncedQuery)}</p>
                          {b.mualliflar && (
                            <p className="text-sm text-gray-500 mt-0.5">{b.mualliflar.ismi}</p>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#cd1b17] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {authors.length > 0 && (
                <div className="border-b border-gray-100 last:border-0">
                  <div className="px-6 py-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-700">{t('searchAuthorsSection')}</h3>
                      </div>
                      <span className="text-xs text-gray-500">{authors.length} {t('searchResultsCount')}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {authors.map((a) => (
                      <div
                        key={`author-${a.id}`}
                        className={classNames(
                          "flex items-center px-6 py-3 cursor-pointer transition-all hover:bg-red-50 group",
                          groupedResults[activeIndex]?.id === a.id &&
                            groupedResults[activeIndex]?.type === "author"
                            ? "bg-red-50"
                            : ""
                        )}
                        onClick={() => {
                          router.push(`/authors/${a.slug}`);
                          onClose();
                        }}
                      >
                        {getAuthorImage(a) ? (
                          <img
                            src={getAuthorImage(a)}
                            alt={a.ismi}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-[#cd1b17]">{highlightMatch(a.ismi, debouncedQuery)}</p>
                          {a.kitoblars && a.kitoblars.length > 0 && (
                            <p className="text-sm text-gray-500 mt-0.5">{a.kitoblars.length} {t('searchBooksCount')}</p>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#cd1b17] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {blogs.length > 0 && (
                <div>
                  <div className="px-6 py-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-700">{t('searchBlogsSection')}</h3>
                      </div>
                      <span className="text-xs text-gray-500">{blogs.length} {t('searchResultsCount')}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {blogs.map((b) => (
                      <div
                        key={`blog-${b.id}`}
                        className={classNames(
                          "flex items-center px-6 py-3 cursor-pointer transition-all hover:bg-red-50 group",
                          groupedResults[activeIndex]?.id === b.id &&
                            groupedResults[activeIndex]?.type === "blog"
                            ? "bg-red-50"
                            : ""
                        )}
                        onClick={() => {
                          router.push(`/blog/${b.slug}`);
                          onClose();
                        }}
                      >
                        {b.rasmi?.url ? (
                          <img
                            src={ensureAbsoluteUrl(b.rasmi.url)}
                            alt={b.sarlavha}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-gray-900 group-hover:text-[#cd1b17]">{highlightMatch(b.sarlavha, debouncedQuery)}</p>
                          {b.chop_sanasi && (
                            <p className="text-sm text-gray-500 mt-0.5">{new Date(b.chop_sanasi).toLocaleDateString('uz-UZ')}</p>
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#cd1b17] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Keyboard shortcuts */}
        {(books.length > 0 || authors.length > 0 || blogs.length > 0) && (
          <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↓</kbd>
                  <span>{t('searchKeyboardSelect')}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                  <span>{t('searchKeyboardOpen')}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                  <span>{t('searchKeyboardClose')}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;