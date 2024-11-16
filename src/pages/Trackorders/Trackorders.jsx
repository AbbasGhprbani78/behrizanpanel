
import React, { useEffect, useState } from 'react'
import styles from '../../styles/TrackOrders.module.css'
import SideBar from '../../components/module/SideBar/SideBar'
import Header from '../../components/module/Header/Header'
import OrderTrackItem from '../../components/module/OrderTrackItem/OrderTrackItem'
import SearchBox from '../../components/module/SearchBox/SearchBox'
import Filter from '../../components/module/Filter/Filter'
import axios from 'axios'
import NoneSearch from '../../components/module/NoneSearch/NoneSearch'
import EmptyProduct from '../../components/module/EmptyProduct/EmptyProduct'
import ModalFilter from '../../components/module/ModalFilter/ModalFilter'
import Loading from '../../components/module/Loading/Loading'


export default function TrackOrders() {
    const [search, setSearch] = useState("")
    const [filterValue, setFilterValue] = useState([])
    const [allOrders, setAllorders] = useState([])
    const [openModal, setOpenmodal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [loading, setLoading] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URL;

    const getAllOrders = async () => {
        setLoading(true)
        const access = localStorage.getItem("access")
        const headers = {
            Authorization: `Bearer ${access}`
        };
        try {
            const response = await axios.get(`${apiUrl}/app/get-cart-detail/`, {
                headers,
            })

            if (response.status === 200) {
                setAllorders(response.data)
                setFilterValue(response.data)
                setLoading(false)
            }

        } catch (e) {
            console.log(e)
        }
    }

    const searchHandler = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);

        if (searchTerm === "") {
            setFilterValue(allOrders);
        } else {
            const filterProducts = allOrders.filter(
                (item) =>
                    item.order_details_count.toString().toLowerCase() === searchTerm ||
                    item.cart_id.toString().toLowerCase() === searchTerm
            );
            setFilterValue(filterProducts);
        }
    };

    const filterOrdersByDate = (startDate, endDate) => {
  
        const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
        const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.date_time);

            return (
                (!start || orderDate >= start) &&
                (!end || orderDate <= end)
            );
        });

        setFilterValue(filteredOrders);
    };


    useEffect(() => {
        getAllOrders()
    }, [])



    return (
        <div className={styles.wrapperpage}>
            <SideBar />
            <div className={styles.pagecontent}>
                <Header title={"پیگیری سفارشات"} />
                <div className={styles.ordercontent}>
                    {
                        loading ?
                            <Loading /> :
                            allOrders.length > 0 ?
                                <>
                                    <div className={styles.topsec}>
                                        <SearchBox
                                            value={search}
                                            onChange={searchHandler}
                                            placeholder={"جستوجو براساس شماره درخواست , تعداد اقلام"}

                                        />
                                        <Filter setOpenmodal={setOpenmodal} all={() => setFilterValue(allOrders)} />
                                    </div>
                                    {
                                        filterValue.length > 0 ? (
                                            filterValue.slice().reverse().map((order, index) => (
                                                selectedOrderId === order.cart_id || selectedOrderId === null ? (
                                                    <OrderTrackItem
                                                        key={order.cart_id}
                                                        order={order}
                                                        number={index}
                                                        setSelectedOrderId={setSelectedOrderId}
                                                        onDetailsClick={() => setSelectedOrderId(order.cart_id)}
                                                    />
                                                ) : null
                                            ))
                                        ) : <NoneSearch />
                                    }
                                </>
                                :
                                <>
                                    <EmptyProduct />
                                </>
                    }

                </div>
                <ModalFilter
                    openModal={openModal}
                    setOpenmodal={setOpenmodal}
                    filterOrdersByDate={filterOrdersByDate}
                />
            </div>
        </div>
    )
}

