# Jade Intimo

> **Status**: 🚧 Work in Progress - This project is under active development.

An e-commerce platform specializing in intimate apparel. The project consists of a robust backend API and a modern React-based frontend.

## 📋 Project Overview

Jade Intimo is a full-stack e-commerce application built to provide a seamless shopping experience for intimate apparel products. The platform includes user authentication, product catalog management, shopping cart functionality, order processing, and an admin dashboard.

**Key Features** (In Development):
- User authentication and authorization
- Product catalog with categories and variants
- Shopping cart management
- Order processing and checkout
- Admin dashboard for product and order management
- Gender-based product categorization
- Responsive design

---

## 🏗️ Architecture

```
jade-intimo/
├── backend/          # Node.js/Express REST API
└── frontend/         # React/TypeScript with Vite
```

---

# Backend

The backend serves as the core of the application, providing RESTful APIs for all frontend operations.

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL via Neon (serverless)
- **ORM**: Drizzle ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Development**: Nodemon, Docker

## 📁 Backend Structure

```
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── server.js              # Server initialization
│   │
│   ├── config/
│   │   ├── database.js        # Drizzle ORM setup
│   │   └── logger.js          # Winston logger configuration
│   │
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   └── products.controller.js
│   │
│   ├── models/                # Drizzle schema definitions
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── product-variant.model.js
│   │   ├── cart.model.js
│   │   ├── cart-items.model.js
│   │   ├── order.model.js
│   │   ├── order-items.model.js
│   │   └── adress.model.js
│   │
│   ├── routes/                # API endpoints
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   └── order.routes.js
│   │
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   ├── cart.service.js
│   │   ├── email.service.js
│   │   ├── order.service.js
│   │   └── products.service.js
│   │
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── admin.middleware.js
│   │
│   ├── utils/                 # Helper utilities
│   │   ├── cookies.js
│   │   ├── format.js
│   │   └── jwt.js
│   │
│   └── validations/           # Zod schemas
│       ├── auth.validation.js
│       ├── product.validation.js
│       └── order.validation.js
│
├── drizzle/                   # Database migrations
├── tests/                     # Test files
├── scripts/                   # Shell scripts
│   ├── dev.sh                 # Development Docker setup
│   └── prod.sh                # Production Docker setup
│
├── .env.development           # Development environment variables
├── docker-compose.dev.yml     # Development Docker compose
├── docker-compose.prod.yml    # Production Docker compose
└── package.json
```

## 🚀 Getting Started - Backend

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon serverless recommended)
- Docker (optional, for containerized development)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN=http://localhost:8080
   ```

4. **Set up the database:**
   ```bash
   # Generate migrations based on schema
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # (Optional) Open Drizzle Studio to manage data
   npm run db:studio
   ```

### Development

Start the development server with auto-reload:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

**Available API endpoints:**
- `GET /health` - Health check
- `GET /api` - API status
- `POST /api/auth/*` - Authentication routes
- `GET /api/products/*` - Product routes
- `GET/POST /api/cart/*` - Cart routes
- `POST /api/order/*` - Order routes

### Testing

Run the test suite:
```bash
npm test
```

### Linting & Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check format compliance
npm run format:check
```

### Docker Development

Build and run with Docker Compose:
```bash
npm run dev:docker
```

## 🗄️ Database Schema

The application uses Drizzle ORM with PostgreSQL. Schema is defined in `src/models/`:

**Key Tables:**
- `users` - User accounts with authentication
- `products` - Product catalog
- `product_variants` - Product sizes, colors, etc.
- `carts` - User shopping carts
- `cart_items` - Items in carts
- `orders` - Customer orders
- `order_items` - Items in orders
- `addresses` - Shipping/billing addresses

Migrations are stored in `drizzle/` directory.

## 🔐 Authentication & Security

- **JWT-based authentication** - Tokens stored in httpOnly cookies
- **Password hashing** - bcrypt with salt rounds
- **CORS protection** - Restricted to frontend origin
- **Helmet** - Security headers
- **Request validation** - Zod schemas on all endpoints
- **Admin middleware** - Role-based access control

## 📝 API Documentation

### Key Endpoints (Development)

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

#### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `DELETE /api/cart/items/:id` - Remove item from cart

#### Orders
- `POST /api/order` - Create order
- `GET /api/order/:id` - Get order details
- `GET /api/order` - List user orders

## 🐛 Development Notes

- Uses import alias paths (e.g., `#controllers/*`) for cleaner imports
- All environment variables are required for the app to start
- Database migrations must be run before starting the server
- Winston logger outputs to both console and files
- CORS is restricted to `http://localhost:8080` by default

## 📦 Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.2.1 | Web framework |
| drizzle-orm | 0.45.1 | ORM |
| pg | 8.16.3 | PostgreSQL client |
| bcrypt | 6.0.0 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT authentication |
| zod | 4.2.1 | Schema validation |
| helmet | 8.1.0 | Security headers |
| winston | 3.19.0 | Logging |
| cors | 2.8.5 | CORS middleware |

---

# Frontend

Modern React-based user interface built with TypeScript and Vite.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion
- **Notifications**: Sonner

## 📁 Frontend Structure

```
frontend/
├── src/
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── UserPage.tsx
│   │   ├── admin/          # Admin pages
│   │   └── ...
│   │
│   ├── components/         # Reusable components
│   │   ├── layout/         # Layout components
│   │   ├── products/       # Product components
│   │   ├── admin/          # Admin components
│   │   ├── home/           # Home page sections
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...
│   │
│   ├── context/            # React Context
│   │   └── GenderContext.tsx
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── use-authstore.ts
│   │   ├── use-cartstore.ts
│   │   ├── use-productstore.ts
│   │   └── ...
│   │
│   ├── lib/                # Utilities
│   │   └── utils.ts
│   │
│   ├── data/               # Static data
│   │   ├── navigation.ts
│   │   └── products.ts
│   │
│   ├── assets/             # Static assets
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Static files
├── vite.config.ts          # Vite configuration
└── package.json
```

## 🚀 Getting Started - Frontend

### Prerequisites

- Node.js 18+
- npm or Bun

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or as shown in the terminal)

### Building

```bash
# Production build
npm run build

# Development build
npm run build:dev
```

### Linting

```bash
npm run lint
```

### Preview Build

```bash
npm run preview
```

---

## 🔄 Full Stack Development

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Environment Configuration

**Backend (.env):**
- Set appropriate database URL
- Configure JWT secret
- Set CORS_ORIGIN to frontend URL

**Frontend:**
- Frontend connects to backend via axios
- Default backend URL: `http://localhost:5000`

---

## 📋 Project Status & TODO

### ✅ Completed
- Basic project structure
- Database schema with Drizzle
- Authentication system (JWT + bcrypt)
- Basic CRUD operations
- Express middleware setup
- React Router navigation
- UI component library integration

### 🚧 In Progress / TODO
- Admin dashboard features
- Order processing workflow
- Email notifications
- Payment integration
- Product image uploads
- Advanced search and filtering
- User reviews and ratings
- Inventory management
- Wishlist functionality
- Performance optimization

---

## 🐳 Docker

### Development with Docker

```bash
cd backend
npm run dev:docker
```

This uses `docker-compose.dev.yml` for a local development environment.

### Production with Docker

```bash
npm run prod:docker
```

This uses `docker-compose.prod.yml` for production deployment.

---

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React Documentation](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📄 License

ISC

---

## 👥 Contributing

This project is under active development. Contributions, bug reports, and feature requests are welcome.

---

**Last Updated**: February 2026  
**Project Status**: 🚧 In Development
