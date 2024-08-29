
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './Chart.module.css';
import axios from 'axios';


export default function Chart() {
    const [data, setData] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const getDataChart = async (access) => {
        const headers = {
            Authorization: `Bearer ${access}`,
        };

        try {
            const response = await axios.get(`${apiUrl}/app/orders-per-month/`, {
                headers,
            });

            if (response.status === 200) {
                setData(response.data);
            }

        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        const access = localStorage.getItem("access");
        if (access) {
            getDataChart(access);
        } 
    }, []);

    return (
        <div className={styles.chartcontainer}>
            <p className={styles.titlesole}>فروش در هر ماه</p>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis tickMargin={40} />
                    <Bar dataKey="order_count" fill="#ffcb05" />
                    <Tooltip />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
// app/get-cart-deatil