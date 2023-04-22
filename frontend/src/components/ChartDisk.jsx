import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";


const si = 100;

const options = {
    responsive:true,
    maintainAspectRatio:false,
    color: "rgb(255,255,255)",
    animation:{
        duration:0
    }
}

const ChartDisk = (props) => {
    const [iniciar, setIniciar] = useState(true)
    const [labels, setLabels] = useState([`Usado ${props.usado}`, `Libre ${props.libre}`]);
    const [data, setData] = useState({
        labels: labels,
        datasets: [
          {
            label: ["%"],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderColor: "rgb(0, 0, 0)",
            borderWidth: 1,
            data: [props.usado,props.libre],
          },
        ]
      });

      useEffect(()=>{
        setLabels([`${props.usado} % usado`, `${props.libre} % libre`])
        setData({
            labels: labels,
            datasets:[
                {
                    label: ["%"],
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderColor: "rgb(0, 0, 0)",
                    borderWidth: 1,
                    data: [props.usado,props.libre],
                  },
            ]
        }) 
        const interval = setInterval(()=>{
            setIniciar(!iniciar)
        },1001)
    },[iniciar])

      
  return (
    <div>
      <Pie data={data} options={options}/>
    </div>
  );
};

export default ChartDisk;