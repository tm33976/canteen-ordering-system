# Canteen Ordering System 🍽️

A full-stack web application for a canteen that allows customers to order online while intelligently managing limited inventory. The standout feature is an inventory-locking system that automatically cancels unconfirmed orders after 15 minutes to free up stock for other customers.



---

## 🧩 The Problem It Solves

In a busy canteen with popular but limited items, customers can be disappointed when an item they want is held in an abandoned online cart. This system solves that problem by reserving stock for only 15 minutes, ensuring that items are always available for serious buyers.

---

## ✨ Features

- **Live Stock Display:** The menu shows the real-time stock count for each item.
- **Smart Shopping Cart:** Add, update, and remove items from your cart. The "Add to Cart" button is automatically disabled for out-of-stock items.
- **Inventory Locking:** When an order is placed, the stock for the ordered items is immediately decremented and reserved.
- **Auto-Cancellation:** A background job runs on the server to automatically cancel any order that hasn't been picked up within 15 minutes, restoring the item stock.
- **Order Status & History:** After placing an order, users are redirected to a page with a live 15-minute countdown. A separate history page shows the status of all past orders.
- **Click-to-View Timer:** Users can click on any pending order in their history to navigate back to its live countdown page.

---

## 🧰 Tech Stack

### Backend
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (with Mongoose)  
- **Scheduling:** node-cron for the auto-cancellation job  

### Frontend
- **Library:** React (built with Vite)  
- **Styling:** TailwindCSS  
- **Routing:** React Router  
- **API Communication:** Axios  

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (which includes npm)
- A free MongoDB Atlas account (or a local MongoDB instance)

---

### 🚀 Backend Setup

Navigate to the backend folder:

```bash
cd canteen-backend
```

Install NPM packages:

```bash
npm install
```

Create an environment file:

Create a file named `.env` in the canteen-backend root. Inside, add your MongoDB connection string:

```bash
MONGO_URI=mongodb+srv://your_username:your_password@cluster_url/canteenDB?retryWrites=true&w=majority
```

Start the server:

```bash
node index.js
```

Your backend server should now be running on **http://localhost:5001**.

---

### 💻 Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd canteen-frontend
```

Install NPM packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Your frontend should now be running on **http://localhost:5173** (or another port if 5173 is busy).

---

## 👥 Contributors

A huge thanks to all the contributors who have helped build this project:

- **Tushar Mishra**
- **Siddhant Pratap Singh**
- **Rishita Sen**
- **Atharv Sharma**
- **Anchit Dixit**
- **Keshav Mittal**
