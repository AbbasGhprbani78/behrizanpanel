import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products'
import Cart from './pages/Cart/Cart'
import Orders from './pages/Orders/Orders'
import Trackorders from './pages/Trackorders/Trackorders'
import Ticket from './pages/Ticket/Ticket'
import Report from './pages/Report/Report'
import Notfound from './pages/PageNotFound/Notfound';

let routes = [
    { path: "/", element: <Home /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },

    { path: "/products", element: <Products /> },
    { path: "/cart", element: <Cart /> },
    { path: "/orders/:id", element: <Orders /> },

    { path: "/trackorders", element: <Trackorders /> },
    { path: "/ticket", element: <Ticket /> },
    { path: "/report", element: <Report /> },
    { path: "*", element: <Notfound /> }
]

export default routes