import { useEffect, useRef, useState } from "react";
import styles from "../../styles/TrackOrders.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import OrderTrackItem from "../../components/module/OrderTrackItem/OrderTrackItem";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import Filter from "../../components/module/Filter/Filter";
import axios from "axios";
import NoneSearch from "../../components/module/NoneSearch/NoneSearch";
import EmptyProduct from "../../components/module/EmptyProduct/EmptyProduct";
import ModalFilter from "../../components/module/ModalFilter/ModalFilter";
import Loading from "../../components/module/Loading/Loading";
import { goToLogin } from "../../utils/helper";
import InfiniteScroll from "react-infinite-scroll-component";

export default function TrackOrders() {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState([]);
  const [allOrders, setAllorders] = useState([]);
  const [openModal, setOpenmodal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const isFetched = useRef(false);
  const [isSearch, setIsSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const getAllOrders = async (page = 1, page_size = 25) => {
    if (page === 1 && firstLoad) setLoading(true);

    const access = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${access}` };

    try {
      const response = await axios.get(`${apiUrl}/app/get-cart-detail/`, {
        headers,
        params: { page, page_size },
      });

      if (response.status === 200) {
        setAllorders((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );
        setFilterValue((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("access");
        goToLogin();
      }
    } finally {
      setLoading(false);
      if (firstLoad) setFirstLoad(false);
    }
  };

  const filterOrdersByDate = async (
    startDate,
    endDate,
    page = 1,
    page_size = 10
  ) => {
    const convertToEnglishDigits = (str) =>
      str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    const formatDate = (date) =>
      convertToEnglishDigits(date).replace(/\//g, "");
    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    const access = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${access}` };

    if (page === 1) setIsSearch(true);

    try {
      const response = await axios.get(`${apiUrl}/app/get-cart-detail/`, {
        params: {
          page,
          page_size,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        },
        headers,
      });

      setSearch("");

      if (response.status === 200) {
        setFilterValue((prev) =>
          page === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (error) {
      console.error("خطا در دریافت محصولات فیلتر شده:", error);
    } finally {
      setIsSearch(false);
    }
  };

  const searchOrders = async (query, page = 1, page_size = 25) => {
    if (!query.trim()) return;

    const access = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${access}` };

    if (page === 1) setIsSearch(true);

    try {
      const response = await axios.get(`${apiUrl}/app/get-cart-detail/`, {
        params: { query, page, page_size },
        headers,
      });

      if (response.status === 200) {
        const newResults =
          Array.isArray(response.data) && response.data.length === 0
            ? []
            : response.data?.results || [];
        setFilterValue((prev) =>
          page === 1 ? newResults : [...prev, ...newResults]
        );

        if (response.data.results.length < page_size) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }
      }
    } catch (error) {
      console.error("خطا در دریافت محصولات فیلتر شده:", error);
    } finally {
      setIsSearch(false);
      if (firstLoad) setFirstLoad(false);
    }
  };

  const resetOrders = () => {
    setFilterValue(allOrders);
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    if (!isFetched.current) {
      getAllOrders();
      isFetched.current = true;
    }
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilterValue(allOrders);
      setPage(1);
      setHasMore(true);
      return;
    }
    setPage(1);
    setHasMore(true);
    const delayDebounceFn = setTimeout(() => {
      searchOrders(search.trim(), 1);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title={"پیگیری درخواست"} />
        <div className={styles.ordercontent}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className={styles.topsec}>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder={"جستوجو براساس شماره درخواست , تعداد اقلام"}
                />
                <Filter setOpenmodal={setOpenmodal} all={resetOrders} />
              </div>
              {allOrders?.length > 0 ? (
                <>
                  {isSearch ? (
                    <p className="text-search">در حال جستوجو ...</p>
                  ) : (
                    <InfiniteScroll
                      dataLength={filterValue?.length}
                      next={() => getAllOrders(page)}
                      hasMore={hasMore}
                      scrollableTarget="wrapp_orders"
                    >
                      <div className={styles.wrapp_orders} id="wrapp_orders">
                        {filterValue?.length > 0 ? (
                          filterValue.map((order, index) =>
                            selectedOrderId === order.id ||
                            selectedOrderId === null ? (
                              <OrderTrackItem
                                key={order.id}
                                order={order}
                                number={index}
                                setSelectedOrderId={setSelectedOrderId}
                                onDetailsClick={() =>
                                  setSelectedOrderId(order.id)
                                }
                              />
                            ) : null
                          )
                        ) : (
                          <NoneSearch />
                        )}
                      </div>
                    </InfiniteScroll>
                  )}
                </>
              ) : (
                <>
                  <EmptyProduct />
                </>
              )}
            </>
          )}
        </div>
        <ModalFilter
          openModal={openModal}
          setOpenmodal={setOpenmodal}
          filterOrdersByDate={filterOrdersByDate}
        />
      </div>
    </div>
  );
}
