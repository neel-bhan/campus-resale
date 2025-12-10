import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Post } from "@/utils/api";
import { mockPosts } from "@/utils/mockData";
import { getPostImages } from "@/utils/postImages";
import { Button } from "@/components/ui/button";
import { CreatePostDrawer } from "@/components/CreatePostDrawer";
import { Plus, Ticket, BookOpen, TrendingUp, Eye } from "lucide-react";

interface DashboardProps {
  user: any;
}

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [sportsTickets, setSportsTickets] = useState<Post[]>([]);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  useEffect(() => {
    // Use mock data instead of API call
    const posts = mockPosts;

    // Sort by views for trending (highest views first)
    const sortedByViews = [...posts].sort((a, b) => b.views - a.views);
    setTrendingPosts(sortedByViews.slice(0, 4));

    // Sort by creation date for recent (most recent first)
    const sortedByDate = [...posts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
    setRecentPosts(sortedByDate.slice(0, 4));

    // Filter and sort sports tickets by event date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sportsTicketPosts = posts
      .filter((post) => post.category === "game-tickets")
      .filter((post) => post.event_date) // Only show tickets with event dates
      .filter((post) => {
        // Only show future events (including today)
        const eventDate = new Date(post.event_date!);
        return eventDate >= today;
      })
      .sort((a, b) => {
        // Sort by event date (earliest/closest first)
        const dateA = new Date(a.event_date!).getTime();
        const dateB = new Date(b.event_date!).getTime();
        return dateA - dateB;
      });

    setSportsTickets(sportsTicketPosts.slice(0, 3));
  }, []);

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(0)}`;
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Posted just now";
    if (diffInHours < 24) return `Posted ${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Posted ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Sports Tickets": "bg-red-500",
      Textbooks: "bg-blue-500",
      Electronics: "bg-purple-500",
      Furniture: "bg-green-500",
      Clothing: "bg-pink-500",
      Other: "bg-gray-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <div className="text-right text-sm text-gray-400">
              <div>{user?.university || "University"}</div>
              <div>Spring 2025</div>
            </div>
          </div>
          <p className="text-gray-400">
            What are you looking to buy or sell today?
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Post an Item */}
          <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Post an Item
                </h3>
                <p className="text-gray-400 text-sm">
                  List something to sell on the marketplace
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreateDrawerOpen(true)}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              Create Listing
            </Button>
          </div>

          {/* Game Tickets */}
          <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Game Tickets
                </h3>
                <p className="text-gray-400 text-sm">
                  Find tickets for upcoming sports events
                </p>
              </div>
            </div>
            <Button
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
              onClick={() => navigate("/posts?filter=sports-tickets")}
            >
              Browse Tickets
            </Button>
          </div>

          {/* Textbooks */}
          <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Textbooks</h3>
                <p className="text-gray-400 text-sm">
                  Find or sell course materials and books
                </p>
              </div>
            </div>
            <Button
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
              onClick={() => navigate("/posts?category=textbooks")}
            >
              Find Textbooks
            </Button>
          </div>
        </div>

        {/* Trending Now */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-teal-400" />
              Trending Now
            </h2>
            <button
              className="text-teal-400 hover:text-teal-300 transition-colors"
              onClick={() => navigate("/posts?filter=trending")}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
                onClick={() => navigate(`/posts?id=${post.id}`)}
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center overflow-hidden">
                  {(() => {
                    const images = getPostImages(post);
                    return images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                          <div class="text-4xl">
                            ${
                              post.category === "game-tickets"
                                ? "🎫"
                                : post.category === "textbooks"
                                ? "📚"
                                : post.category === "electronics"
                                ? "💻"
                                : post.category === "furniture"
                                ? "🪑"
                                : post.category === "clothing"
                                ? "👕"
                                : "📦"
                            }
                          </div>
                        `;
                      }}
                    />
                    ) : (
                      <div className="text-4xl">
                        {post.category === "game-tickets" && "🎫"}
                        {post.category === "textbooks" && "📚"}
                        {post.category === "electronics" && "💻"}
                        {post.category === "furniture" && "🪑"}
                        {post.category === "clothing" && "👕"}
                        {post.category === "other" && "📦"}
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

                  <h3 className="font-semibold text-white mb-1 line-clamp-1">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {post.views}
                    </span>
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-xs"
                      onClick={() => navigate(`/posts?id=${post.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Listings</h2>
            <button
              className="text-teal-400 hover:text-teal-300 transition-colors"
              onClick={() => navigate("/posts?filter=recent")}
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-xl p-4 flex items-center hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
                onClick={() => navigate(`/posts?id=${post.id}`)}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
                  {(() => {
                    const images = getPostImages(post);
                    return images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                          <div class="text-2xl">
                            ${
                              post.category === "game-tickets"
                                ? "🎫"
                                : post.category === "textbooks"
                                ? "📚"
                                : post.category === "electronics"
                                ? "💻"
                                : post.category === "furniture"
                                ? "🪑"
                                : post.category === "clothing"
                                ? "👕"
                                : "📦"
                            }
                          </div>
                        `;
                        }}
                      />
                    ) : (
                      <div className="text-2xl">
                        {post.category === "game-tickets" && "🎫"}
                        {post.category === "textbooks" && "📚"}
                        {post.category === "electronics" && "💻"}
                        {post.category === "furniture" && "🪑"}
                        {post.category === "clothing" && "👕"}
                        {post.category === "other" && "📦"}
                      </div>
                    );
                  })()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{post.title}</h3>
                    <span className="text-lg font-bold text-white">
                      {formatPrice(post.price)}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {timeAgo(post.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Upcoming Campus Events */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Upcoming Campus Events
            </h2>
            <button
              className="text-teal-400 hover:text-teal-300 transition-colors"
              onClick={() => navigate("/posts?filter=sports-tickets")}
            >
              View Calendar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sportsTickets.length > 0 ? (
              sportsTickets.map((ticket) => {
                const eventDate = new Date(ticket.event_date!);
                const month = eventDate.toLocaleDateString("en-US", {
                  month: "short",
                });
                const day = eventDate.getDate();
                const time = eventDate.toLocaleDateString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={ticket.id}
                    className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
                  >
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                        <Ticket className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {ticket.event || ticket.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {ticket.category === "game-tickets"
                            ? "Sports Event"
                            : "Campus Event"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-300">
                        <span className="text-sm">
                          {month} {day}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <span className="text-sm">{time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {ticket.views} tickets available
                      </span>
                      <button
                        className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        onClick={() => navigate("/posts?filter=sports-tickets")}
                      >
                        Find Tickets
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              // Default placeholder events when no sports tickets are available
              <>
                <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Stanford vs UCLA
                      </h3>
                      <p className="text-gray-400 text-sm">Football Game</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm">Mar 18</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm">3:30 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      48 tickets available
                    </span>
                    <button 
                      className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      onClick={() => navigate("/posts?filter=sports-tickets")}
                    >
                      Find Tickets
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Stanford vs USC
                      </h3>
                      <p className="text-gray-400 text-sm">Basketball Game</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm">Mar 15</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm">7:30 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      32 tickets available
                    </span>
                    <button 
                      className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      onClick={() => navigate("/posts?filter=sports-tickets")}
                    >
                      Find Tickets
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Spring Concert
                      </h3>
                      <p className="text-gray-400 text-sm">Campus Quad</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm">Mar 25</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="text-sm">6:00 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      75 tickets available
                    </span>
                    <button 
                      className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      onClick={() => navigate("/posts?filter=sports-tickets")}
                    >
                      Find Tickets
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Drawer */}
      <CreatePostDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => {
          // In frontend-only mode, just close the drawer
          setIsCreateDrawerOpen(false);
        }}
      />
    </div>
  );
}
