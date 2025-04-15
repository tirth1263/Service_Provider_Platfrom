// EditService.jsx fix
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function EditService() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceIdParam = searchParams.get("id");
  const serviceId = serviceIdParam ? parseInt(serviceIdParam, 10) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    category: '',
    image: ''
  });

  const [previewImage, setPreviewImage] = useState("");
  const [serviceNotFound, setServiceNotFound] = useState(false);

  useEffect(() => {
    const loadServiceData = () => {
      try {
        // Get services from localStorage
        const services = JSON.parse(localStorage.getItem("services")) || [];
        console.log("All services:", services);
        console.log("Looking for service with ID:", serviceId);

        // Find the service with the matching ID
        const service = services.find(s => s.id === serviceId);
        console.log("Found service:", service);

        if (service) {
          // Service found, update the form data
          setFormData({
            name: service.name || '',
            description: service.description || '',
            cost: service.cost || '',
            category: service.category || '',
            image: service.image || ''
          });

          if (service.image) {
            setPreviewImage(service.image);
          }

          setServiceNotFound(false);
        } else {
          // Service not found
          // console.error(`Service with ID ${serviceId} not found`);
          setServiceNotFound(true);
        }
      } catch (error) {
        console.error("Error loading service data:", error);
        setServiceNotFound(true);
      }
    };

    if (serviceId !== null) {
      loadServiceData();
    } else {
      setServiceNotFound(true);
    }
  }, [serviceId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value.trim();
    if (url) {
      setPreviewImage(url);
      setFormData(prev => ({
        ...prev,
        image: url
      }));
    } else {
      // If url is empty, set preview to null instead of empty string
      setPreviewImage(null);
      setFormData(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const result = e.target.result;
        setPreviewImage(result);
        setFormData(prev => ({
          ...prev,
          image: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateService = (e) => {
    e.preventDefault();

    try {
      const services = JSON.parse(localStorage.getItem("services")) || [];
      const index = services.findIndex(s => s.id === serviceId);

      if (index !== -1) {
        services[index] = {
          ...services[index],
          id: serviceId,
          name: formData.name,
          description: formData.description,
          cost: formData.cost,
          category: formData.category,
          image: previewImage || formData.image
        };

        localStorage.setItem("services", JSON.stringify(services));
        alert("Service updated successfully!");
        navigate("/admin-dashboard");
      } else {
        alert("Service not found. Unable to update.");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("An error occurred while updating the service.");
    }
  };

  if (serviceNotFound) {
    return (
      <div className="bg-gray-100 min-h-screen py-8 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Service Not Found</h2>
          <p className="mb-6">The service you are trying to edit could not be found.</p>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Edit Service Details</h2>

        <form onSubmit={updateService} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Service Name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <input
              type="text"
              id="description"
              placeholder="Description"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
              Cost:
            </label>
            <input
              type="number"
              id="cost"
              placeholder="Cost"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.cost}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category:
            </label>
            <input
              type="text"
              id="category"
              placeholder="Category"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="img-url" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL:
            </label>
            <input
              type="url"
              id="img-url"
              placeholder="Paste image URL"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.image && formData.image.startsWith('http') ? formData.image : ''}
              onChange={handleImageUrlChange}
            />
          </div>

          <div>
            <label htmlFor="img-upload" className="block text-sm font-medium text-gray-700 mb-1">
              Or Upload New Image:
            </label>
            <input
              type="file"
              id="img-upload"
              accept="image/*"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleImageUpload}
            />
          </div>

          <div className="mt-4">
            {previewImage ? (
              <img
                id="preview-img"
                src={previewImage}
                alt="Service Image Preview"
                className="max-h-64 max-w-full mx-auto rounded-lg object-cover"
              />
            ) : (
              <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">No image preview available</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}