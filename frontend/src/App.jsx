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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/*public / normal user*/ }
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/movie/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>}/>
        <Route path="/add" element={<ProtectedRoute><AddMovie /></ProtectedRoute>}/>
        <Route path="/edit/:id" element={<ProtectedRoute><EditMovie /></ProtectedRoute>}/>
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}/>
        

        {/*Auth routes*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgetPassword />} /> 
        <Route path="*" element= {<NotFound />}/>

         {/* ADMIN ROUTES with NESTED PAGES */}
         <Route path="/users" element={<ManageUsers />} />
         <Route path="/editmovies" element={<AdminMovieEdit />} />
         <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
         <Route path="/stats" element={<ProtectedRoute> <Stats /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
