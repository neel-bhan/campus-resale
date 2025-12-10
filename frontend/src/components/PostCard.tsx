import { useNavigate } from "react-router-dom";
import { type Post } from "@/utils/api";
import { getPostImages } from "@/utils/postImages";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface PostCardProps {
  post: Post;
  formatPrice: (price: string) => string;
  getCategoryColor: (category: string) => string;
}

export function PostCard({ post, formatPrice, getCategoryColor }: PostCardProps) {
  const navigate = useNavigate();
  const images = getPostImages(post);

  return (
    <div
      className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
      onClick={() => navigate(`/posts?id=${post.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/posts?id=${post.id}`);
        }
      }}
      aria-label={`View ${post.title} - ${formatPrice(post.price)}`}
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={`${post.title} - ${post.category}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML = `
                <div class="text-4xl" role="img" aria-label="${post.category} category">
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
          <div className="text-4xl" role="img" aria-label={`${post.category} category`}>
            {post.category === "game-tickets" && "🎫"}
            {post.category === "textbooks" && "📚"}
            {post.category === "electronics" && "💻"}
            {post.category === "furniture" && "🪑"}
            {post.category === "clothing" && "👕"}
            {post.category === "other" && "📦"}
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

        <h3 className="font-semibold text-white mb-1 line-clamp-1">
          {post.title}
        </h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center">
            <Eye className="w-3 h-3 mr-1" aria-hidden="true" />
            {post.views}
          </span>
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/posts?id=${post.id}`);
            }}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

