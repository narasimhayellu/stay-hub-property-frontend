import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import { AuthContext } from '../Auth/AuthContext';
import { enqueueSnackbar } from 'notistack';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const Property = ()=>{
    const navigate = useNavigate();
    const { isLogin } = useContext(AuthContext);
    const [properties, setProperties] = useState([]); 
    const [sortedProperties, setSortedProperties] = useState([]);
    const [userProperties, setUserProperties] = useState([]);
    
    // Fetch properties from API
    useEffect(() => {
      fetchProperties();
      if (isLogin) {
        fetchUserProperties();
      }
    }, [isLogin]);

    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://to-let-property-backend.onrender.com/api/properties');
        setProperties(response.data);
        setSortedProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    const fetchUserProperties = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://to-let-property-backend.onrender.com/api/properties/user/properties', {
          headers: {
            'Authorization': token
          }
        });
        const userPropertyIds = response.data.map(prop => prop._id);
        setUserProperties(userPropertyIds);
      } catch (error) {
        console.error('Error fetching user properties:', error);
      }
    };

    const handleDelete = async (propertyId) => {
      if (window.confirm('Are you sure you want to delete this property?')) {
        try {
          const token = localStorage.getItem('authToken');
          await axios.delete(`https://to-let-property-backend.onrender.com/api/properties/${propertyId}`, {
            headers: {
              'Authorization': token
            }
          });
          enqueueSnackbar('Property deleted successfully', { variant: 'success' });
          fetchProperties();
          fetchUserProperties();
        } catch (error) {
          console.error('Error deleting property:', error);
          enqueueSnackbar('Failed to delete property', { variant: 'error' });
        }
      }
    };
  
    const sortProperties = (criteria) => {
      const sorted = [...properties];
  
      switch (criteria) {
        case 'date':
          sorted.sort((a, b) => new Date(b.createdAt || b.dateUploaded) - new Date(a.createdAt || a.dateUploaded));
          break;
        case 'lowToHigh':
          sorted.sort((a, b) => (a.rent || 0) - (b.rent || 0));
          break;
        case 'highToLow':
          sorted.sort((a, b) => (b.rent || 0) - (a.rent || 0));
          break;
        case 'popularity':
          sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        default:
            return;
        }
        setSortedProperties(sorted);
    };

    // Display all sorted properties
    const displayProperties = sortedProperties;
    const position = [17.3850, 78.4867]; // Hyderabad

    return(
        <>
        <div className='bg-gray-100 min-h-screen'>
          {/* Filters and Sort */}
          <div className="p-4 flex flex-col md:flex-row justify-center items-center gap-4">
            <select
              onChange={(e) => sortProperties(e.target.value)}
              className="border p-2 rounded h-14 bg-white"
            >
              <option value="">Sort By</option>
              <option value="date">Date Uploaded (Newest First)</option>
              <option value="lowToHigh">Cost (Low to High)</option>
              <option value="highToLow">Cost (High to Low)</option>
              <option value="popularity">Popularity</option>
            </select>
            
          </div>

          {/* Map Section */}
          <div className='flex items-center justify-center pb-10'>
            <MapContainer center={position} zoom={10} style={{ height: '400px', width: '80%' }}>
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {displayProperties.map((property) => (
                property.latitude && property.longitude && (
                  <Marker key={property._id || property.id} position={[property.latitude, property.longitude]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{property.firstName} {property.lastName}</h3>
                        <p>{property.locality}</p>
                        <p>₹{property.rent}/month</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>

          {/* Property Cards Section */}
          <div className="px-4 pb-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Available Properties
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {displayProperties.map((property) => (
                <div 
                  key={property._id || property.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Property Image */}
                  {property.photos && property.photos.length > 0 ? (
                    <img 
                      src={`https://to-let-property-backend.onrender.com${property.photos[0]}`} 
                      alt={`${property.spaceType} in ${property.locality}`}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  
                  {/* Property Details */}
                  <div 
                    className="p-3 cursor-pointer" 
                    onClick={() => navigate(`/property/${property._id || property.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold">{property.spaceType} in {property.locality}</h3>
                      <span className="text-lg font-bold text-blue-600">₹{property.rent}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 truncate">{property.address}</p>
                    
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-700 mb-2">
                      <div>
                        <span className="font-medium">BHK:</span> {property.bhk}
                      </div>
                      <div>
                        <span className="font-medium">Floor:</span> {property.floor}
                      </div>
                      <div>
                        <span className="font-medium">Furnishing:</span> {property.furnishingType}
                      </div>
                      <div>
                        <span className="font-medium">Area:</span> {property.area} sq.ft
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <p className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">Owner:</span> {property.firstName} {property.lastName}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Contact:</span> {property.contact}
                      </p>
                    </div>
                    
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.slice(0, 2).map((amenity, index) => (
                            <span key={index} className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 2 && (
                            <span className="text-xs text-gray-500">+{property.amenities.length - 2}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Edit/Delete Buttons for property owner */}
                  {isLogin && userProperties.includes(property._id) && (
                    <div className="border-t p-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/property/${property._id}/edit`);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(property._id);
                        }}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
    )
}

export default Property;