import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// پلاگین سفارشی برای اضافه کردن نوشته در مرکز
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
        const { width, height, ctx } = chart;
        ctx.restore();
        const fontSize = (height / 250).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';

        const text = 'total value',
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
    }
};

const DoughnutChart = () => {
    const data = {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132,1 )',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86,1 )',
                'rgba(75, 192, 192,1 )',
                'rgba(153, 102, 255,1 )',
                'rgba(255, 159, 64,1 )'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            centerText: {} // فعال کردن پلاگین سفارشی
        }
    };

    return (
        <div style={{ width: '100%', height: '200px', display:'flex' , justifyContent:'center', alignItems:'center' }}>
            <Doughnut data={data} options={options} plugins={[centerTextPlugin]}  />
        </div>
    );
};

export default DoughnutChart;