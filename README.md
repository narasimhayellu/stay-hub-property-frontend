# To-Let Globe Property Management System

A modern property rental management application built with React and Vite, featuring location-based property listings, user authentication, and comprehensive property management capabilities.

## 🏠 Features

- **User Authentication**: Secure login/register system with JWT tokens
- **Property Listings**: Browse available properties with detailed information
- **Interactive Maps**: View property locations using React-Leaflet
- **Property Management**: Add, edit, and delete your properties
- **Image Upload**: Support for multiple property images
- **Advanced Search**: Sort properties by date, price, and popularity
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Dynamic property status updates

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/narasimhayellu/to-let-property-frontend.git
cd to-let-property-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, CSS3
- **Maps**: React-Leaflet, Leaflet
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: Notistack
- **Icons**: Material-UI Icons

## 📁 Project Structure

```
src/
├── Add-new-property/    # Property creation component
├── Auth/               # Authentication context and logic
├── EditProperty/       # Property editing component
├── ForgotPass/        # Password recovery component
├── Login/             # User login component
├── Property/          # Property listing component
├── PropertyDetails/   # Detailed property view
├── Register/          # User registration component
├── assets/            # Static assets
└── main.jsx          # Application entry point
```

## 🔧 Configuration

### Backend API

The application connects to a backend API hosted at:
- Authentication: `https://to-let-authentication-backend.onrender.com`
- Property Management: `https://to-let-property-backend.onrender.com`

To use your own backend, update the API endpoints in the respective components.

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_backend_url
VITE_AUTH_API_URL=your_auth_backend_url
```

## 📱 Key Components

### Property Listing
- View all available properties on an interactive map
- Sort by date, price (low to high/high to low), and popularity
- Filter to show only your properties
- Click on property cards for detailed view

### Add Property
- Fill comprehensive property details
- Upload multiple property images (max 10)
- Select location on interactive map
- Add amenities and property features

### User Authentication
- Secure registration with email verification
- Password recovery via email
- JWT-based authentication
- Protected routes for authenticated users

## 🎨 UI Features

- Dark theme with gold accents
- Animated borders on authentication forms
- Loading states for better UX
- Responsive grid layouts
- Interactive map markers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Narasimha Reddy Yellu - [GitHub](https://github.com/narasimhayellu)

## 🙏 Acknowledgments

- To-Let Globe for the project inspiration
- React and Vite communities for excellent documentation
- OpenStreetMap for map data

## 📞 Support

For support, email your-email@example.com or raise an issue in the GitHub repository.

---

**Note**: This is the frontend repository. The backend repository needs to be set up separately for full functionality.