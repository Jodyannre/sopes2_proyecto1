import {useState, useEffect} from 'react';
import { Button, Table } from 'react-bootstrap';
import {Greet,Sumar, GetCPU, GetDisk} from "../../wailsjs/go/main/App"
import ChartCPU from "./ChartCPU"




const Cpu = () => {
    const [cpuData, setCpuData] = useState("")
    const [system, setSystem] = useState(0)
    const [free, setFree] = useState(0)
    const [user, setUser] = useState(0)
    const [iniciar, setIniciar] = useState(true)
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const updateCpuData = (e) =>{
        setCpuData(JSON.parse(e));
    }
    function updateVariables(){
        setSystem(cpuData.System)
        setFree(cpuData.Idle)
        setUser(cpuData.User)
    }

    const setWindowsDimensions = () => {
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    function getCPU(){
        GetCPU().then(updateCpuData)
    }
    
    useEffect(()=>{
        getCPU()
        updateVariables()
        const interval = setInterval(()=>{
            setIniciar(!iniciar)
        },1000)
    },[iniciar])


    return(
        <>  
        <div className="square bg-dark text-white rounded-pill bg-light" style=
        {{hposition:"relative",marginBottom:"1%",padding:"1%",height:"100%", width:"100%",
            backgroundColor :"blue"}}>
            <h1 ><center>Gráfica de uso</center></h1>  
            <h1>CPU</h1>
            {getCPU()}
            <div style={{position:"relative",padding:"5%",/*border:"4px dotted blue"*/}}>
                <div style={{height:"100%", /*border:"4px dotted blue"*/}}>
                    <ChartCPU 
                    sistema={Math.round(system)}
                    libre={Math.round(free)}
                    user={Math.round(user)}
                    />
                </div>
            </div>
            <div style={{paddingLeft:"10%",paddingRight:"10%"}}>
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>Sistema </th>
                            <th>Usuario </th>
                            <th>Libre </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{system? system.toFixed(4):0}</td>
                            <td>{user? user.toFixed(4):0}</td>
                            <td>{free? free.toFixed(4):0}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
        </>
    )
}
export default Cpu