import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { type Post, getImageUrl } from "@/utils/api";
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    // Use mock data instead of API call
    setLoading(true);
    setPosts(mockPosts);
    setLoading(false);
  }, []);

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
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
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
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
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
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center overflow-hidden">
                  {post.images && post.images.length > 0 ? (
                    <img
                      src={getImageUrl(post.images[0])}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            ${
                              post.category === "game-tickets"
                                ? `<img src="${getImageUrl(
                                    "Uwmadison.png"
                                  )}" alt="UW Madison" class="w-full h-full object-cover" onerror="this.outerHTML='<div class=\\"text-4xl\\">🎫</div>'" />`
                                : `<div class="text-4xl">
                                    ${
                                      post.category === "textbooks"
                                        ? "📚"
                                        : post.category === "electronics"
                                        ? "💻"
                                        : post.category === "furniture"
                                        ? "🪑"
                                        : post.category === "clothing"
                                        ? "👕"
                                        : "📦"
                                    }
                                  </div>`
                            }
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {post.category === "game-tickets" ? (
                        <img
                          src={getImageUrl("Uwmadison.png")}
                          alt="UW Madison"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.outerHTML =
                              '<div class="text-4xl">🎫</div>';
                          }}
                        />
                      ) : (
                        <div className="text-4xl">
                          {post.category === "textbooks" && "📚"}
                          {post.category === "electronics" && "💻"}
                          {post.category === "furniture" && "🪑"}
                          {post.category === "clothing" && "👕"}
                          {post.category === "other" && "📦"}
                        </div>
                      )}
                    </div>
                  )}
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
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center mr-6 flex-shrink-0 overflow-hidden">
                  {post.images && post.images.length > 0 ? (
                    <img
                      src={getImageUrl(post.images[0])}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            ${
                              post.category === "game-tickets"
                                ? `<img src="${getImageUrl(
                                    "Uwmadison.png"
                                  )}" alt="UW Madison" class="w-full h-full object-cover rounded-lg" onerror="this.outerHTML='<div class=\\"text-2xl\\">🎫</div>'" />`
                                : `<div class="text-2xl">
                                    ${
                                      post.category === "textbooks"
                                        ? "📚"
                                        : post.category === "electronics"
                                        ? "💻"
                                        : post.category === "furniture"
                                        ? "🪑"
                                        : post.category === "clothing"
                                        ? "👕"
                                        : "📦"
                                    }
                                  </div>`
                            }
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {post.category === "game-tickets" ? (
                        <img
                          src={getImageUrl("Uwmadison.png")}
                          alt="UW Madison"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.outerHTML =
                              '<div class="text-2xl">🎫</div>';
                          }}
                        />
                      ) : (
                        <div className="text-2xl">
                          {post.category === "textbooks" && "📚"}
                          {post.category === "electronics" && "💻"}
                          {post.category === "furniture" && "🪑"}
                          {post.category === "clothing" && "👕"}
                          {post.category === "other" && "📦"}
                        </div>
                      )}
                    </div>
                  )}
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
