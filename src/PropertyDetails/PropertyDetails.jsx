import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`https://to-let-property-backend.onrender.com/api/properties/${id}`);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property details:', error);
      enqueueSnackbar('Failed to load property details', { variant: 'error' });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Property not found</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white flex items-center gap-2 hover:text-gray-300 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden">
              {property.photos && property.photos.length > 0 ? (
                <div>
                  <img
                    src={`https://to-let-property-backend.onrender.com${property.photos[selectedImage]}`}
                    alt={`Property ${selectedImage + 1}`}
                    className="w-full h-96 object-cover"
                  />
                  {property.photos.length > 1 && (
                    <div className="p-4 grid grid-cols-4 gap-2">
                      {property.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={`https://to-let-property-backend.onrender.com${photo}`}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-full h-20 object-cover cursor-pointer rounded ${
                            selectedImage === index ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedImage(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>

            {/* Property Type and Rent */}
            <div className="bg-white rounded-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {property.spaceType} in {property.locality}
              </h1>
              <p className="text-2xl font-bold text-blue-600 mb-4">₹{property.rent}/month</p>
              {property.maintenance > 0 && (
                <p className="text-gray-600">+ ₹{property.maintenance} maintenance</p>
              )}
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-64 w-full rounded-lg overflow-hidden mb-4">
                <MapContainer 
                  center={[property.latitude, property.longitude]} 
                  zoom={15} 
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[property.latitude, property.longitude]}>
                    <Popup>{property.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="text-gray-700">{property.address}</p>
              {property.landmark && (
                <p className="text-gray-600 text-sm mt-1">Near: {property.landmark}</p>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Owner Information */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Owner Information</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {property.firstName} {property.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span> {property.contact}
                </p>
                {property.altContact && (
                  <p className="text-gray-700">
                    <span className="font-medium">Alternate Contact:</span> {property.altContact}
                  </p>
                )}
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Contact Owner
              </button>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">BHK</p>
                  <p className="font-medium">{property.bhk || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Floor</p>
                  <p className="font-medium">{property.floor || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Area</p>
                  <p className="font-medium">{property.area ? `${property.area} sq.ft` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Furnishing</p>
                  <p className="font-medium">{property.furnishingType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Parking</p>
                  <p className="font-medium">{property.parking}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Washroom</p>
                  <p className="font-medium">{property.washroomType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Cooling</p>
                  <p className="font-medium">{property.cooling || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pets Allowed</p>
                  <p className="font-medium">{property.petsAllowed}</p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            {(property.preference || property.bachelors) && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                <div className="space-y-2">
                  {property.preference && (
                    <p className="text-gray-700">
                      <span className="font-medium">Tenant Preference:</span> {property.preference}
                    </p>
                  )}
                  {property.bachelors && (
                    <p className="text-gray-700">
                      <span className="font-medium">Bachelors Allowed:</span> {property.bachelors}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appliances */}
            {property.appliances && property.appliances.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Appliances</h2>
                <div className="grid grid-cols-2 gap-2">
                  {property.appliances.map((appliance, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{appliance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            {property.about && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About this Property</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.about}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;