import { useEffect, useState } from "react";
import styles from "../../styles/Orders.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import OrderItem from "../../components/module/OrderItem/OrderItem";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import axios from "axios";
import NoneSearch from "../../components/module/NoneSearch/NoneSearch";
import EmptyProduct from "../../components/module/EmptyProduct/EmptyProduct";
import { useParams } from "react-router-dom";
import { goToLogin } from "../../utils/helper";
import Loading from "../../components/module/Loading/Loading";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const getOrderDetails = async () => {
    setLoading(true);
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };
    try {
      const response = await axios.get(`${apiUrl}/app/get-product/${id}`, {
        headers,
      });

      if (response.status === 200) {
        console.log(response.data);
        setOrderDetails(response.data);
        setFilterProduct(response.data);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const fetchFilteredProducts = async (query) => {
    setIsSearch(true);
    const access = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${access}` };
    try {
      const response = await axios.get(`${apiUrl}/app/order-search/`, {
        params: { query },
        headers,
      });

      if (response.status === 200) {
        setFilterProduct(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearch(false);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilterProduct(orderDetails);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredProducts(search.trim());
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    getOrderDetails();
  }, []);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"سفارشات"} />
        {loading ? (
          <Loading />
        ) : orderDetails.length > 0 ? (
          <>
            <div className={styles.ordertitlewrapper}>
              <div className={styles.detailorderwrapper}>
                <span> تاریخ درخواست : </span>
                <span>{formatDate(orderDetails[0]?.request_date)}</span>
              </div>
              <SearchBox
                value={search}
                onChange={setSearch}
                placeholder={"جستوجو براساس کد کالا , شرح , تعداد"}
              />
            </div>
            <div className={styles.maincontent}>
              {isSearch ? (
                <p className="text-search">درحال جستوجو ...</p>
              ) : (
                <div className={styles.orderitemcontainer}>
                  {filterProduct.length > 0 ? (
                    filterProduct.map((item) => (
                      <OrderItem key={item.item_code} item={item} />
                    ))
                  ) : (
                    <>
                      <NoneSearch />
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <EmptyProduct />
          </>
        )}
      </div>
    </div>
  );
}
