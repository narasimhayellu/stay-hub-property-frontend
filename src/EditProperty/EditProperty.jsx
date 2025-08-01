import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AuthContext } from "../Auth/AuthContext";

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [mapPosition, setMapPosition] = useState([26.8500, 80.9500]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [photosToDelete, setPhotosToDelete] = useState([]);
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    altContact: "",
    locality: "",
    address: "",
    latitude: 26.8500,
    longitude: 80.9500,
    spaceType: "",
    petsAllowed: "No",
    preference: "",
    bachelors: "",
    furnishingType: "",
    bhk: "",
    floor: "",
    landmark: "",
    washroomType: "",
    cooling: "",
    parking: "No",
    rent: "",
    maintenance: "",
    area: "",
    appliances: [],
    amenities: [],
    about: ""
  });

  // Check if user is logged in
  useEffect(() => {
    if (!isLogin) {
      enqueueSnackbar("Please login to edit properties", { variant: "error" });
      navigate("/login");
    } else {
      fetchPropertyDetails();
    }
  }, [isLogin, navigate, id]);

  const fetchPropertyDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`https://to-let-property-backend.onrender.com/api/properties/${id}`, {
        headers: {
          'Authorization': token
        }
      });
      
      const property = response.data;
      
      // Update form with existing data
      setForm({
        firstName: property.firstName || "",
        lastName: property.lastName || "",
        contact: property.contact || "",
        altContact: property.altContact || "",
        locality: property.locality || "",
        address: property.address || "",
        latitude: property.latitude || 26.8500,
        longitude: property.longitude || 80.9500,
        spaceType: property.spaceType || "",
        petsAllowed: property.petsAllowed || "No",
        preference: property.preference || "",
        bachelors: property.bachelors || "",
        furnishingType: property.furnishingType || "",
        bhk: property.bhk || "",
        floor: property.floor || "",
        landmark: property.landmark || "",
        washroomType: property.washroomType || "",
        cooling: property.cooling || "",
        parking: property.parking || "No",
        rent: property.rent || "",
        maintenance: property.maintenance || "",
        area: property.area || "",
        appliances: property.appliances || [],
        amenities: property.amenities || [],
        about: property.about || ""
      });
      
      setMapPosition([property.latitude || 26.8500, property.longitude || 80.9500]);
      setExistingPhotos(property.photos || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      enqueueSnackbar("Failed to load property details", { variant: "error" });
      setLoading(false);
    }
  };

  // Update form when map position changes
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      latitude: mapPosition[0],
      longitude: mapPosition[1]
    }));
  }, [mapPosition]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  const handleNewPhotos = (e) => {
    const files = Array.from(e.target.files);
    
    // Check total photo count
    const totalPhotos = existingPhotos.length - photosToDelete.length + newPhotos.length + files.length;
    if (totalPhotos > 10) {
      enqueueSnackbar(`Maximum 10 images allowed. You can add ${10 - (existingPhotos.length - photosToDelete.length + newPhotos.length)} more.`, { variant: "warning" });
      return;
    }
    
    setNewPhotos(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExistingPhoto = (photoUrl) => {
    setPhotosToDelete(prev => 
      prev.includes(photoUrl) 
        ? prev.filter(p => p !== photoUrl)
        : [...prev, photoUrl]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.firstName || !form.lastName || !form.contact || !form.locality || 
        !form.address || !form.spaceType || !form.rent) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }

    const data = new FormData();
    
    // Add form fields
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach((item) => data.append(key, item));
        }
      } else {
        data.append(key, value);
      }
    });
    
    // Add existing photos that are not marked for deletion
    const remainingPhotos = existingPhotos.filter(photo => !photosToDelete.includes(photo));
    remainingPhotos.forEach(photo => {
      data.append('existingPhotos', photo);
    });
    
    // Add new photos
    if (newPhotos.length > 0) {
      newPhotos.forEach((photo) => {
        data.append("photos", photo);
      });
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`https://to-let-property-backend.onrender.com/api/properties/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      });
      enqueueSnackbar("Property updated successfully!", { variant: "success" });
      navigate(`/property/${id}`);
    } catch (err) {
      console.error('Error updating property:', err);
      if (err.response?.status === 401) {
        enqueueSnackbar("Please login to update properties", { variant: "error" });
        navigate("/login");
      } else if (err.response?.status === 403) {
        enqueueSnackbar("You are not authorized to edit this property", { variant: "error" });
      } else {
        enqueueSnackbar(err.response?.data?.message || "Failed to update property", { variant: "error" });
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-gray-800 text-xl">Loading property details...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Edit Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Owner Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Owner Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name *" value={form.firstName} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <input type="text" name="lastName" placeholder="Last Name *" value={form.lastName} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <input type="tel" name="contact" placeholder="Contact Number *" value={form.contact} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <input type="tel" name="altContact" placeholder="Alternate Contact Number" value={form.altContact} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Location Details</h3>
            <input type="text" name="locality" placeholder="Locality *" value={form.locality} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <textarea name="address" placeholder="Full Address *" value={form.address} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" required></textarea>
          </div>

          {/* Map for location selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">
              Select Property Location
            </h3>
            <p className="text-sm text-gray-600 mb-2 text-center">Click on the map to update the location</p>
            <div className="h-96 w-full border-2 border-gray-300 rounded-lg overflow-hidden">
              <MapContainer 
                center={mapPosition} 
                zoom={13} 
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={mapPosition} setPosition={setMapPosition} />
              </MapContainer>
            </div>
            <div className="flex gap-4 text-sm mt-2 text-gray-600">
              <span>Latitude: {mapPosition[0].toFixed(6)}</span>
              <span>Longitude: {mapPosition[1].toFixed(6)}</span>
            </div>
          </div>

          {/* Property Type & Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Property Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <select name="spaceType" value={form.spaceType} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Space Type *</option>
                <option value="Flat">Flat</option>
                <option value="House">House</option>
                <option value="PG">PG</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
              </select>
              <input type="text" name="preference" placeholder="Preference (e.g., Family, Working Professionals)" value={form.preference} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        
              <select name="petsAllowed" value={form.petsAllowed} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="No">Pets Allowed - No</option>
                <option value="Yes">Pets Allowed - Yes</option>
              </select>
              
              <select name="bachelors" value={form.bachelors} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Bachelors Allowed</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Both">Both</option>
              </select>
              
              <select name="furnishingType" value={form.furnishingType} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Furnishing Type</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully-Furnished">Fully-Furnished</option>
              </select>
              
              <input type="text" name="bhk" placeholder="BHK (e.g., 2BHK, 3BHK)" value={form.bhk} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="floor" placeholder="Floor Number" value={form.floor} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="landmark" placeholder="Nearby Landmark" value={form.landmark} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <select name="washroomType" value={form.washroomType} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Washroom Type</option>
                <option value="Attached">Attached</option>
                <option value="Common">Common</option>
              </select>
              
              <select name="cooling" value={form.cooling} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Cooling System</option>
                <option value="AC">AC</option>
                <option value="Cooler">Cooler</option>
                <option value="Fan">Fan</option>
                <option value="None">None</option>
              </select>
              
              <select name="parking" value={form.parking} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="No">Parking - No</option>
                <option value="Yes">Parking - Yes</option>
              </select>
            </div>
          </div>
        
          {/* Financial Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Financial Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <input type="number" name="rent" placeholder="Monthly Rent (₹) *" value={form.rent} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <input type="number" name="maintenance" placeholder="Maintenance Charges (₹)" value={form.maintenance} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" name="area" placeholder="Area (sq.ft)" value={form.area} onChange={handleChange} className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Gym', 'Swimming Pool', 'Park', 'Security', 'Lift', 'Power Backup', 'Water Supply', 'Club House'].map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={() => handleMultiSelect('amenities', amenity)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Appliances */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Appliances</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['TV', 'Refrigerator', 'Washing Machine', 'Microwave', 'Water Heater', 'Air Conditioner', 'Kitchen Stove', 'WiFi'].map((appliance) => (
                <label key={appliance} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={form.appliances.includes(appliance)}
                    onChange={() => handleMultiSelect('appliances', appliance)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{appliance}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Photos & Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">Photos & Description</h3>
            <div className="space-y-4">
              {/* Existing Photos */}
              {existingPhotos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Photos</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingPhotos.map((photo, index) => (
                      <div key={index} className={`relative group ${photosToDelete.includes(photo) ? 'opacity-50' : ''}`}>
                        <img
                          src={`https://to-let-property-backend.onrender.com${photo}`}
                          alt={`Current ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => toggleDeleteExistingPhoto(photo)}
                          className={`absolute top-2 right-2 ${photosToDelete.includes(photo) ? 'bg-green-500' : 'bg-red-500'} text-white p-1 rounded-full transition-opacity duration-200 hover:opacity-100`}
                        >
                          {photosToDelete.includes(photo) ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                        {photosToDelete.includes(photo) && (
                          <p className="text-xs text-red-600 mt-1 text-center">Will be deleted</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Photos */}
              <div>
                <input
                  type="file"
                  name="photos"
                  multiple
                  onChange={handleNewPhotos}
                  accept="image/*"
                  className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Total photos: {existingPhotos.length - photosToDelete.length + newPhotos.length}/10
                </p>
                
                {/* New Photo Previews */}
                {newPhotos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">New Photos to Add ({newPhotos.length})</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`New ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewPhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{photo.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <textarea
                  name="about"
                  placeholder="Describe the property, nearby facilities, and any special features..."
                  value={form.about}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition duration-200 shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg"
            >
              Update Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;