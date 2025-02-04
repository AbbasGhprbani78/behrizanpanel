import { useEffect, useState } from "react";
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
dayjs.extend(jalaliday);

function convertToPersianNumbers(number) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}

function convertToPersianDate(date) {
  return dayjs(date).calendar("jalali").format("YYYY/MM");
}

export default function Chart() {
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const getDataChart = async () => {
    const access = localStorage.getItem("access");
    const headers = {
      Authorization: `Bearer ${access}`,
    };

    try {
      const response = await axios.get(`${apiUrl}/app/orders-per-month/`, {
        headers,
      });

      if (response.status === 200) {
        const formattedData = response.data.map((item) => ({
          ...item,
          month: convertToPersianDate(item.month),
        }));
        setData(formattedData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDataChart();
  }, []);

  return (
    <div className={styles.chartcontainer}>
      <p className={styles.titlesole}>فروش در هر ماه</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
