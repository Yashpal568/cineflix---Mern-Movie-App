
# 🎬 Cineflix — MERN Movie App


![MERN](https://img.shields.io/badge/Stack-MERN-blueviolet)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Production-success)


<p align="start">
  <img src="https://skillicons.dev/icons?i=mongodb,express,react,nodejs&theme=dark" height="90" />
</p>


---

# 📚 Table of Contents
- [Description](#-description)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Screenshots](#-screenshots)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
- [Contribution](#-contribution)
- [License](#-license)
- [Author](#-author)

---

## 📝 Description  
Cineflix is a fully responsive **MERN Stack Movie Web App** where users can browse movies, view details, manage profiles, and admins can control the entire platform through an advanced dashboard.  
It includes authentication, CRUD operations, analytics, and a beautifully designed dark UI.

---

## 🌍 View Live Demo

🔹 Frontend (Vercel)

https://cineflix-mern-movie-app.vercel.app/

🔹 Backend (Render)

https://cineflix-mern-movie-app.onrender.com/

---

## 🚀 Features  
- 🔐 **JWT Authentication** (Login, Signup, Forgot Password)  
- 👤 **User Profile Management**  
- 🎞️ **Browse Movies & View Details**  
- ➕ **Admin: Add / Edit / Delete Movies**  
- 👥 **Admin: Manage Users**  
- 📊 **Admin: Movie Stats & Charts (Recharts)**  
- 🧩 **Role-Based Routes (User/Admin)**  
- 📱 **Fully Responsive UI**  
- ⚡ Fast loading (React + Vite)

---

## 🛠️ Tech Stack

### **Frontend**
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Recharts

### **Backend**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Nodemailer
- Helmet, CORS, Rate Limiting, Sanitization

---

## 📁 Folder Structure:
```
/cineflix
│
│── README.md
│
├── backend
│ ├── Controllers
│ │ ├── authController.js
│ │ ├── userController.js
│ │ └── movieController.js
│ │
│ ├── Models
│ │ ├── userModel.js
│ │ └── movieModel.js
│ │
│ ├── Routes
│ │ ├── authRouter.js
│ │ ├── userRoute.js
│ │ └── moviesRoutes.js
│ │
│ ├── Utils
│ │ ├── CustomError.js
│ │ ├── asyncErrorHandler.js
│ │ └── email.js
│ │
│ ├── app.js
│ └── server.js
│
└── frontend
├── public
├── src
│ ├── api
│ │ └── axios.js
│ ├── components
│ │ └── sidebar
│ │ └── Sidebar.jsx
│ ├── pages
│ │ ├── Home.jsx
│ │ ├── MovieDetails.jsx
│ │ ├── AddMovie.jsx
│ │ ├── EditMovie.jsx
│ │ ├── Profile.jsx
│ │ ├── Login.jsx
│ │ ├── Signup.jsx
│ │ ├── AdminDashboard.jsx
│ │ ├── AdminMovieEdit.jsx
│ │ └── Stats.jsx
│ ├── App.jsx
│ └── main.jsx
│
├── package.json
└── vite.config.js
```

---
# 🖼️ Screenshots
### 🏠 Home Page  
<img width="1918" height="975" alt="Screenshot 2025-11-21 184854" src="https://github.com/user-attachments/assets/c3fc3bfb-8c80-4db0-a966-9a33de5d49e7" />

### 🎬 Movie Details 
<img width="1917" height="969" alt="Screenshot 2025-11-21 184933" src="https://github.com/user-attachments/assets/0598aec3-da63-463e-be93-2278ffdba900" />

### ➕ Add Movie  

<img width="1920" height="1080" alt="Screenshot 2025-11-21 185433" src="https://github.com/user-attachments/assets/d8a51087-2d43-431f-ab74-866f6cc4f821" />

### ✏️ Edit Movie 
<img width="1920" height="1080" alt="Screenshot 2025-11-21 185232" src="https://github.com/user-attachments/assets/2e3d610e-e637-4d75-be7f-262f98684bfe" />

### 🔐 Login Page 
<img width="1919" height="977" alt="Screenshot 2025-11-21 185010" src="https://github.com/user-attachments/assets/5bf99b2b-7ac3-49d7-81f4-a91dbee0c9a5" />

### 📝 Signup Page 
<img width="1918" height="974" alt="Screenshot 2025-11-21 185025" src="https://github.com/user-attachments/assets/eec70eac-7c2d-4c08-90de-75395030b224" />

### 👤 Profile Page 
<img width="1919" height="975" alt="Screenshot 2025-11-21 185120" src="https://github.com/user-attachments/assets/7180abf1-cd19-430b-b94e-82365a61f4e2" />
<img width="1920" height="1080" alt="Screenshot 2025-11-21 185135" src="https://github.com/user-attachments/assets/a70f81e1-d6da-44cb-a758-d59789424a27" />
<img width="1919" height="968" alt="Screenshot 2025-11-21 185209" src="https://github.com/user-attachments/assets/d9ef81d3-32ce-4e01-9976-700863d828df" />

### 📊 Admin Dashboard  
<img width="1920" height="1080" alt="Screenshot 2025-11-21 185248" src="https://github.com/user-attachments/assets/b92274b8-a480-4df5-b887-7aff1aa1a276" />

### 🛠️ Admin Movie Edit Page  

<img width="1920" height="1080" alt="Screenshot 2025-11-21 185310" src="https://github.com/user-attachments/assets/88c19841-6d34-4a8d-94fd-11b76190ce80" />

### 📈 Stats & Charts  

<img width="1920" height="1080" alt="Screenshot 2025-11-21 185342" src="https://github.com/user-attachments/assets/f1318d80-3491-48a5-9904-9fea3f3a11d2" />

---

---

# 📡 API Endpoints

## **Auth Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/forgotPassword` | Send reset email |
| PATCH | `/api/v1/auth/updatePassword` | Change password |

---

## **Movie Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/movies` | Get all movies |
| GET | `/api/v1/movies/:id` | Get movie details |
| POST | `/api/v1/movies` | Add movie (admin) |
| PATCH | `/api/v1/movies/:id` | Edit movie (admin) |
| DELETE | `/api/v1/movies/:id` | Delete movie (admin) |

---


# 🔧 Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Yashpal568/cineflix---Mern-Movie-App
```

---

### 2️⃣ Backend Setup
```sh
cd backend
npm install
```

---

### Create a .env file (example):
```ini
PORT=3000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email
EMAIL_PASS=your_password
FRONTEND_URL=https://cineflix-mern-movie-app.vercel.app
```

---

### Start backend:
```sh
npm start
```

---

### 3️⃣ Frontend Setup
```sh
cd ../frontend
npm install
```

---

### If using environment variable:
```ini
VITE_API_BASE_URL=https://cineflix-mern-movie-app.onrender.com/api/v1
```

---

### Start frontend:
```
npm run dev
```

---


# 🚀 Deployment Guide

## **🔥Backend (Render)**

- Create new Web Service

- Connect GitHub repo

- Root directory = /backend

- Build command: npm install

- Start command: node server.js

- Add environment variables

- Deploy

## **⚡Frontend (Vercel)**

- Import repo

- Select frontend folder

- Framework: Vite

- Build: npm run build

- Output: dist

- Add environment variable:
```sh
VITE_API_BASE_URL=https://cineflix-mern-movie-app.onrender.com/api/v1
```
- Deploy

---

### 🤝 Contribution
Contributions, issues, and pull requests are welcome!

---

### ⭐ Support

If you like this project, please ⭐ star the repo — it motivates further improvements!

---

### 📜 License

This project is open-source and available under the MIT License.

---

## **👨‍💻 Author**

**Yashpal** – [GitHub Profile](https://github.com/Yashpal568)
