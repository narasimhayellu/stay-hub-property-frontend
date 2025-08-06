import "../src/home.css"
import { useNavigate } from "react-router-dom";

const Home = ()=>{
    const navigate = useNavigate();
    
    return(
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                        Welcome to Stay Hub
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-indigo-600 mb-8">
                        Find your perfect stay — anytime, anywhere.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Whether you're looking for a short-term rental, a cozy homestay, or a fully furnished apartment, 
                        StayHub makes finding and listing accommodations effortless. We connect guests and hosts through 
                        a simple, secure, and user-friendly platform.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button 
                            onClick={() => navigate('/property-listing')}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Find a Stay
                        </button>
                        <button 
                            onClick={() => navigate('/add-new-property')}
                            className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                        >
                            List Your Property
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;