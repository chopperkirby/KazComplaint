import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ComplaintProvider } from "./contexts/ComplaintContext";
import Home from "./pages/Home";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintList from "./pages/ComplaintList";
import ComplaintDetail from "./pages/ComplaintDetail";
import CitizenDashboard from "./pages/CitizenDashboard";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import MapPage from "./pages/MapPage";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected route component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/submit" component={SubmitComplaint} />
        <Route path="/complaints" component={ComplaintList} />
        <Route path="/complaint/:id" component={ComplaintDetail} />
        <Route path="/dashboard/citizen" component={CitizenDashboard} />
        <Route path="/dashboard/government" component={GovernmentDashboard} />
        <Route path="/map" component={MapPage} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <ComplaintProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ComplaintProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
