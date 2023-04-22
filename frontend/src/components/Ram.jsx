import {useState, useEffect} from 'react';
import { Button, Table } from 'react-bootstrap';
import {GetRam, GetDisk} from "../../wailsjs/go/main/App"
import ChartRAM from "./ChartRAM"




const Ram = () => {
    const [ramData, setRamData] = useState("")
    const [total, setTotal] = useState(0)
    const [free, setFree] = useState(0)
    const [used, setUsed] = useState(0)
    const [available, setAvailable] = useState(0)
    const [iniciar, setIniciar] = useState(true)

    const updateRamData = (e) =>{
        setRamData(JSON.parse(e));
    }

    function updateVariables(){
        setTotal(ramData.Total)
        setFree(ramData.Free)
        setUsed(ramData.Used)
        setAvailable(ramData.Available)
    }


    function getRam(){
        GetRam().then(updateRamData)
    }

    
    useEffect(()=>{
        getRam()
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
            <h1>Ram</h1>
            <div style={{position:"relative",padding:"5%",/*border:"4px dotted blue"*/}}>
                <div style={{height:"100%", /*border:"4px dotted blue"*/}}>
                    <ChartRAM 
                    used={used}
                    free={free}
                    available={available}
                    />
                </div>
            </div>
            <div style={{paddingLeft:"10%",paddingRight:"10%"}}>
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>Disponible (GB)</th>
                            <th>Usada (GB)</th>
                            <th>Libre (GB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{available}</td>
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
export default Ram