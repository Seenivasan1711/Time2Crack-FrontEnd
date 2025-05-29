# AI-Assisted E-Commerce React.js Frontend

A scalable and production-ready React.js frontend boilerplate for an AI-assisted e-commerce platform. This platform supports user authentication, product search and listing, a shopping cart, order placement with delivery scheduling, and an AI assistant chatbot.

## Features

- **Authentication**: Login, register, and protected routes
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add, remove, and update quantities
- **Order Management**: Place orders and schedule deliveries
- **AI Assistant**: Chat with an AI shopping assistant

## Tech Stack

- **Framework**: React.js with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **API Handling**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/       # Reusable UI components
├── features/
│   ├── auth/         # Auth logic (LoginPage, register, authSlice)
│   ├── cart/         # Cart logic (cartSlice, CartPage)
│   ├── products/     # Product pages + API (ProductPage, ProductList)
│   ├── orders/       # Orders + Delivery (OrderPage, OrderAPI)
├── hooks/            # Custom hooks
├── services/         # API calls (axiosClient, productService, etc.)
├── store/            # Redux slices and root store
├── utils/            # Helper functions
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Deployment

This project is configured for easy deployment on Vercel.

## License

MIT