import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";


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

const ChartRAM = (props) => {
    const [iniciar, setIniciar] = useState(true)
    const [labels, setLabels] = useState([
      `Libre ${Number.isNaN(props.free)?0:props.free}`, 
    `En uso ${Number.isNaN(props.used)?0:props.used}}`, 
    `Disponible ${Number.isNaN(props.available)?0:props.available}}`]);
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
            data: [props.free,props.used,props.available],
          },
        ]
      });

      useEffect(()=>{

        setLabels([`${Number.isNaN(props.free)?0:props.free} Libre`, 
        `${Number.isNaN(props.used)?0:props.used}  En uso`, 
        `${Number.isNaN(props.available)?0:props.available} Disponible`])
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
                    data: [props.free,props.used,props.available],
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

export default ChartRAM;