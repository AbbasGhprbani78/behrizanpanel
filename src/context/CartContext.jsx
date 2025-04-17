import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/axiosConfig";

export const CountContext = createContext();

export function CountProvaider({ children }) {
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
        const body = { refresh };

        try {
          const response = await apiClient.post("/user/refresh/", body);

          if (response.status === 200) {
            localStorage.setItem("access", response.data.access);
          }
        } catch (e) {
          console.log(e);
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
