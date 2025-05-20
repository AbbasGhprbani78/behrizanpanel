import { useEffect, useRef, useState } from "react";
import styles from "../../styles/TrackOrders.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import OrderTrackItem from "../../components/module/OrderTrackItem/OrderTrackItem";
import SearchBox from "../../components/module/SearchBox/SearchBox";
import Filter from "../../components/module/Filter/Filter";
import NoneSearch from "../../components/module/NoneSearch/NoneSearch";
import EmptyProduct from "../../components/module/EmptyProduct/EmptyProduct";
import ModalFilter from "../../components/module/ModalFilter/ModalFilter";
import Loading from "../../components/module/Loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../config/axiosConfig";
import LoadingInfity from "../../components/module/Loading/LoadingInfinity";

export default function TrackOrders() {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState([]);
  const [allOrders, setAllorders] = useState([]);
  const [openModal, setOpenmodal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const isFetched = useRef(false);
  const [isSearch, setIsSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [orderItemId, setOrderItemId] = useState(null);

  const getAllOrders = async (page = 1, page_size = 25) => {
    if (page === 1 && firstLoad) setLoading(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get("/app/get-cart-detail/", {
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

  const filterOrdersByDate = async (
    startDate,
    endDate,
    page = 1,
    page_size = 25
  ) => {
    const convertToEnglishDigits = (str) =>
      str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    const formatDate = (date) =>
      convertToEnglishDigits(date).replace(/\//g, "");
    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get(`/app/get-cart-detail/`, {
        params: {
          page,
          page_size,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        },
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
    } catch (e) {
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    } finally {
      setIsSearch(false);
      setIsFetchingMore(false);
    }
  };

  const searchOrders = async (query, page = 1, page_size = 25) => {
    if (!query.trim()) return;

    if (page === 1) setIsSearch(true);
    if (page > 1) setIsFetchingMore(true);

    try {
      const response = await apiClient.get(`/app/get-cart-detail/`, {
        params: { query, page, page_size },
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
    } catch (e) {
      if (e.response?.status === 500) {
        toast.error(e.response?.data?.message || " مشکلی سمت سرور پیش آمده", {
          position: "top-left",
        });
      }
    } finally {
      setIsSearch(false);
      if (firstLoad) setFirstLoad(false);
      setIsFetchingMore(false);
    }
  };

  const resetOrders = () => {
    setFilterValue([]);
    setIsSearch(true);
    getAllOrders(1);
    setIsSearch(true);
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
    setPage(1);
    setHasMore(true);

    if (search.trim() === "") {
      setFilterValue([]);
      getAllOrders(1);
      setIsSearch(true);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      searchOrders(search.trim(), 1);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    if (orderItemId) {
      const FiltredOrders = allOrders.filter((order) => {
        return order.id !== orderItemId;
      });
      setAllorders(FiltredOrders);
      setFilterValue(FiltredOrders);
    }
  }, [orderItemId]);

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
                  placeholder={"جستوجو براساس شماره درخواست ,اقلام"}
                />
                <Filter
                  setOpenmodal={setOpenmodal}
                  all={resetOrders}
                  filters={[]}
                />
              </div>
              {allOrders?.length > 0 ? (
                <>
                  {isSearch ? (
                    <p className="text-search">در حال جستوجو ...</p>
                  ) : (
                    <InfiniteScroll
                      dataLength={filterValue?.length > 0 ? filterValue : []}
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
                                setOrderItemId={setOrderItemId}
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
                        {isFetchingMore && (
                          <div className={styles.loadingContainer}>
                            <LoadingInfity />
                          </div>
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
          isenglish={""}
        />
      </div>
      <ToastContainer />
    </div>
  );
}
