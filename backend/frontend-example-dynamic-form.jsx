// Dynamic Form Fields Example for Campus Resale
// This shows how to conditionally render form fields based on category

import React, { useState } from 'react';

const CreatePostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    contactMethod: 'email',
    course: '',
    event: '',
    location: ''
  });

  // Define which fields are relevant for each category
  const getRelevantFields = (category) => {
    switch(category) {
      case 'Textbooks':
        return ['course', 'location'];
      case 'Sports Tickets':
        return ['event', 'location'];
      case 'Electronics':
      case 'Furniture':
      case 'Clothing':
      case 'Other':
        return ['location'];
      default:
        return [];
    }
  };

  const categories = ['Textbooks', 'Electronics', 'Sports Tickets', 'Furniture', 'Clothing', 'Other'];
  const relevantFields = getRelevantFields(formData.category);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only include relevant fields in the API request
    const submitData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      contactMethod: formData.contactMethod
    };

    // Add optional fields only if they're relevant and filled
    if (relevantFields.includes('course') && formData.course) {
      submitData.course = formData.course;
    }
    if (relevantFields.includes('event') && formData.event) {
      submitData.event = formData.event;
    }
    if (relevantFields.includes('location') && formData.location) {
      submitData.location = formData.location;
    }

    try {
      // Call your API here
      console.log('Submitting:', submitData);
      // const response = await createPost(submitData);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Required Fields */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="e.g., MacBook Pro 2021"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Describe your item..."
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium">
          Price *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
          step="0.01"
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contactMethod" className="block text-sm font-medium">
          Contact Method
        </label>
        <select
          id="contactMethod"
          name="contactMethod"
          value={formData.contactMethod}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </div>

      {/* Dynamic Fields Based on Category */}
      {relevantFields.includes('course') && (
        <div>
          <label htmlFor="course" className="block text-sm font-medium">
            Course
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., CS 106A, MATH 41"
          />
        </div>
      )}

      {relevantFields.includes('event') && (
        <div>
          <label htmlFor="event" className="block text-sm font-medium">
            Event
          </label>
          <input
            type="text"
            id="event"
            name="event"
            value={formData.event}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Stanford vs Cal, Warriors vs Lakers"
          />
        </div>
      )}

      {relevantFields.includes('location') && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Pickup Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder={
              formData.category === 'Textbooks' ? 'e.g., Main Library, Dorm Room' :
              formData.category === 'Sports Tickets' ? 'e.g., Section 20 Row 15, Will Transfer Digitally' :
              'e.g., Campus Center, Engineering Quad'
            }
          />
        </div>
      )}

      {/* Show helper text based on category */}
      {formData.category && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            📝 Tips for {formData.category}:
          </h4>
          <p className="text-sm text-blue-700">
            {formData.category === 'Textbooks' && 
              "Include the course name to help students find books for their classes. Mention condition and any included materials."}
            {formData.category === 'Sports Tickets' && 
              "Specify the event name, date, and seating details. Mention if tickets are digital or physical."}
            {formData.category === 'Electronics' && 
              "Include model numbers, condition, and what's included (chargers, cases, etc.)."}
            {formData.category === 'Furniture' && 
              "Mention dimensions, condition, and if pickup assistance is available."}
            {formData.category === 'Clothing' && 
              "Include size, brand, condition, and care instructions."}
            {formData.category === 'Other' && 
              "Be as descriptive as possible about the item's condition and intended use."}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Post
      </button>
    </form>
  );
};

export default CreatePostForm;
