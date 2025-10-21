import React, { useState, useEffect } from 'react';
import { Search, Menu, Share2, Bookmark, Clock } from 'lucide-react';

// Define interface for Article type
interface Article {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

// Dummy data fallback
const DUMMY_DATA = {
  status: "ok",
  totalResults: 8,
  articles: [
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Lucy Hiddleston",
      title: "Cake meme reflects coronavirus absurdity in a world where nothing is what it seems",
      description: "Earlier this month, a viral video depicting hyper-realistic cakes as everyday items had folks on social media double-guessing every other post, and sometimes even their own realities.",
      url: "https://example.com/cake-meme",
      urlToImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
      publishedAt: "2025-10-20T10:00:00Z",
      content: "Full content about the viral cake meme trend..."
    },
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Lucy Hiddleston",
      title: "John Lewis, civil rights giant, crosses infamous Selma bridge one final time",
      description: "Solemn crowds watch as Lewis, who died earlier this month at the age of 80, is borne by caisson over Edmund Pettus Bridge",
      url: "https://example.com/john-lewis",
      urlToImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
      publishedAt: "2025-10-20T06:00:00Z",
      content: "The body of the late US Rep. John Lewis on Sunday will make the final journey across the famous bridge in Selma, Alabama..."
    },
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Caroline Casey",
      title: "John Lewis to make final journey across Edmund Pettus Bridge in procession",
      description: "The body of the late US Rep. John Lewis on Sunday will make the final journey across the famous bridge in Selma, Alabama, where he helped lead a march for voting rights in 1965.",
      url: "https://example.com/lewis-procession",
      urlToImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
      publishedAt: "2025-10-20T08:00:00Z",
      content: "Full article content here..."
    },
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Lucy Hiddleston",
      title: "Tornado and tide warnings as Storm Hanna lashes Texas",
      description: "Storm Hanna brings severe weather conditions to the Texas coast with tornado warnings and dangerous tides.",
      url: "https://example.com/storm-hanna",
      urlToImage: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800",
      publishedAt: "2025-10-20T03:00:00Z",
      content: "Weather alerts issued across Texas coastal regions..."
    },
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Lucy Hiddleston",
      title: "20 Years Ago, Steve Jobs Built the 'Coolest Computer Ever.' It Bombed",
      description: "This reports mark's the 20th anniversary of the Power Mac G4 Cube, which debuted July 19, 2000.",
      url: "https://example.com/power-mac-cube",
      urlToImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
      publishedAt: "2025-10-19T20:00:00Z",
      content: "A look back at Apple's ambitious but commercially unsuccessful Power Mac G4 Cube..."
    },
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Staff Reporter",
      title: "Beloved Arizona coach loses battle with coronavirus",
      description: "The coaching community mourns the loss of a beloved figure who succumbed to COVID-19 complications.",
      url: "https://example.com/arizona-coach",
      urlToImage: "https://images.unsplash.com/photo-1577223625816-7546f9e1d333?w=800",
      publishedAt: "2025-10-20T07:00:00Z",
      content: "Memorial services planned for legendary coach..."
    },
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Health Desk",
      title: "Serological surveys are being conducted to test for coronavirus antibodies. How useful are they?",
      description: "The authorities are hoping to find that a substantial proportion of the population has already been infected with the virus.",
      url: "https://example.com/antibody-tests",
      urlToImage: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800",
      publishedAt: "2025-10-19T18:00:00Z",
      content: "Scientists examine the effectiveness of antibody testing..."
    },
    {
      source: { id: "nbc-news", name: "NBC News" },
      author: "Sports Desk",
      title: "Making a mark in Asia: East Bengal's 2003 Asean Cup win - a defining moment for Indian club football",
      description: "Beating some of the finest teams from South Asia, East Bengal became the first Indian club to win an officially recognised Asian football tournament.",
      url: "https://example.com/east-bengal",
      urlToImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
      publishedAt: "2025-10-19T16:00:00Z",
      content: "A historic victory that changed Indian football..."
    }
  ]
};

const CATEGORIES = [
  { id: 'general', name: 'Latest Stories' },
  { id: 'business', name: 'Business' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' }
];

const App = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchResults, setSearchResults] = useState<Article[]>([]);

  const API_KEY = '3a0f9b9c40b944c095c75d35e6d0eeae';

  // Fetch articles based on category or search
  const fetchArticles = async (category = 'general', page = 1, query = '') => {
    setLoading(true);
    
    try {
      let url;
      if (query) {
        // Use everything endpoint for search
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&page=${page}&apiKey=${API_KEY}`;
      } else {
        // Use top-headlines for categories
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=20&page=${page}&apiKey=${API_KEY}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (query) {
          setSearchResults(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
        } else {
          setArticles(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
        }
        setTotalResults(data.totalResults);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.log('Using dummy data:', error);
      if (query) {
        setSearchResults(prev => page === 1 ? DUMMY_DATA.articles : [...prev, ...DUMMY_DATA.articles]);
      } else {
        setArticles(prev => page === 1 ? DUMMY_DATA.articles : [...prev, ...DUMMY_DATA.articles]);
      }
      setTotalResults(DUMMY_DATA.totalResults);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
    fetchArticles(category, 1);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setPage(1);
    fetchArticles('', 1, searchQuery);
  };

  // Load more articles
  const loadMoreArticles = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    
    if (searchQuery) {
      fetchArticles('', nextPage, searchQuery);
    } else {
      fetchArticles(activeCategory, nextPage);
    }
  };

  // Initial fetch and refetch when category or page changes
    useEffect(() => {
      fetchArticles(activeCategory, page);
    }, [activeCategory, page]);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Determine which articles to display
  const displayedArticles = searchQuery ? searchResults : articles;

  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/NBC_News_2023.svg/320px-NBC_News_2023.svg.png" 
                alt="NBC News" 
                className="h-8 cursor-pointer" 
                onClick={() => {
                  setActiveCategory('general');
                  setSearchQuery('');
                  setPage(1);
                  fetchArticles('general', 1);
                }}
              />
              
              {showSearchInput ? (
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news..."
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C31815]"
                    autoFocus
                  />
                  <button type="submit" className="text-[#C31815] font-medium">Search</button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <nav className="hidden md:flex space-x-6 text-sm">
                  {CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`${
                        activeCategory === category.id 
                          ? 'text-[#C31815] font-medium' 
                          : 'text-[#000000] hover:text-[#C31815]'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {showSearchInput ? null : (
                <Search 
                  className="w-5 h-5 text-gray-600 cursor-pointer" 
                  onClick={() => setShowSearchInput(true)} 
                />
              )}
              <Menu 
                className="w-6 h-6 text-gray-600 cursor-pointer" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {displayedArticles[0] && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-[#D0E9F2] rounded-lg overflow-hidden">
            <div className="p-8">
              <img 
                src={displayedArticles[0].urlToImage || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800'} 
                alt="" 
                className="w-full rounded-lg shadow-lg" 
              />
            </div>
            <div className="p-8">
              <span className="text-[#C31815] text-sm font-bold uppercase">
                {activeCategory === 'general' ? 'Trending' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </span>
              <h1 className="text-3xl font-bold text-[#000000] mt-2 mb-4 leading-tight">
                {displayedArticles[0].title}
              </h1>
              <p className="text-[#141414] mb-4 leading-relaxed">
                {displayedArticles[0].description}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <span>{getTimeAgo(displayedArticles[0].publishedAt)}</span>
                <span className="mx-2">·</span>
                <span>By {displayedArticles[0].author || 'Staff'}</span>
                <span className="mx-2">·</span>
                <span>4min read</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breaking News Banner */}
      <div className="bg-[#C31815] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <span className="bg-white text-[#C31815] px-3 py-1 text-sm font-bold mr-4">Breaking News</span>
          <span className="text-sm">Kanye West says he's running for president in 2020.</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`whitespace-nowrap pb-2 px-1 text-sm font-medium ${
                activeCategory === category.id 
                  ? 'border-b-2 border-[#C31815] text-[#000000]' 
                  : 'text-gray-600 hover:text-[#000000]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedArticles.slice(1).map((article, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => setSelectedArticle(article)}
            >
              <div className="relative">
                <img 
                  src={article.urlToImage || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800'} 
                  alt="" 
                  className="w-full h-48 object-cover" 
                />
                {index === 2 && activeCategory === 'general' && (
                  <span className="absolute top-2 left-2 bg-[#C31815] text-white px-2 py-1 text-xs font-bold rounded">WEATHER</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#000000] mb-2 line-clamp-2 hover:text-[#C31815]">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{getTimeAgo(article.publishedAt)}</span>
                  <span className="mx-2">·</span>
                  <span>By {article.author || 'Staff'}</span>
                  <span className="mx-2">·</span>
                  <span>4min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayedArticles.length > 0 && (
          <div className="text-center mb-12">
            <button 
              className="border-2 border-[#C31815] text-[#C31815] px-8 py-2 rounded font-medium hover:bg-[#C31815] hover:text-white transition-colors"
              onClick={loadMoreArticles}
              disabled={loading || displayedArticles.length >= totalResults}
            >
              {loading ? 'Loading...' : 'VIEW MORE'}
            </button>
          </div>
        )}

        {/* Editor's Picks */}
        {!searchQuery && activeCategory === 'general' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#000000] mb-6 flex items-center">
              Editor's Picks
              <span className="ml-2 text-[#C31815]">★</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {articles.slice(6, 9).map((article, index) => (
                <div 
                  key={index} 
                  className="cursor-pointer" 
                  onClick={() => setSelectedArticle(article)}
                >
                  <img 
                    src={article.urlToImage || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800'} 
                    alt="" 
                    className="w-full h-48 object-cover rounded-lg mb-3" 
                  />
                  <h3 className="font-bold text-[#000000] mb-2 hover:text-[#C31815]">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {article.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#0E1E32] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/NBC_News_2023.svg/320px-NBC_News_2023.svg.png" 
                alt="NBC News" 
                className="h-8 mb-4 brightness-0 invert" 
              />
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Do not sell my personal info</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">nbcnews.com Site Map</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Coupons</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400">
            <p>Copyright © 2025 | NBC News</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#F7F4F4]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/NBC_News_2023.svg/320px-NBC_News_2023.svg.png" 
                alt="NBC News" 
                className="h-8 cursor-pointer" 
                onClick={onBack} 
              />
              <nav className="hidden md:flex space-x-6 text-sm">
                <a href="#" className="text-[#222222] hover:text-[#C31815]">Corona Updates</a>
                <a href="#" className="text-[#222222] hover:text-[#C31815]">Politics</a>
                <a href="#" className="text-[#222222] hover:text-[#C31815]">Business</a>
                <a href="#" className="text-[#222222] hover:text-[#C31815]">Sports</a>
                <a href="#" className="text-[#222222] hover:text-[#C31815]">World</a>
                <a href="#" className="text-[#222222] hover:text-[#C31815]">Travel</a>
                <a href="#" className="text-[#222222] hover:text-[#C31815]">Podcasts</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
              <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onBack} className="text-[#C31815] mb-6 flex items-center hover:underline">
          ← Back to Home
        </button>

        {/* Article Header */}
        <div className="bg-[#0E1E32] text-white p-8 rounded-t-lg">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Article Image */}
        <img 
          src={article.urlToImage || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200'} 
          alt="" 
          className="w-full h-96 object-cover"
        />

        {/* Article Content */}
        <div className="bg-white p-8 rounded-b-lg shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{getTimeAgo(article.publishedAt)}</span>
              <span className="mx-2">·</span>
              <span>By {article.author || 'Staff Reporter'}</span>
              <span className="mx-2">·</span>
              <span>6min read</span>
            </div>
            <div className="flex items-center space-x-4">
              <Share2 className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#C31815]" />
              <Bookmark className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#C31815]" />
            </div>
          </div>

          {/* Article Body */}
          <div className="prose max-w-none">
            <p className="text-xl text-[#222222] mb-6 font-medium leading-relaxed">
              {article.description}
            </p>

            <div className="bg-[#F6DDDC] border-l-4 border-[#C31815] p-6 mb-6">
              <p className="text-[#222222] italic">
                "{article.title}"
              </p>
            </div>

            <p className="text-[#222222] mb-4 leading-relaxed">
              {article.content || `Events unfolded as ${article.source.name} reported earlier this week. The situation continues to develop with significant implications for those involved.`}
            </p>

            <p className="text-[#222222] mb-4 leading-relaxed">
              Local authorities have been closely monitoring the situation, working to ensure public safety and provide timely updates to concerned citizens. Community leaders have expressed their support and solidarity during this time.
            </p>

            <p className="text-[#222222] mb-4 leading-relaxed">
              Experts in the field have weighed in on the matter, offering insights and analysis on what this means for the broader community. The response has been swift, with multiple agencies coordinating their efforts.
            </p>

            <h2 className="text-2xl font-bold text-[#222222] mt-8 mb-4">Key Developments</h2>
            
            <p className="text-[#222222] mb-4 leading-relaxed">
              As the story continues to unfold, officials have emphasized the importance of accurate information and have urged the public to stay informed through reliable sources. Additional details are expected to emerge in the coming days.
            </p>

            <div className="bg-[#EFBFBE] p-6 rounded-lg my-8">
              <h3 className="text-lg font-bold text-[#222222] mb-3">Related Coverage</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#C31815] hover:underline">Follow live updates on this developing story</a></li>
                <li><a href="#" className="text-[#C31815] hover:underline">Analysis: What this means for the community</a></li>
                <li><a href="#" className="text-[#C31815] hover:underline">Expert opinions and reactions</a></li>
              </ul>
            </div>

            <p className="text-[#222222] mb-4 leading-relaxed">
              This is a developing story. Check back for updates as more information becomes available.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#F6DDDC] text-[#C31815] px-3 py-1 rounded-full text-sm">NEWS</span>
              <span className="bg-[#F6DDDC] text-[#C31815] px-3 py-1 rounded-full text-sm">BREAKING</span>
              <span className="bg-[#F6DDDC] text-[#C31815] px-3 py-1 rounded-full text-sm">USA</span>
              <span className="bg-[#F6DDDC] text-[#C31815] px-3 py-1 rounded-full text-sm">LATEST</span>
            </div>
          </div>

          {/* Author Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-[#C31815] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {(article.author || 'S')[0]}
              </div>
              <div>
                <h4 className="font-bold text-[#222222] mb-1">{article.author || 'Staff Reporter'}</h4>
                <p className="text-sm text-gray-600">
                  {article.author || 'Staff Reporter'} is an award-winning journalist covering news and events for {article.source.name}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-[#222222] mb-6">Related Topics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer">
                <img 
                  src={`https://images.unsplash.com/photo-${1495020689067 + i}-958852a7765e?w=400`} 
                  alt="" 
                  className="w-full h-40 object-cover" 
                />
                <div className="p-4">
                  <h4 className="font-bold text-[#222222] mb-2 line-clamp-2 hover:text-[#C31815]">
                    Related Article Title {i}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Brief description of the related article content goes here.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0E1E32] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/NBC_News_2023.svg/320px-NBC_News_2023.svg.png" 
                alt="NBC News" 
                className="h-8 mb-4 brightness-0 invert" 
              />
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Do not sell my personal info</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Coupons</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400">
            <p>Copyright © 2025 | NBC News</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;