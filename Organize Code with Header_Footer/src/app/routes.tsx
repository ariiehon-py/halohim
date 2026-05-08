import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import InfoPage from "./pages/InfoPage";
import JarasInfo from "./pages/JarasInfo";
import JarasIdentity from "./pages/JarasIdentity";
import JarasForm from "./pages/JarasForm";
import KastratInfo from "./pages/KastratInfo";
import KastratIdentity from "./pages/KastratIdentity";
import KastratForm from "./pages/KastratForm";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SubmissionDetail from "./pages/admin/SubmissionDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "info", Component: InfoPage },
      { path: "jaras", Component: JarasInfo },
      { path: "jaras/identity", Component: JarasIdentity },
      { path: "jaras/form", Component: JarasForm },
      { path: "kastrat", Component: KastratInfo },
      { path: "kastrat/identity", Component: KastratIdentity },
      { path: "kastrat/form", Component: KastratForm },
      { path: "admin/login", Component: AdminLogin },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "admin/submission/:type/:id", Component: SubmissionDetail },
    ],
  },
]);
