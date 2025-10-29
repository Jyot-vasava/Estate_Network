frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── images/
├── src/
│   ├── api/
│   │   ├── axiosConfig.js
│   │   ├── authApi.js
│   │   ├── propertyApi.js
│   │   ├── bookingApi.js
│   │   └── contactApi.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── property/
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyList.jsx
│   │   │   ├── PropertyFilter.jsx
│   │   │   ├── PropertyForm.jsx
│   │   │   └── PropertyDetails.jsx
│   │   ├── dashboard/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── StatCard.jsx
│   │   └── layout/
│   │       ├── MainLayout.jsx
│   │       ├── DashboardLayout.jsx
│   │       └── AuthLayout.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js
│   │   ├── properties/
│   │   │   └── propertySlice.js
│   │   ├── bookings/
│   │   │   └── bookingSlice.js
│   │   └── theme/
│   │       └── themeSlice.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useTheme.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Properties.jsx
│   │   ├── PropertyDetails.jsx
│   │   ├── CreateProperty.jsx
│   │   ├── EditProperty.jsx
│   │   ├── Contact.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── NotFound.jsx
│   │   └── Unauthorized.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── store/
│   │   └── store.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md