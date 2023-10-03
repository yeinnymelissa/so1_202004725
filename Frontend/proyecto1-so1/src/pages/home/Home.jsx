import { useState, useEffect, Fragment } from "react"
import axios from "axios";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Navbar } from "../navbar/Navbar";
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import './home.scss'
import { useQuery } from "react-query";

export const Home = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    const [expandedRows, setExpandedRows] = useState(null);
    const { data } = useQuery("cpu", async () => {
        const { data } = await axios.post(
            'http://localhost:3000/so1/buscarCpu', {
            "ip": "35.232.81.75"
        }
        );
        return data;
    },
        {
            refetchInterval: 60000,
            initialData: {}
        })

    const { data: ram } = useQuery("ram", async () => {
        const { data } = await axios.post(
            'http://localhost:3000/so1/buscarRam', {
            "ip": "35.232.81.75"
        }
        );
        return data;
    },
        {
            refetchInterval: 60000,
            initialData: {}
        })

    const { data:info } = useQuery("info", async () => {
        const { data } = await axios.post(
            'http://localhost:3000/so1/buscarProcesos', {
            "ip": "35.232.81.75"
        }
        );
        return data;
    },
        {
            refetchInterval: 60000,
            initialData: {}
        })
        

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const porcentajeRam = ram?.PORCENTAJE || 100

    const chartDataRam = {
        labels: ['En uso', 'Libre'],
        datasets: [
            {
                data: [porcentajeRam, (100 - porcentajeRam)],
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--blue-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--red-400'),
                    documentStyle.getPropertyValue('--blue-400')
                ]
            }
        ]
    };
    const [chartOptionsRam, setChartOptionsRam] = useState({
        plugins: {
            title: {
                display: true,
                text: 'RAM',
                font: {
                    size: 28
                }
            },
            legend: {
                display: false,
                labels: {
                    usePointStyle: false
                }
            }
        }
    });

    const porcentaje = data?.PORCENTAJE || 100

    const chartDataCpu = {
        labels: ['En uso', 'Libre'],
        datasets: [
            {
                data: [porcentaje, (100 - porcentaje)],
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--blue-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--red-400'),
                    documentStyle.getPropertyValue('--blue-400')
                ]
            }
        ]
    };
    const [chartOptionsCpu, setChartOptionsCpu] = useState({
        plugins: {
            title: {
                display: true,
                text: 'CPU',
                font: {
                    size: 28
                }
            },
            legend: {
                display: false,
                labels: {
                    usePointStyle: false
                }
            }
        }
    });

    const [maquinaActual, setMaquinaActual] = useState(null);
    const maquinas = [
        { name: 'Máquina 1', code: '1' },
        { name: 'Máquina 2', code: '2' },
        { name: 'Máquina 3', code: '3' },
        { name: 'Máquina 4', code: '4' }
    ];

    const procesos = Object.entries(info).length === 0 ? [] : info;

    const [globalFilterValue, setGlobalFilterValue] = useState('');


    useEffect(() => {
        const options = {
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
            }
        };
        setChartOptionsRam(options);
        const optionsCpu = {
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
            }
        };
        setChartOptionsCpu(optionsCpu);
    }, []);

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        })
    }

    const cambiarMaquina = (maquina) => {
        setMaquinaActual(maquina);

        const data = {
            labels: ['En uso', 'Libre'],
            datasets: [
                {
                    data: [45, 55],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--blue-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--red-400'),
                        documentStyle.getPropertyValue('--blue-400')
                    ]
                }
            ]
        }
        const options = {
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
            }
        };

        setChartDataRam(data);
        setChartOptionsRam(options);

        const dataCpu = {
            labels: ['En uso', 'Libre'],
            datasets: [
                {
                    data: [65, 35],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--blue-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--red-400'),
                        documentStyle.getPropertyValue('--blue-400')
                    ]
                }
            ]
        }
        const optionsCpu = {
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
            }
        };

        setChartDataCpu(dataCpu);
        setChartOptionsCpu(optionsCpu);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <Fragment>
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => borrarProceso(rowData)} />
            </Fragment>
        );
    };

    const borraBodyTemplate = (rowData) => {
        return (
            <Fragment>
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => borrarHijoProc(rowData)} />
            </Fragment>
        );
    };

    const borrarHijoProc = async (proc) => {
        const { data } = await axios.post(
            'http://localhost:3000/so1/kill', {
            "ip": "35.232.81.75",
            "pid": proc.PID
        }
        );
        return data;
    };

    const borrarProceso = async (proc) => {
        const { data } = await axios.post(
            'http://localhost:3000/so1/kill', {
            "ip": "35.232.81.75",
            "pid": proc.PID_PROC
        }
        );
        return data;
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div>
        );
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const header = renderHeader();

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <DataTable value={data.HIJOS}>
                    <Column field="PID" header="PID"></Column>
                    <Column field="NOMBRE" header="Nombre"></Column>
                    <Column body={borraBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>
        );
    };

    const allowExpansion = (rowData) => {
        return rowData.HIJOS.length > 0;
    }

    return <>
        <Navbar />
        <div className="container mt-3">
            <div className="container graficas-pie">
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-3 justify-content-center">
                        <Chart type="pie" data={chartDataRam} options={chartOptionsRam} className="md:w-30rem graficas center-block" />
                    </div>
                    <div className="col-3 justify-content-center">
                        <Chart type="pie" data={chartDataCpu} options={chartOptionsCpu} className="md:w-30rem graficas center-block" />
                    </div>
                    <div className="col-3"></div>
                </div>
                <br />
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
                <br />
                <div className="row">
                    <div className="card">
                        <DataTable value={procesos} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} dataKey="PID_PROC" filters={filters}
                            globalFilterFields={['PID_PROC', 'NOMBRE', 'USUARIO', 'ESTADO']} rowExpansionTemplate={rowExpansionTemplate} header={header} emptyMessage="No se encontraron resultados.">
                            <Column expander={allowExpansion} style={{ width: '5rem' }} />
                            <Column field="PID_PROC" header="PID"></Column>
                            <Column field="NOMBRE" header="Nombre"></Column>
                            <Column field="USUARIO" header="Usuario"></Column>
                            <Column field="ESTADO" header="Estado"></Column>
                            <Column field="RAM" header="%RAM"></Column>
                            <Column body={actionBodyTemplate} exportable={false}></Column>
                        </DataTable>
                    </div>
                </div>
                <br />
                <br />
            </div>
        </div>
    </>

}