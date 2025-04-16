import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const CountContext = createContext();

export function CountProvaider({ children }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [countProduct, setCountProduct] = useState(0);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const countproductlenght = JSON.parse(localStorage.getItem("cart"))?.length;
    setCountProduct(countproductlenght);
  }, []);

  useEffect(() => {
    const validateUser = async () => {
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        const body = {
          refresh_token: refresh,
        };

        try {
          const response = await axios.post(`${apiUrl}/user/refresh/`, body);

          if (response.status === 200) {
            localStorage.setItem("refresh", response.data.refresh_token);
          }
        } catch (e) {
          if (e.response?.status === 401) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            navigate("/login");
          }
          
        }
      } else {
        navigate("/login");
      }
    };

    validateUser();
  }, []);

  return (
    <CountContext.Provider
      value={{ countProduct, setCountProduct, setIsSubMenuOpen, isSubMenuOpen }}
    >
      {children}
    </CountContext.Provider>
  );
}
