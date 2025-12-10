// Helper function to get images for posts based on title and category
export function getPostImages(post: { title: string; category: string }): string[] {
  const title = post.title.toLowerCase();
  const category = (post.category || "").toLowerCase();

  // iPad/Tablet posts - get both iPad images
  if (title.includes("ipad") || title.includes("tablet")) {
    return ["/images/ipad1.jpeg", "/images/ipad2.jpeg"];
  }

  // MacBook/Laptop posts
  if (title.includes("macbook") || title.includes("laptop") || (title.includes("computer") && category.includes("electronics"))) {
    return ["/images/ipad1.jpeg"];
  }

  // iPhone/Phone posts
  if (title.includes("iphone") || title.includes("phone") || title.includes("mobile")) {
    return ["/images/ipad2.jpeg"];
  }

  // Monitor/Screen posts
  if (title.includes("monitor") || title.includes("screen")) {
    return ["/images/ipad1.jpeg"];
  }

  // Electronics (default)
  if (category.includes("electronics")) {
    return ["/images/ipad1.jpeg", "/images/ipad2.jpeg"];
  }

  // Calculus/Math textbooks
  if (title.includes("calculus") || title.includes("math") || title.includes("stewart")) {
    return ["/images/calculus_textbook.jpeg"];
  }

  // Physics textbooks
  if (title.includes("physics") || title.includes("halliday")) {
    return ["/images/physics_textbook_halliday.jpg"];
  }

  // Chemistry textbooks
  if (title.includes("chemistry") || title.includes("organic")) {
    return ["/images/organic_chemistry.jpg"];
  }

  // Textbooks (default)
  if (category.includes("textbook") || category.includes("textbooks")) {
    return ["/images/calculus_textbook.jpeg"];
  }

  // Chair/Furniture posts
  if (title.includes("chair") || title.includes("desk") || title.includes("gaming") || category.includes("furniture")) {
    return ["/images/gaming_chair.jpg"];
  }

  // Stanford vs USC tickets
  if (title.includes("stanford") && (title.includes("usc") || title.includes("southern california"))) {
    return ["/images/stanford_usc.jpeg"];
  }

  // Stanford vs Cal/UCLA football tickets
  if (title.includes("stanford") && (title.includes("cal") || title.includes("ucla") || title.includes("football"))) {
    return ["/images/stanford_ucla.jpg"];
  }

  // Warriors/Lakers tickets
  if (title.includes("warriors") || title.includes("lakers")) {
    return ["/images/stanford_usc.jpeg"];
  }

  // Concert tickets
  if (title.includes("concert") || title.includes("music")) {
    return ["/images/spring_concert.png"];
  }

  // Sports tickets (default)
  if (category.includes("sports") || category.includes("game-tickets") || category.includes("ticket")) {
    return ["/images/stanford_ucla.jpg", "/images/stanford_usc.jpeg"];
  }

  // Nike/Shoes/Clothing posts
  if (title.includes("nike") || title.includes("shoe") || title.includes("sneaker") || title.includes("air force")) {
    return ["/images/nike_shoes.jpg"];
  }

  // Clothing (default)
  if (category.includes("clothing")) {
    return ["/images/nike_shoes.jpg"];
  }

  // No match - return empty array (will show emoji fallback)
  return [];
}

