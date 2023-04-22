
import { Navbar, Nav, Container, Table } from "react-bootstrap"
import { Outlet, Link } from "react-router-dom"

function Navegador() {
  return (
    <>    
    <Navbar className="navBg" variant="dark" expand="lg">
     <Container>
         <Navbar.Brand as={Link} to="/" >Navegador</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
         <Nav className="me-auto">
             <Nav.Link as={Link} to="/home" >About</Nav.Link>
             <Nav.Link as={Link} to="/cpu">Cpu</Nav.Link>
             <Nav.Link as={Link} to="/disco">Disco</Nav.Link>     
             <Nav.Link as={Link} to="/ram">Ram</Nav.Link>  
             <Nav.Link as={Link} to="/usb">Usb</Nav.Link>            
         </Nav>
         </Navbar.Collapse>
     </Container>
     </Navbar>  
     <section>
         <Outlet></Outlet>
     </section>     
    </> 
  )
}

export default Navegador