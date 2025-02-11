import { useEffect} from "react";
import styles from "../../styles/Home.module.css";
import SideBar from "../../components/module/SideBar/SideBar";
import Header from "../../components/module/Header/Header";
import Infouser from "../../components/module/Infouser/Infouser";
import Notifications from "../../components/module/Notifications/Notifications";
import Chart from "../../components/module/Chart/Chart";
import StatusLastProduct from "../../components/module/StatusLastProduct/StatusLastProduct";
import axios from "axios";
import Chat from "../../components/templates/chat/Chat";
import {goToLogin} from "../../utils/helper";
import useSWR from "swr";
const apiUrl = import.meta.env.VITE_API_URL;

const fetcher = async (url) => {
  const access = localStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${access}`,
  };
  const response = await axios.get(url, { headers });
  if (response.status === 200) {
    return response.data;
  } 
};

export default function Home() {
  const {
    data: product,
    error,
  } = useSWR(`${apiUrl}/app/get-single-order-detail/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15 * 60 * 1000, 
  });

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
    </>
  );
}
