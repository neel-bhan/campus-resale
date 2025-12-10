import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { type Post } from "@/utils/api";
import { getPostImages } from "@/utils/postImages";
import { getAllPostsFromBucket } from "@/utils/bucketApi";
import { mockPosts } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Calendar,
  Filter,
  Search,
  Grid3X3,
  List,
  TrendingUp,
  Clock,
  Ticket,
  BookOpen,
  Laptop,
  Sofa,
  Shirt,
  Package,
} from "lucide-react";

export function PostsListingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshKey, setRefreshKey] = useState(0);

  // Get filter from URL params
  const filter = searchParams.get("filter") || "all";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "latest";

  const categories = [
    { id: "all", label: "All Categories", icon: Package },
    { id: "game-tickets", label: "Sports Tickets", icon: Ticket },
    { id: "textbooks", label: "Textbooks", icon: BookOpen },
    { id: "electronics", label: "Electronics", icon: Laptop },
    { id: "furniture", label: "Furniture", icon: Sofa },
    { id: "clothing", label: "Clothing", icon: Shirt },
    { id: "other", label: "Other", icon: Package },
  ];

  const sortOptions = [
    { id: "latest", label: "Latest", icon: Clock },
    { id: "trending", label: "Most Views", icon: TrendingUp },
    { id: "price-low", label: "Price: Low to High", icon: Filter },
    { id: "price-high", label: "Price: High to Low", icon: Filter },
  ];

  useEffect(() => {
    // Set initial filters from URL params
    setSelectedCategory(category);
    setSortBy(sort);

    // Handle special filter cases
    if (filter === "sports-tickets") {
      setSelectedCategory("game-tickets");
      setViewMode("list");
    } else if (filter === "trending") {
      setSortBy("trending");
    } else if (filter === "recent") {
      setSortBy("latest");
    }
  }, [category, sort, filter]);

  useEffect(() => {
    // Load posts from Bucket API, fallback to mock data
    const loadPosts = async () => {
      setLoading(true);
      try {
        const bucketPosts = await getAllPostsFromBucket();
        // Transform Bucket API posts to match Post interface
        const transformedPosts: Post[] = bucketPosts.map((p: any) => ({
          id: parseInt(p.id?.replace(/\D/g, "") || Date.now().toString()),
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          seller_id: p.seller_id || 1,
          university: p.university || "University of Wisconsin-Madison",
          images: p.images || [],
          views: p.views || 0,
          status: p.status || "active",
          contact_method: p.contact_method,
          course: p.course,
          event: p.event,
          location: p.location,
          event_date: p.event_date,
          created_at: p.created_at || new Date().toISOString(),
          updated_at: p.updated_at || new Date().toISOString(),
          seller_name: p.seller_name,
          seller_email: p.seller_email,
        }));

        // Combine with mock posts (mock posts are the premade ones)
        const allPosts = [...mockPosts, ...transformedPosts];
        setPosts(allPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        // Fallback to mock data on error
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();

    // Listen for post creation events
    const handlePostCreated = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener("postCreated", handlePostCreated);
    return () => {
      window.removeEventListener("postCreated", handlePostCreated);
    };
  }, [refreshKey]);

  useEffect(() => {
    let filtered = [...posts];

    console.log("Filtering posts:", {
      totalPosts: posts.length,
      selectedCategory,
      sortBy,
      searchTerm,
    });

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
      console.log("After category filter:", filtered.length);

      // Apply sports tickets specific filtering if game-tickets category is selected
      if (selectedCategory === "game-tickets") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(
          "Filtering sports tickets for future events only, today:",
          today
        );

        const beforeDateFilter = filtered.length;
        filtered = filtered.filter((post) => {
          if (!post.event_date) return false;
          const eventDate = new Date(post.event_date);
          const isFuture = eventDate >= today;
          console.log(
            "Event:",
            post.title,
            "Date:",
            post.event_date,
            "Is future:",
            isFuture
          );
          return isFuture;
        });
        console.log(
          "After date filter:",
          beforeDateFilter,
          "->", 
          filtered.length
        );
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "latest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
    console.log("Final filtered posts:", filtered.length);
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "game-tickets":
        return "bg-red-500";
      case "textbooks":
        return "bg-blue-500";
      case "electronics":
        return "bg-purple-500";
      case "furniture":
        return "bg-green-500";
      case "clothing":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const getPageTitle = () => {
    if (selectedCategory !== "all") {
      const cat = categories.find((c) => c.id === selectedCategory);
      return cat?.label || "Posts";
    }

    // Handle special URL-based titles
    if (filter === "trending") return "Trending Posts";
    if (filter === "recent") return "Recent Listings";
    if (filter === "sports-tickets") return "Sports Tickets";

    return "All Posts";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading posts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-gray-400">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"} found
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
              aria-label="Search posts by title or description"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-4">
              <label className="text-white text-sm font-medium">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none min-w-[180px]"
                aria-label="Filter by category"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {(selectedCategory !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                    setSortBy("latest");
                  }}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  aria-label="Clear all filters"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-white text-sm font-medium">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                  aria-label="Sort posts by"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <label className="text-white text-sm font-medium">View:</label>
                <div className="flex bg-gray-700 rounded-lg border border-gray-600">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-l-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-teal-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <Grid3X3 className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                    className={`p-2 rounded-r-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-teal-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid/List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "No posts match your current filters"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/posts?id=${post.id}`);
                  }
                }}
                onClick={() => navigate(`/posts?id=${post.id}`)}
                aria-label={`View ${post.title} - ${formatPrice(post.price)}`}
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center overflow-hidden">
                  {(() => {
                    const images = getPostImages(post);
                    return images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={`${post.title} - ${post.category} item for sale`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <div class="text-4xl">
                              ${
                                post.category === "textbooks"
                                  ? "📚"
                                  : post.category === "electronics"
                                  ? "💻"
                                  : post.category === "furniture"
                                  ? "🪑"
                                  : post.category === "clothing"
                                  ? "👕"
                                  : post.category === "game-tickets"
                                  ? "🎫"
                                  : "📦"
                              }
                            </div>
                          </div>
                        `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-4xl">
                          {post.category === "textbooks" && "📚"}
                          {post.category === "electronics" && "💻"}
                          {post.category === "furniture" && "🪑"}
                          {post.category === "clothing" && "👕"}
                          {post.category === "game-tickets" && "🎫"}
                          {post.category === "other" && "📦"}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {formatPrice(post.price)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white mb-1 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Event Date for Sports Tickets */}
                  {post.category === "game-tickets" && post.event_date && (
                    <div className="flex items-center text-teal-400 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.event_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {post.views}
                    </span>
                    <span className="text-xs text-gray-500">
                      {timeAgo(post.created_at)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-3 bg-zinc-900 hover:bg-zinc-800 text-white"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-xl p-6 flex items-center hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/posts?id=${post.id}`);
                  }
                }}
                onClick={() => navigate(`/posts?id=${post.id}`)}
                aria-label={`View ${post.title} - ${formatPrice(post.price)}`}
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center mr-6 flex-shrink-0 overflow-hidden">
                  {(() => {
                    const images = getPostImages(post);
                    return images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={`${post.title} - ${post.category} item for sale`}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <div class="text-2xl">
                              ${
                                post.category === "textbooks"
                                  ? "📚"
                                  : post.category === "electronics"
                                  ? "💻"
                                  : post.category === "furniture"
                                  ? "🪑"
                                  : post.category === "clothing"
                                  ? "👕"
                                  : post.category === "game-tickets"
                                  ? "🎫"
                                  : "📦"
                              }
                            </div>
                          </div>
                        `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-2xl">
                          {post.category === "textbooks" && "📚"}
                          {post.category === "electronics" && "💻"}
                          {post.category === "furniture" && "🪑"}
                          {post.category === "clothing" && "👕"}
                          {post.category === "game-tickets" && "🎫"}
                          {post.category === "other" && "📦"}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full text-white mr-3 ${getCategoryColor(
                            post.category
                          )}`}
                        >
                          {post.category}
                        </span>
                        {post.category === "game-tickets" &&
                          post.event_date && (
                            <div className="flex items-center text-teal-400 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(post.event_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          )}
                      </div>

                      <h3 className="font-semibold text-white mb-1 text-lg">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {post.description}
                      </p>

                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="mr-4">{post.views} views</span>
                        <span>{timeAgo(post.created_at)}</span>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-white mb-2">
                        {formatPrice(post.price)}
                      </div>
                      <Button
                        size="sm"
                        className="bg-zinc-900 hover:bg-zinc-800 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
