import { useEffect, useState, useContext } from "react";
import styles from "../../styles/Products.module.CSS";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import { IoIosArrowBack } from "react-icons/io";
import ProductItem from "../../components/module/ProductItem/ProductItem";
import ModalBuy from "../../components/module/ModalBuy/ModalBuy";
import { CountContext } from "../../context/CartContext";
import swal from "sweetalert";
import NoneSearch from "../../components/module/NoneSearch/NoneSearch";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/module/Loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../config/axiosConfig";
import LoadingInfity from "../../components/module/Loading/LoadingInfinity";

export default function Products() {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(1);
  const [showModalBuy, setShowModalBuy] = useState(false);
  const [mainProduct, setMainProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [propetyId, setPropetyId] = useState(null);
  const [propertyValue, setPropertyValue] = useState(null);
  const [propertName, setPropertName] = useState(null);
  const { setCountProduct } = useContext(CountContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const gotocart = () => {
    navigate("/cart");
  };

  const addToCartHandler = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length) {
      const isInCart = cart.some(
        (item) => item.item_code == mainProduct.item_code
      );
      if (isInCart) {
        cart.forEach((item) => {
          if (item.item_code == mainProduct.item_code) {
            item.request_qty = Number(item.request_qty) + Number(value);
          }
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        swal({
          title: "به سبد درخواست اضافه شد",
          icon: "success",
          button: "باشه",
        });
      } else {
        const cartItem = {
          item_code: mainProduct.item_code,
          request_qty: Number(value),
          descriptions: mainProduct.descriptions,
          img: mainProduct.image,
          unitdesc: mainProduct.unitdesc,
        };

        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        setValue(1);
        swal({
          title: "به سبد درخواست اضافه شد",
          icon: "success",
          buttons: "باشه",
        });
      }
    } else {
      const cartItem = {
        item_code: mainProduct.item_code,
        request_qty: Number(value),
        descriptions: mainProduct.descriptions,
        img: mainProduct.image,
        unitdesc: mainProduct.unitdesc,
      };

      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      swal({
        title: "به سبد درخواست اضافه شد",
        icon: "success",
        buttons: "باشه",
      });
    }

    const countproduct = JSON.parse(localStorage.getItem("cart")).length;
    setCountProduct(countproduct);
    setShowModalBuy(false);
  };

  const getAllProducts = async (page = 1, page_size = 25) => {
    if (page === 1 && firstLoad) setLoading(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get(`/app/get-products/`, {
        params: { page, page_size },
      });

      if (response.status === 200) {
        setProducts((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );
        setFilterProduct((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        setHasMore(response.data.results.length === page_size);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      setIsSearch(false);
      if (firstLoad) setFirstLoad(false);
    }
  };

  const fetchFilteredProducts = async (query, page = 1, page_size = 25) => {
    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get(`${apiUrl}/app/search/`, {
        params: { query, page, page_size },
      });

      if (response.status === 200) {
        setFilterProduct((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        setHasMore(response.data.results.length === page_size);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    } finally {
      setIsSearch(false);
      setIsFetchingMore(false);
      if (firstLoad) setFirstLoad(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (search.trim() === "") {
      setFilterProduct([]);
      getAllProducts(1);
      setIsSearch(true);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredProducts(search.trim(), 1);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    getAllProducts();
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
            addToCartHandler={addToCartHandler}
            mainProduct={mainProduct}
            setPropetyId={setPropetyId}
            propertyValue={propertyValue}
            setPropertyValue={setPropertyValue}
            setPropertName={setPropertName}
          />
          <Header title={"محصولات"} />
          {loading ? (
            <Loading />
          ) : (
            <div className={styles.maincontent}>
              <div className={styles.wrapper}>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder={"جستوجو براساس کدکالا , شرح محصول"}
                />
              </div>
              <div className={styles.ProductsPage}>
                {isSearch ? (
                  <p className="text-search">در حال جستوجو ...</p>
                ) : (
                  <>
                    <InfiniteScroll
                      className="hide-scrollbar"
                      dataLength={filterProduct?.length}
                      next={() => {
                        if (search.trim()) {
                          fetchFilteredProducts(search, page);
                        } else {
                          getAllProducts(page);
                        }
                      }}
                      hasMore={hasMore}
                      scrollableTarget="ProductsBox"
                    >
                      <div className={styles.ProductsBox} id="ProductsBox">
                        {filterProduct?.length > 0 ? (
                          filterProduct.map((product) => (
                            <ProductItem
                              product={product}
                              key={product.item_code}
                              setShowModalBuy={setShowModalBuy}
                              setMainProduct={setMainProduct}
                            />
                          ))
                        ) : (
                          <NoneSearch />
                        )}
                        {isFetchingMore && (
                          <div className={styles.loadingContainer}>
                            <LoadingInfity />
                          </div>
                        )}
                      </div>
                    </InfiniteScroll>
                    <div className={styles.wrapper_btn}>
                      <button className={styles.ButtonBox} onClick={gotocart}>
                        <span>ادامه</span>
                        <IoIosArrowBack />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
