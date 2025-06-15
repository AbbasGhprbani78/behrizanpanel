import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import Infouser from "../../components/module/Infouser/Infouser";
import Notifications from "../../components/module/Notifications/Notifications";
import Chart from "../../components/module/Chart/Chart";
import StatusLastProduct from "../../components/module/StatusLastProduct/StatusLastProduct";
import Chat from "../../components/templates/chat/Chat";
import apiClient from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [product, setProduct] = useState(null);
  const getSingleProduct = async () => {
    try {
      const response = await apiClient.get("/app/get-single-order-detail/");
      if (response.status === 200) {
        console.log(response.data);
        setProduct(response.data);
      }
    } catch (error) {
      if (error.response?.status === 500) {
        toast.error(
          error.response?.data?.message || "مشکلی سمت سرور پیش آمده",
          {
            position: "top-left",
          }
        );
      }
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  return (
    <>
      <div className={styles.wrapperpage}>
        <SideBar />
        <div className={styles.pagecontent}>
          <Header title={"خانه"} />
          <div className={styles.maincontent}>
            <div className={styles.hometop}>
              <div className={styles.item1}>
                <Notifications />
              </div>
              <div className={styles.item2}>
                <Infouser />
              </div>
              <div className={styles.item3}>
                <Chart />
              </div>
            </div>
            {product &&
              !Array.isArray(product) &&
              Object.keys(product).length > 0 && (
                <div className="pb-4">
                  <StatusLastProduct product={product} />
                </div>
              )}
          </div>
        </div>
      </div>
      <Chat />
      <ToastContainer />
    </>
  );
}
