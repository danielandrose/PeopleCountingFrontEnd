import React,{useState,useEffect} from 'react'
import "../cssFiles/counter-shower.css"
import axios from 'axios';

export default function CounterShower() {
  const [currentCount,setCurrentCount]=new useState(0);

  useEffect(() => {
    const fetchCountData = async () => {
      try {
        const response = await axios.get('https://peoplecounting.onrender.com/');
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          const sortedData = [...data].sort(
            (a, b) => new Date(b.time) - new Date(a.time)
          );
          setCurrentCount(sortedData[0].count);
        }
      } catch (error) {
        console.error('Error fetching count data:', error);
      }
    };

    fetchCountData();
    const intervalId = setInterval(fetchCountData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="counter-shower-container">
      <div className="counter-shower-sub-container">
        <p>LIVE OCCUPANCY</p>
        <h1 className="count-heading">{currentCount}</h1>
      </div>
    </div>
  )
}
