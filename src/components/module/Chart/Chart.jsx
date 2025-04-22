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
import useSWR from "swr";
import apiClient from "../../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
dayjs.extend(jalaliday);
const fetcher = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (e) {
    if (e.response?.status === 500) {
      toast.error(e.response?.data?.message || "مشکلی سمت سرور پیش آمده", {
        position: "top-left",
      });
    }
  }
};

export default function Chart() {
  const { data } = useSWR(`/app/orders-per-month/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15 * 60 * 1000,
  });

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
