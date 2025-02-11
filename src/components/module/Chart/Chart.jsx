import { useEffect } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./Chart.module.css";
import axios from "axios";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { convertToPersianNumbers, goToLogin } from "../../../utils/helper";
import useSWR from "swr"; 

dayjs.extend(jalaliday);

function convertToPersianDate(date) {
  return dayjs(date).calendar("jalali").format("YYYY/MM");
}

// fetcher function
const fetcher = async (url) => {
  const access = localStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${access}`,
  };
  const response = await axios.get(url, { headers });
  return response.data;
};

export default function Chart() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { data, error } = useSWR(`${apiUrl}/app/orders-per-month/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15 * 60 * 1000,
  });

  useEffect(() => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access");
      goToLogin();
    }
  }, [error]);

  const formattedData = data
    ? data.map((item) => ({
        ...item,
        month: convertToPersianDate(item.month),
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
    </div>
  );
}
