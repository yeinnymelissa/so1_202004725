import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/home/Home'
import { Tabla } from '../pages/tabla/Tabla'
import { Historial } from '../pages/historial/Historial'

export const Mainrouter = () => {
    return <BrowserRouter><Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='/historial' element={<Historial/>} />
        <Route exact path='/tabla/:huevo' element={<Tabla/>} />
    </Routes></BrowserRouter>
}