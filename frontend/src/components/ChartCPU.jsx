import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import Spinner from 'react-bootstrap/Spinner'


const si = 100;

const options = {
    responsive:true,
    maintainAspectRatio:false,
    color: "rgb(255,255,255)",
    animation:{
        duration:0
    },
    hoverOffset:40
}

const ChartCPU = (props) => {
    const [iniciar, setIniciar] = useState(true)
    const [mostrar, setMostrar] = useState(false)
    const [labels, setLabels] = useState([
      `Sistema ${Number.isNaN(props.sistema)?0:props.sistema}`, 
    `Usuario ${Number.isNaN(props.user)?0:props.user}}`, 
    `Libre ${Number.isNaN(props.libre)?0:props.libre}}`]);
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
            data: [props.sistema,props.user,props.libre],
          },
        ]
      });

      useEffect(()=>{

        setLabels([`${Number.isNaN(props.sistema)?0:props.sistema} % sistema`, 
        `${Number.isNaN(props.user)?0:props.user} % usuario`, 
        `${Number.isNaN(props.libre)?0:props.libre} % libre`])
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
                    data: [props.sistema,props.user,props.libre],
                  },
            ]
        }) 
        const interval = setInterval(()=>{
            setIniciar(!iniciar)
        },1000)

    },[iniciar])

    return (
      <div>
        <Doughnut data={data} options={options}/>
      </div>
    );

};

export default ChartCPU;