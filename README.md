# Ecom

A comprehensive e-commerce platform designed to facilitate seamless online shopping experience.

## Features

- **Product Catalog**: Browse and search through a wide range of products.
- **User Authentication**: Secure user registration and login functionalities.
- **Shopping Cart**: Add, remove, and manage products in the cart.
- **Order Management**: Track order statuses and history.
- **Responsive Design**: Optimized for various devices and screen sizes.

## Tech Stack

- **Frontend**:
  - [React](https://reactjs.org/): A JavaScript library for building user interfaces.
  - [Redux toolKit](https://redux-toolkit.js.org/): The official, opinionated, batteries-included toolset for efficient Redux development
  - [React-hook-form](https://www.react-hook-form.com/): Performant, flexible and extensible forms with easy-to-use validation.
  - [Shadcn UI](https://ui.shadcn.com/): Beautifully designed components that you can copy and paste into your apps.
  - [Zod](https://zod.dev/): TypeScript-first schema validation with static type inference
  - [Tailwind](https://tailwindcss.com/): A utility-first CSS framework

- **Backend**:
  - [Node.js](https://nodejs.org/): JavaScript runtime built on Chrome's V8 engine.
  - [Fastify](https://fastify.dev/): Fast and low overhead web framework, for Node.js
  - [MongoDB](https://www.mongodb.com/): NoSQL database for storing application data.
  - [Typegoose](https://typegoose.github.io/typegoose/): Define Mongoose models using TypeScript classes

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (ensure it's running on your local machine or provide a connection string)
- [Docker](https://www.docker.com/) (if you prefer containerized deployment)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/SushiJ/ecom.git
   cd ecom
   ```

2. **Install Dependencies**:

   Navigate to both the `web` and `sv` directories and install the necessary packages:

   ```bash
   cd web
   pnpm install
   cd sv
   pnpm install
   ```

3. **Environment Variables**:

   Create a `.env` file in the `sv` directory and configure the following variables:

   ```env
   PAYPAL_CLIENT_ID =
   PAYPAL_CLIENT_SECRET =
   ```

4. **Start the Application**:

   - **Backend**:

     ```bash
     cd sv
     npm dev
     ```

   - **Frontend**:

     ```bash
     cd web
     pnpm dev
     ```

   Access the application at `http://localhost:5173`.

## Screenshots

- Login & Register: 
![Login](/images/sign_in.png)
![Register](/images/register.png)

- Home Page: 
![Home](/images/Home.png)
![Home](/images/home-2.png)

- Product Listing:
  ![Product](/images/Product.png)
  
- Shopping Cart | shipping | Place order | payment:
  ![Cart](/images/Cart.png)
  ![Shipping](/images/Shipping.png)
  ![Place_order](/images/Place_order.png)
  ![Payment](/images/payment.png)

## Docker (Server and database)

For containerized deployment, ensure Docker is installed and running on your system.

1. **Build and Run Containers**:

   ```bash
   docker-compose up --build
   ```
   This command will build and start backend services.

2. **Access the Application**:

   The application will be available at `http://localhost:5173`.
