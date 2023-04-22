import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import Navegador from './layouts/Navegador';
import { BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Cpu from './components/Cpu.jsx'
import Home from './components/Home'
import Disco from './components/Disco'
import RAM from './components/Ram'
import Usb from './components/Usb'

export default function App() {

    return (
        <>
            <BrowserRouter>
            <Routes>
            <Route path='/' element={ <Navegador /> }>
            <Route path='/home' element={ <Home /> } /> 
            <Route path='cpu' element={ <Cpu /> } />
            <Route path='disco' element={ <Disco /> } />
            <Route path='ram' element={ <RAM /> } />
            <Route path='usb' element={ <Usb /> } />
            </Route>
            </Routes> 
            </BrowserRouter>
        </>
    )
}

