import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client";
import { useAppStore } from "./store/store";
import { GET_USER_INFO_ROUTE } from "./utils/constant";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Collect from "./pages/Collect"; // Ensure the case matches the file name
import Reward from "./pages/Reward";
import Report from "./pages/Report";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import LeaderBoard from "./pages/LeaderBoards";
import Settings from "./pages/Settings";
import { Loader } from "lucide-react";
import Footer from "./components/Footer"; // Import Footer component

// Private Route Wrapper
const PrivateRoutes = ({ children }) => {
  const { userInfo } = useAppStore();

  if (userInfo === undefined || userInfo === null) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center">
          <Loader className=" animate-spin h-10 w-10 " />
        </div>
      </>
    );
  }

  return userInfo.user ? children : <Navigate to="/auth" />;
};

// Auth Route Wrapper
const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  if (userInfo === undefined || userInfo === null) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center">
          <Loader className=" animate-spin h-10 w-10 " />
        </div>
      </>
    );
  }

  return userInfo.user ? <Navigate to="/" /> : children;
};

// Layout Component for Pages with Header, Sidebar & Footer
const HeaderSidebarFooterLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="box-border w-screen flex-1 p-2 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <HeaderSidebarFooterLayout>
        <Home />
      </HeaderSidebarFooterLayout>
    ),
  },
  {
    path: "/collect",
    element: (
      <PrivateRoutes>
        <HeaderSidebarFooterLayout>
          <Collect />
        </HeaderSidebarFooterLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: "/report",
    element: (
      <PrivateRoutes>
        <HeaderSidebarFooterLayout>
          <Report />
        </HeaderSidebarFooterLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: "/rewards",
    element: (
      <PrivateRoutes>
        <HeaderSidebarFooterLayout>
          <Reward />
        </HeaderSidebarFooterLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <PrivateRoutes>
        <HeaderSidebarFooterLayout>
          <LeaderBoard />
        </HeaderSidebarFooterLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: "/settings",
    element: (
      <PrivateRoutes>
        <HeaderSidebarFooterLayout>
          <Settings />
        </HeaderSidebarFooterLayout>
      </PrivateRoutes>
    ),
  },
  {
    path: "/auth",
    element: (
      <AuthRoutes>
        <Auth />
      </AuthRoutes>
    ),
  },
  {
    path: "/*",
    element: <Navigate to="/auth" />, // Redirect to auth page for any other route
  },
]);

// Main App Component
function App() {
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(GET_USER_INFO_ROUTE, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data) {
          setUserInfo(res.data);
        }
      } catch (err) {
        console.error(err);
        setUserInfo({});
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
