import {useState, useEffect} from 'react';
import { Button, Table, Form , Modal} from 'react-bootstrap';
import {GetEstadoPuertos, ActivarPuerto, DesactivarPuerto,
    InitBitacora, EscribirLog, ActivarPuertos,DesactivarPuertos, EscribirLogPc} 
    from "../../wailsjs/go/main/App"



const Usb = () => {
    const [credenciales, setCredenciales] = useState({
        usuario: "admin",
        pass: "admin"
    })
    const [usuario, setUsuario] = useState("")
    const [pass, setPass] = useState("")
    const [logueado, setLogueado] = useState(false)
    const [ultimaOP, setUltimaOP] = useState("nada")
    /*MODAL*/
    const [show, setShow] = useState(false)
    const [puertos, setPuertos] = useState({})
    /*Intervalos de tiempo*/
    const [count,setCount] = useState(0)
    const [intervalId, setIntervalId] = useState(null)
    /*Intervalo de tiempo 2 */
    const [count2,setCount2] = useState(0)
    const [intervalId2, setIntervalId2] = useState(null)
    /*
    const [puertos, setPuertos] = useState({
        uno:true,
        dos:true,
        tres:false
    })
    */

    function getPuertos(){
        GetEstadoPuertos().then(updatePuertos)
    }

    function activarPuerto(puerto){
        ActivarPuerto(puerto).then(updateUltimoOP)
    }
    function desactivarPuerto(puerto){
        DesactivarPuerto(puerto).then(updateUltimoOP)
    }
    function activarPuertos(){
        ActivarPuertos().then(updateUltimoOP)
    }
    function desactivarPuertos(){
        DesactivarPuertos().then(updateUltimoOP)
    }
    function initBitacora(){
        InitBitacora().then(updateUltimoOP)
    }
    function escribirLog(){
        EscribirLog().then(updateUltimoOP)
    }
    function escribirLogPc(){
        EscribirLogPc().then(updateUltimoOP)
    }

    const updatePuertos = (e) =>{
        setPuertos(JSON.parse(e));
    }

    const updateUltimoOP = (e) =>{
        setUltimaOP(e)
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("Se esta tratando de iniciar sesión")
        validarCredenciales()
        if (!logueado){
            setUsuario("")
            setPass("")
            handleShow()
        }
    }
    const handleUsuario = (e)=>{
        setUsuario(e.target.value)
    }
    const handlePass = (e)=>{
        setPass(e.target.value)
    }
    const validarCredenciales = ()=>{
        setLogueado(usuario === credenciales.usuario && pass === credenciales.pass)
    }

    const handlePortState = (puerto,estado)=>{
        if (estado){
            desactivarPuerto(puerto)
        }else{
            activarPuerto(puerto)
        }
        setPuertos({
            ...puertos,
            [puerto]:!estado
        })
    }

    const handleBitacora = ()=>{
        escribirLog()
        
    }

    useEffect(()=>{
        const id = setInterval(()=>{
            setCount(prevCount => prevCount + 1)
            getPuertos()
            initBitacora()
            escribirLogPc()
            for (let i = 1;i<50;i++){}
            handleBitacora()
        },1000)
        
        return () => clearInterval(id);
    },[])

    return(
        <div className="formulario-padre">  
        <div className='formulario'>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" placeholder="Ingresar usuario"
                    value={usuario} onChange={handleUsuario} 
                    disabled={logueado}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Contraseña" 
                    value={pass} onChange={handlePass}
                    disabled={logueado}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                </Form.Group>
                <Button variant="primary" type="submit" disabled={logueado}>
                    Validar
                </Button>
            </Form>
        </div>
          {/*JSON.stringify(puertos)*/}
          {/*"El ultimo resultado es:" + ultimaOP*/}
        <div className='formulario'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Puerto</th>
                    <th>Estado</th>
                    <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(puertos).map(([key,value])=>{
                        return(
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{value?"Activado":"Desactivado"}</td>
                            <td>
                            <Button variant={value?"danger":"success"}
                            onClick={()=> handlePortState(key,value)}
                            disabled={!logueado}>
                                {value?"Desactivar":"Activar"}</Button>{' '}
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
        <div className='formulario'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Bitacora</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Button variant="success"
                            onClick={handleBitacora}
                            disabled={true}>
                            Generando bitácora</Button>{' '}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Ruta ./
                        </td>
                    </tr>
                </tbody>
            </Table>            
        </div>







        <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
            <Modal.Title>Inicio de sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body>{logueado? "Inicio de sesión correcto": 
            "Usuario o contraseña incorrectos"}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Aceptar
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}
export default Usb