import { useState } from "react";
import type { CreatePostRequest } from "@/utils/api";
import { addPostToBucket } from "@/utils/bucketApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface CreatePostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePostDrawer({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    description: "",
    price: 0,
    category: "",
    contactMethod: "email",
    course: "",
    event: "",
    location: "",
    eventDate: "",
  });

  const categories = [
    { value: "textbooks", label: "Textbooks" },
    { value: "electronics", label: "Electronics" },
    { value: "game-tickets", label: "Sports Tickets" },
    { value: "furniture", label: "Furniture" },
    { value: "clothing", label: "Clothing" },
    { value: "other", label: "Other" },
  ];

  const contactMethods = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "both", label: "Email & Phone" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // If category is changing, reset category-specific fields
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Reset category-specific fields when category changes
        course: "",
        event: "",
        location: "",
        eventDate: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || 0 : value,
      }));
    }
  };


  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      category: "",
      contactMethod: "email",
      course: "",
      event: "",
      location: "",
      eventDate: "",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.price ||
        !formData.category
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Category-specific validation
      if (formData.category === "textbooks" && !formData.course) {
        setError("Course is required for textbooks");
        setLoading(false);
        return;
      }

      if (formData.category === "game-tickets") {
        if (!formData.event) {
          setError("Event is required for sports tickets");
          setLoading(false);
          return;
        }
        if (!formData.eventDate) {
          setError("Event date is required for sports tickets");
          setLoading(false);
          return;
        }
        if (!formData.location) {
          setError("Venue/Location is required for sports tickets");
          setLoading(false);
          return;
        }
      }


      // Since we can't upload images to Bucket API, use empty array
      // Images will be handled by getPostImages() when displaying
      const images: string[] = [];

      // Prepare post data for Bucket API
      const postData = {
        title: formData.title,
        description: formData.description,
        price: formData.price.toString(),
        category: formData.category,
        contact_method: formData.contactMethod || "email",
        course: formData.course || null,
        event: formData.event || null,
        location: formData.location || null,
        event_date: formData.eventDate || null,
        images: images, // Empty - images assigned by getPostImages when displaying
        seller_id: 1, // Placeholder - not using auth
        seller_name: "Student",
        seller_email: "student@university.edu",
        university: "University of Wisconsin-Madison",
      };

      // Create post using Bucket API
      const response = await addPostToBucket(postData);

      if (response.success) {
        // Reset form and close drawer
        resetForm();
        onClose();

        // Dispatch custom event to refresh all views
        window.dispatchEvent(new CustomEvent("postCreated"));

        // Call success callback to refresh the list
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.error || "Failed to create post. Please try again.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 z-50 overflow-y-auto border-l border-gray-700 shadow-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Create New Listing
            </h2>
            <p className="text-gray-400">
              List an item for sale on the marketplace
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-white">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., MacBook Pro 2021, Calculus Textbook"
              className="mt-1 bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description *
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the condition, features, and any important details..."
              rows={3}
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              aria-label="Post description"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-white">
                Price ($) *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="mt-1 bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-white">
                Category *
              </Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Method */}
          <div>
            <Label htmlFor="contactMethod" className="text-white">
              Contact Method
            </Label>
            <select
              id="contactMethod"
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {contactMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Fields - Show based on category */}
          {(formData.category === "textbooks" ||
            formData.category === "game-tickets") && (
            <div className="grid grid-cols-1 gap-4">
              {formData.category === "textbooks" && (
                <div>
                  <Label htmlFor="course" className="text-white">
                    Course *
                  </Label>
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    value={formData.course}
                    onChange={handleInputChange}
                    placeholder="e.g., CS 106A, MATH 41, CHEM 33"
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
              )}

              {formData.category === "game-tickets" && (
                <>
                  <div>
                    <Label htmlFor="event" className="text-white">
                      Event *
                    </Label>
                    <Input
                      id="event"
                      name="event"
                      type="text"
                      value={formData.event}
                      onChange={handleInputChange}
                      placeholder="e.g., Stanford vs Cal Football, Basketball vs UCLA"
                      className="mt-1 bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventDate" className="text-white">
                      Event Date *
                    </Label>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="mt-1 bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-white">
                      Venue/Location *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Stanford Stadium, Maples Pavilion"
                      className="mt-1 bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* General Location Field for other categories */}
          {formData.category &&
            formData.category !== "game-tickets" &&
            formData.category !== "textbooks" && (
              <div>
                <Label htmlFor="location" className="text-white">
                  Pickup Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Campus Library, Dorm Room, Student Center"
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white border-teal-600 disabled:bg-teal-800 disabled:text-gray-300"
            >
              {loading ? "Creating..." : "Create Listing"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
