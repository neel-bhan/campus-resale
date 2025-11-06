import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "@/utils/api";
import type { CreatePostRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X } from "lucide-react";

interface CreatePostProps {
  user: any;
}

export function CreatePost({  }: CreatePostProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    description: "",
    price: 0,
    category: "",
    contactMethod: "email",
    course: "",
    event: "",
    location: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setSelectedImages((prev) => [...prev, ...files]);
    setError("");
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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

      // Create the post with images
      const response = await createPost(
        formData,
        selectedImages.length > 0 ? selectedImages : undefined
      );

      if (response.data && response.data.post) {
        console.log(
          "Post created successfully with images:",
          response.data.post
        );

        // Navigate back to dashboard
        navigate("/dashboard");
      } else {
        setError(response.error || response.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="mr-4 border-gray-600 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Listing</h1>
            <p className="text-gray-400">
              List an item for sale on the marketplace
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
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
                placeholder="e.g., MacBook Pro 2021, Calculus Textbook, Football Tickets"
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
                rows={4}
                className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="">Select a category</option>
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

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course" className="text-white">
                  Course (for textbooks)
                </Label>
                <Input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="e.g., CS 106A, MATH 41"
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="event" className="text-white">
                  Event (for tickets)
                </Label>
                <Input
                  id="event"
                  name="event"
                  type="text"
                  value={formData.event}
                  onChange={handleInputChange}
                  placeholder="e.g., Stanford vs Cal Game"
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-white">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Campus Library, Dorm Room"
                className="mt-1 bg-gray-800 border-gray-600 text-white"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-white">Images (Optional - Max 5)</Label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-750"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 10MB each
                      </p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">
                      Selected images:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="w-full h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? "Creating..." : "Create Listing"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
