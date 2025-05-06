import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "../cssFiles/line-chart.css"
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export default function LineChart() {
    const [hourlyAverages, setHourlyAverages] = useState([]);

    const startHour = 6;
    const endHour = 22;

    const hourLabels = [];
    for (let i = startHour; i <= endHour; i++) {
        const label = i < 12 ? `${i}am` : i === 12 ? `12pm` : `${i - 12}pm`;
        hourLabels.push(label);
    }

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get("https://peoplecounting.onrender.com/");
                const chartData = response.data;

                const hourlyData = {};
                for (let i = startHour; i <= endHour; i++) {
                    hourlyData[i] = [];
                }

                chartData.forEach((item) => {
                    const date = new Date(item.time);
                    const hour = date.getHours();
                    if (hour >= startHour && hour <= endHour) {
                        hourlyData[hour].push(item.count);
                    }
                });

                const averages = [];
                for (let i = startHour; i <= endHour; i++) {
                    const values = hourlyData[i];
                    const average =
                        values.length > 0
                            ? values.reduce((sum, val) => sum + val, 0) / values.length
                            : 0;
                    averages.push(Number(average.toFixed(2)));
                }

                setHourlyAverages(averages);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchChartData(); // initial fetch
        const interval = setInterval(fetchChartData, 1000); // fetch every second

        return () => clearInterval(interval); // cleanup
    }, []);

    const data = {
        labels: hourLabels,
        datasets: [
            {
                label: "Average Count",
                data: hourlyAverages,
                fill: false,
                borderColor: "#4CAF50",
                backgroundColor: "#4CAF50",
                tension: 0.3,
                pointRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 100,
                ticks: {
                    stepSize: 10,
                },
                title: {
                    display: true,
                    text: "Average Count",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Time of Day",
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: "Average Count per Hour (6AM - 10PM)",
            },
            legend: {
                display: true,
                position: "bottom",
            },
        },
    };

    return (
        <div className="line-chart-container">
            <Line data={data} options={options} />
        </div>
    );
}
