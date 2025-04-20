import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditService() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceIdParam = searchParams.get("id");
  // Don't parse as integer, keep it as string
  const serviceId = serviceIdParam || null;
  const isAddMode = !serviceId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    category: '',
    image: ''
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [serviceNotFound, setServiceNotFound] = useState(false);

  useEffect(() => {
    // Only try to load service if we're in edit mode
    if (!isAddMode) {
      loadServiceData();
    } else {
      // We're in Add mode, so no need to load anything
      setIsLoading(false);
    }
  }, []);

  const loadServiceData = () => {
    try {
      const services = JSON.parse(localStorage.getItem("services")) || [];
      // Compare using string values to handle both numeric and string IDs
      const service = services.find(s => String(s.id) === String(serviceId));

      if (service) {
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
        setServiceNotFound(true);
      }
    } catch (error) {
      console.error("Error loading service data:", error);
      setServiceNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

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
      setPreviewImage('');
      setFormData(prev => ({
        ...prev,
        image: ''
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

  // Function to generate the next room ID
  const generateNextRoomId = () => {
    try {
      const services = JSON.parse(localStorage.getItem("services")) || [];

      // Extract existing room numbers
      const roomNumbers = services
        .map(s => {
          // Match room IDs in the format "roomX" where X is a number
          const match = String(s.id).match(/^room(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => !isNaN(num));

      // Find the highest room number or start at 3 if none exist
      const highestNumber = roomNumbers.length > 0
        ? Math.max(...roomNumbers)
        : 3; // Start with room4 if no rooms exist

      // Return the next room ID
      return `room${highestNumber + 1}`;
    } catch (error) {
      console.error("Error generating room ID:", error);
      return `room${Date.now()}`; // Fallback to timestamp if something goes wrong
    }
  };

  const saveService = (e) => {
    e.preventDefault();

    try {
      const services = JSON.parse(localStorage.getItem("services")) || [];

      if (isAddMode) {
        // Creating a new service with the room ID format
        const newId = serviceIdParam || generateNextRoomId();
        const newService = {
          id: newId,
          name: formData.name,
          description: formData.description,
          cost: formData.cost,
          category: formData.category,
          image: previewImage || formData.image
        };

        services.push(newService);
        localStorage.setItem("services", JSON.stringify(services));
        toast.success("Service created successfully!");
      } else {
        // Updating existing service
        const index = services.findIndex(s => String(s.id) === String(serviceId));

        if (index !== -1) {
          services[index] = {
            ...services[index],
            name: formData.name,
            description: formData.description,
            cost: formData.cost,
            category: formData.category,
            image: previewImage || formData.image
          };

          localStorage.setItem("services", JSON.stringify(services));
          toast.success("Service updated successfully!");
        } else {
          toast.error("Service not found. Unable to update.");
        }
      }

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error saving service:", error);
      toast.warn("An error occurred while saving the service.");
    }
  };

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  if (isLoading) {
    return (
      <div className="bg-emerald-50 min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-800">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAddMode && serviceNotFound) {
    return (
      <div className="bg-emerald-50 min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-800">Service Not Found</h2>
          <p className="mb-6 text-gray-700">The service you are trying to edit could not be found.</p>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen flex flex-col py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-emerald-800 py-4 px-6 relative">
          {/* Back button positioned at the left side of header */}
          <button 
            onClick={handleBack}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 flex items-center text-white hover:text-emerald-200 font-medium transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
            {isAddMode ? "Add New Service" : "Edit Service Details"}
          </h2>
        </div>
        
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          <form onSubmit={saveService} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name:
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Service Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  value={formData.name}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description:
              </label>
              <textarea
                id="description"
                placeholder="Description"
                required
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                  Cost:
                </label>
                <input
                  type="number"
                  id="cost"
                  placeholder="Cost"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  value={formData.cost}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL:
                </label>
                <input
                  type="url"
                  id="image"
                  placeholder="Paste image URL"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  value={formData.image && formData.image.startsWith('http') ? formData.image : ''}
                  onChange={handleImageUrlChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="img-upload" className="block text-sm font-medium text-gray-700 mb-1">
                Or Upload New Image:
              </label>
              <input
                type="file"
                id="img-upload"
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                onChange={handleImageUpload}
              />
            </div>

            <div className="mt-6">
              {previewImage ? (
                <div className="relative">
                  <img
                    id="preview-img"
                    src={previewImage}
                    alt="Service Image Preview"
                    className="h-64 w-full mx-auto rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No image preview available</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                {isAddMode ? "Add Service" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

<ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </div>
  );
}
