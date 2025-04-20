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
import apiClient from "../../../config/axiosConfig";

dayjs.extend(jalaliday);

const fetcher = async (url) => {
  const response = await apiClient.get(url);
  return response.data;
};

export default function Chart() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { data, error } = useSWR(`${apiUrl}/app/orders-per-month/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 15 * 60 * 1000,
  });

  const formattedData = data
    ? data.map((item) => ({
        ...item,
        month: item.month,
      }))
    : [];

  console.log(data);
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
