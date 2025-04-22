import { useEffect } from "react";
import styles from "../../styles/Home.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import Infouser from "../../components/module/Infouser/Infouser";
import Notifications from "../../components/module/Notifications/Notifications";
import Chart from "../../components/module/Chart/Chart";
import StatusLastProduct from "../../components/module/StatusLastProduct/StatusLastProduct";
import Chat from "../../components/templates/chat/Chat";
import { goToLogin } from "../../utils/helper";
import useSWR from "swr";
import apiClient from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const fetcher = async (url) => {
  try {
    const response = await apiClient.get(url);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    if (e.response?.status === 500) {
      toast.error(e.response?.data?.message || "مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  }
};
export default function Home() {
  const { data: product, error } = useSWR(
    `/app/get-single-order-detail/`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 15 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access");
      goToLogin();
    }
  }, [error]);

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
            {product && (
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
