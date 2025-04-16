import { useEffect, useState, useContext } from "react";
import styles from "../../styles/Cart.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import CartItem from "../../components/module/CartItem/CartItem";
import { MdOutlineDone } from "react-icons/md";

import CartItemM from "../../components/module/CartItemM/CartItemM";
import ModalDelete from "../../components/module/ModalDelete/ModalDelete";
import ModalBuy from "../../components/module/ModalBuy/ModalBuy";
import { CountContext } from "../../context/CartContext";
import axios from "axios";
import swal from "sweetalert";
import NoneSearch from "../../components/module/NoneSearch/NoneSearch";
import EmptyProduct from "../../components/module/EmptyProduct/EmptyProduct";
import { useNavigate } from "react-router-dom";
import { goToLogin } from "../../utils/helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [showModalBuy, setShowModalBuy] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [inCart, setInCart] = useState(true);
  const [mainCode, setMainCode] = useState("");
  const { setCountProduct } = useContext(CountContext);
  const [mainProduct, setMainProduct] = useState("");
  const [propetyId, setPropetyId] = useState(null);
  const [propertyValue, setPropertyValue] = useState(null);
  const [propertName, setPropertName] = useState(null);
  const [filterProduct, setFilterProduct] = useState([]);
  const [errorSelect, setErrorSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const sendProduct = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/app/add-product/`, cart, {
        headers,
      });

      if (response.status === 201) {
        setLoading(false);
        localStorage.removeItem("cart");
        swal({
          title: "درخواست با موفقیت ثبت شد",
          icon: "success",
          button: "باشه",
        }).then(() => {
          navigate("/trackorders");
        });

        setCart([]);
        setFilterProduct([]);
        setCountProduct(null);
      }
    } catch (e) {
       if(e.response?.status ===500){
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
       }
    
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
      
      setLoading(false);
    }
  };

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateCountProduct = () => {
    const updatedCart = cart.map((product) =>
      product.item_code === mainCode
        ? {
            ...product,
            count: value,
          }
        : product
    );

    const updatedFilter = filterProduct.map((product) =>
      product.item_code === mainCode
        ? {
            ...product,
            count: value,
          }
        : product
    );

    setCart(updatedCart);
    setFilterProduct(updatedFilter);
    updateLocalStorage(updatedCart);
    setShowModalBuy(false);
  };

  const handleDelete = () => {
    if (cart.length === 1) {
      localStorage.removeItem("cart");
      setShowDeleteModal(false);
      setFilterProduct([]);
      setCart([]);
      setCountProduct(null);
    } else {
      const updatedCart = cart.filter(
        (product) => product.item_code !== mainCode
      );
      setCart(updatedCart);
      setFilterProduct((prevProduct) =>
        prevProduct.filter((product) => product.item_code !== mainCode)
      );
      updateLocalStorage(updatedCart);
      setShowDeleteModal(false);
      const countProduct = JSON.parse(localStorage.getItem("cart")).length;
      setCountProduct(countProduct);
    }
  };

  const searchHandler = (value) => {
    const searchTerm = value.toLowerCase();
    setSearch(searchTerm);

    const filterProducts = cart.filter(
      (product) =>
        product.item_code.includes(searchTerm) ||
        product.descriptions.toLowerCase().includes(searchTerm) ||
        product.count.toString().includes(searchTerm) ||
        product.unitdesc.includes(searchTerm)
    );

    setFilterProduct(filterProducts);
  };

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
    setFilterProduct(localCart);
  }, []);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  return (
    <>
      <div className={styles.wrapperpage}>
        <SideBar />
        <div className={styles.pagecontent}>
          <ModalBuy
            showModalBuy={showModalBuy}
            setShowModalBuy={setShowModalBuy}
            value={value}
            setValue={setValue}
            updateCountProduct={updateCountProduct}
            inCart={inCart}
            mainProduct={mainProduct}
            setPropetyId={setPropetyId}
            setPropertyValue={setPropertyValue}
            setPropertName={setPropertName}
            propertyValue={propertyValue}
            errorSelect={errorSelect}
            setErrorSelect={setErrorSelect}
          />
          <ModalDelete
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handleDelete={handleDelete}
          />
          <Header title={"سبد درخواست"} />
          <div className={styles.maincontent}>
            {windowWidth < 600 ? (
              <>
                <div className={styles.contnetcratwarpperm}>
                  {cart.length > 0 ? (
                    <>
                      <div>
                        <SearchBox
                          value={search}
                          onChange={searchHandler}
                          placeholder={
                            "جستوجو براساس کد کالا , شرح , تعداد , واحد"
                          }
                        />
                      </div>
                      {filterProduct?.length > 0 ? (
                        <>
                          <div className={`${styles.scrollitem}`}>
                            {filterProduct.length > 0 &&
                              filterProduct.map((item) => (
                                <CartItemM
                                  key={item.id}
                                  setShowModalBuy={setShowModalBuy}
                                  setShowDeleteModal={setShowDeleteModal}
                                  prodcut={item}
                                  setValue={setValue}
                                  setMainCode={setMainCode}
                                  setMainProduct={setMainProduct}
                                />
                              ))}
                          </div>
                          <div className={styles.finalbtnwapper}>
                            <button
                              className={`${styles.finalbtn} ${
                                loading ? styles.loading : ""
                              }`}
                              onClick={sendProduct}
                              disabled={loading}
                            >
                              <span>تایید نهایی</span>
                              <MdOutlineDone style={{ marginRight: "15px" }} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <NoneSearch />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <EmptyProduct />
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {cart.length > 0 ? (
                  <>
                    <div className={`${styles.cartItemwrapper}`}>
                      <div className={styles.wrapper}>
                        <SearchBox
                          value={search}
                          onChange={searchHandler}
                          placeholder={
                            "جستوجو براساس کد کالا , شرح , تعداد , واحد"
                          }
                        />
                      </div>
                      {filterProduct.length > 0 ? (
                        <>
                          <div className={styles.carts}>
                            {filterProduct.length > 0 &&
                              filterProduct.map((item) => (
                                <CartItem
                                  key={item.id}
                                  setShowModalBuy={setShowModalBuy}
                                  setShowDeleteModal={setShowDeleteModal}
                                  prodcut={item}
                                  setValue={setValue}
                                  setMainCode={setMainCode}
                                  setMainProduct={setMainProduct}
                                />
                              ))}
                          </div>
                          <div className={styles.finalbtnwapper}>
                            <button
                              className={` ${styles.finalbtn} ${
                                loading ? "disable" : ""
                              }`}
                              onClick={sendProduct}
                              disabled={loading}
                            >
                              <span>تایید نهایی</span>
                              <MdOutlineDone style={{ marginRight: "15px" }} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <NoneSearch />
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <EmptyProduct />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
