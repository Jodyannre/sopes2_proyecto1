import {useState, useEffect} from 'react';
import { Button, Table } from 'react-bootstrap';
import {Greet,Sumar, GetCPU, GetDisk} from "../../wailsjs/go/main/App"
import ChartDisk from "./ChartDisk"




const Disco = () => {
    const [diskData, setDiskData] = useState("")
    const [cpuData, setCpuData] = useState("")
    const [saludo, setSaludo] = useState("")
    const [total, setTotal] = useState(0)
    const [free, setFree] = useState(0)
    const [cached, setCached] = useState(0)
    const [used, setUsed] = useState(0)
    const [free_per, setFree_per] = useState(0)
    const [used_per, setUsed_per] = useState(0)
    const [iniciar, setIniciar] = useState(true)
    const [cached_per, setCached_per] = useState(0)
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const updateDiskData = (e) =>{
        setDiskData(JSON.parse(e));
    }
    const updateSaludo = (e)=>{
        setSaludo(e)
    }

    function updateVariables(){
        setTotal(diskData.Total)
        setFree(diskData.Free)
        setUsed(diskData.Used)
        setFree_per(Math.round(diskData.Free_Per))
        setUsed_per(Math.round(diskData.Used_Per))  
    }

    const setWindowsDimensions = () => {
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    function getDisk(){
        GetDisk().then(updateDiskData)
    }
    function greet(){
        Greet("Joel").then(updateSaludo)
    }
    
    useEffect(()=>{
        getDisk()
        updateVariables()
        const interval = setInterval(()=>{
            setIniciar(!iniciar)
        },500)
    },[iniciar])


    return(
        <>  
        <div className="square bg-dark text-white rounded-pill bg-light" style=
        {{hposition:"relative",marginBottom:"1%",padding:"1%",height:"100%", width:"100%",
            backgroundColor :"blue"}}>
            <h1 ><center>Gráfica de uso</center></h1>  
            <h1>Disco</h1>
            <div style={{position:"relative",padding:"5%",/*border:"4px dotted blue"*/}}>
                <div style={{height:"100%", /*border:"4px dotted blue"*/}}>
                    <ChartDisk 
                    usado={used_per}
                    libre={free_per}
                    />
                </div>
            </div>
            <div style={{paddingLeft:"10%",paddingRight:"10%"}}>
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>Total (B)</th>
                            <th>Usada (B)</th>
                            <th>Libre (B)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{total}</td>
                            <td>{used}</td>
                            <td>{free}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
        </>
    )
}
export default Disco