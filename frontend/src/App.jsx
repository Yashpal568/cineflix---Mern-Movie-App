import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import MovieDetail from "./pages/movieDetail/MovieDetail";
import AddMovie from "./pages/addMovie/AddMovie";
import EditMovie from "./pages/editMovie/EditMovie";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import ForgetPassword from "./pages/forget/ForgetPassword";
import NotFound from "./pages/NotFound";
import ManageUsers from "./pages/manageUser/ManageUser";
import AdminMovieEdit from "./pages/adminPanel/AdminMovieEdit";
import Profile from "./pages/profile/Profile";
import Stats from "./pages/stats/Stats";
import AdminProtectedRoute from "./components/protectedRoutes/AdminProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/*public / normal user*/ }
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/movie/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
       

        {/*Auth routes*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgetPassword />} /> 
        <Route path="*" element= {<NotFound />}/>

         {/* ADMIN ROUTES FULLY PROTECTED */}
         <Route path="/users" element={<AdminProtectedRoute><ManageUsers /></AdminProtectedRoute>} />
          <Route path="/add" element={<AdminProtectedRoute><AddMovie /></AdminProtectedRoute>}/>
          <Route path="/admin" element={<AdminProtectedRoute><AdminPanel /></AdminProtectedRoute>}/>
          <Route path="/edit/:id" element={<AdminProtectedRoute><EditMovie /></AdminProtectedRoute>}/>
         <Route path="/editmovies" element={<AdminProtectedRoute><AdminMovieEdit /></AdminProtectedRoute>} />
         <Route path="/stats" element={<AdminProtectedRoute><Stats /></AdminProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
