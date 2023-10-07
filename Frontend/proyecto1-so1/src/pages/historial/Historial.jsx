import { useState, useEffect, Fragment } from "react"
import axios from "axios";
import { Navbar } from "../navbar/Navbar";
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';

export const Historial = () => {
    const [cpuData, setcpuData] = useState({});
    const [cpuOptions, setcpuOptions] = useState({});
    const [ramData, setramData] = useState({});
    const [ramOptions, setramOptions] = useState({});
    const [maquinaActual, setMaquinaActual] = useState(null);
    const maquinas = [
        { name: 'Máquina 1', code: '1' },
        { name: 'Máquina 2', code: '2' },
        { name: 'Máquina 3', code: '3' },
        { name: 'Máquina 4', code: '4' }
    ];

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        axios.get("http://localhost:3000/so1/historial/cpu").then((response) => {
            let arregloCpu = []
            response.data.forEach(element => {
                arregloCpu.push(element.PORCENTAJE)
            });

            const data = {
                labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                datasets: [
                    {
                        label: 'Historial',
                        data: arregloCpu,
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--blue-500'),
                        tension: 0.6
                    }
                ]
            };
            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    title: {
                        display: true,
                        text: 'CPU',
                        font: {
                            size: 28
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };
    
            setcpuData(data);
            setcpuOptions(options);
        });
        



        axios.get("http://localhost:3000/so1/historial/ram").then((response) => {
            let arregloRam = []
            response.data.forEach(element => {
                arregloRam.push(element.PORCENTAJE)
            });


            const dataRam = {
                labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                datasets: [
                    {
                        label: 'Historial',
                        data: arregloRam,
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--blue-500'),
                        tension: 0.6
                    }
                ]
            };


            const optionsRam = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    title: {
                        display: true,
                        text: 'RAM',
                        font: {
                            size: 28
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };

            setramData(dataRam);
            setramOptions(optionsRam);
        });


    }, []);

    const cambiarMaquina = (maquina) => {
        setMaquinaActual(maquina);
    }

    return <>
        <Navbar />
        <div className="container mt-5">
            <div className="row mt-3">
                <div className="col-3"></div>
                <div className="col-6 justify-content-center">
                    <span className="p-float-label">
                        <Dropdown value={maquinaActual} onChange={(e) => cambiarMaquina(e.value)} options={maquinas} optionLabel="name"
                            style={{ width: '100%' }} placeholder="Seleccione una máquina" className="w-full md:w-14rem centrar" />
                        <label htmlFor="dd-city">Maquina Actual</label>
                    </span>
                </div>
                <div className="col-3"></div>
            </div>
            <br />
            <div className="row">

                <div className="card col-12 mt">
                    <Chart type="line" data={ramData} options={ramOptions} />
                </div>
            </div>
            <br />
            <div className="row">
                <div className="card col-12 mt">
                    <Chart type="line" data={cpuData} options={cpuOptions} />
                </div>
            </div>
            <br />
            <br />
        </div>
    </>

}