import React, { useEffect, useState } from "react";
import AnimatedGlobe from "@/components/AnimateGlobe";
import { useAppStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Leaf, Loader, MapPin, Recycle, Users } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { IMPACT_DATA_ROUTE } from "@/utils/constant";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ImpactCard({ title,isLoading , value, icon: Icon }) {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-US", { maximumFractionDigits: 1 })
      : value;

  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-10 w-10 text-green-500 mb-4" />
      <p className="text-3xl font-bold mb-2 text-gray-800">{isLoading ? <Loader className="animate-spin" /> :formattedValue}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <Icon className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0,
  });
  const [loading,setLoading] = useState(true);
  const {userInfo } = useAppStore();
  const navigate = useNavigate();


  useEffect(() => {
    if (userInfo) {
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
    async function fetchImpactData() {
      setLoading(true);
      try {
        const response = await apiClient.get(IMPACT_DATA_ROUTE,{withCredentials:true});
        setImpactData(response.data);

      } catch (error) {
        console.error("Error fetching impact data:", error);
      }finally {
        setLoading(false);
      }
    }

    fetchImpactData();
  }, [userInfo]);

  const login = () => {
    if (userInfo) {
      setLoggedIn(true);
    }else{
      navigate("/auth");
      setLoggedIn(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-16">
      <section className="text-center mb-20 px-4 sm:px-6 lg:px-8">
        <AnimatedGlobe />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 tracking-tight">
        WasteNest <span className="text-green-600">Garbage Management</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Join our community in making garbage management more efficient and
          rewarding!
        </p>
        {!loggedIn ? (
          <Button
            onClick={login}
            className="bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Link to="/report">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
              Report Waste
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mb-20 px-4 sm:px-6 lg:px-8">
        <FeatureCard
          icon={Leaf}
          title="Eco-Friendly"
          description="Contribute to a cleaner environment by reporting and collecting waste."
        />
        <FeatureCard
          icon={Coins}
          title="Earn Rewards"
          description="Get tokens for your contributions to waste management efforts."
        />
        <FeatureCard
          icon={Users}
          title="Community-Driven"
          description="Be part of a growing community committed to sustainable practices."
        />
      </section>

      <section className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-gray-800">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <ImpactCard
            title="Waste Collected"
            isLoading={loading}
            value={`${impactData.wasteCollected} kg`}
            icon={Recycle}
          />
          <ImpactCard
            title="Reports Submitted"
            isLoading={loading}
            value={impactData.reportsSubmitted.toString()}
            icon={MapPin}
          />
          <ImpactCard
            isLoading={loading}
            title="Tokens Earned"
            value={impactData.tokensEarned.toString()}
            icon={Coins}
          />
          <ImpactCard
            isLoading={loading}
            title="CO2 Offset"
            value={`${impactData.co2Offset} kg`}
            icon={Leaf}
          />
        </div>
      </section>
    </div>
  );
}
