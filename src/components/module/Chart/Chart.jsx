import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./Chart.module.css";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { convertToPersianNumbers } from "../../../utils/helper";
import apiClient from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
dayjs.extend(jalaliday);

export default function Chart() {
  const [data, setData] = useState([]);

  const getDataChart = async () => {
    try {
      const response = await apiClient.get("/app/orders-per-month/");
      if (response.status === 200) {
        console.log(response.data);
        setData(response.data);
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
    getDataChart();
  }, []);

  const formattedData = data
    ? data.map((item) => ({
        ...item,
        month: item.month,
      }))
    : [];

  return (
    <div className={styles.chartcontainer}>
      <p className={styles.titlesole}>فروش در هر ماه</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <XAxis dataKey="month" tickFormatter={convertToPersianNumbers} />
          <YAxis
            tickFormatter={(tick) => convertToPersianNumbers(tick)}
            tickMargin={40}
          />
          <Bar dataKey="order_count" fill="#ffcb05" />
          <Tooltip
            formatter={(value) => [
              convertToPersianNumbers(value),
              "تعداد سفارش",
            ]}
            labelFormatter={(label) => convertToPersianNumbers(label)}
          />
        </BarChart>
      </ResponsiveContainer>
      <ToastContainer />
    </div>
  );
}
