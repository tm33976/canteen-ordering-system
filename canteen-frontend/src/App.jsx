import { Routes, Route, Link } from 'react-router-dom'; 
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage'; 

// A new component for our main page layout
const HomePage = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <MenuList />
    </div>
    <div>
      <Cart />
    </div>
  </div>
);

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* NEW: Updated header with navigation */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            <Link to="/" className="hover:text-blue-600">Canteen Ordering</Link>
          </h1>
          <nav>
            <Link to="/history" className="text-lg text-gray-600 hover:text-blue-600">
              Order History
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order/:orderId" element={<OrderPage />} />
          <Route path="/history" element={<OrderHistoryPage />} /> 
        </Routes>
      </main>
    </div>
  );
}

export default App;