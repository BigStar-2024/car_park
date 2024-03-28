
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { DataItem } from '../types';
import HtmlTooltip from './HtmlToolTip';

export default function MyLotsTable() {

    const [dataArr, setDataArr] = useState<DataItem[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const fetchData = async () => {
        const { data } = await axios.get(`/data`)
        setDataArr(data)
        if (autoUpdate) {
            timeoutRef.current = setTimeout(fetchData, 30000)
        }
    }
    useEffect(() => {
        fetchData()
        return () => clearTimeout(timeoutRef.current || undefined)
    }, [])
    const plateNumberBody = (product: DataItem) => {
        return <>
            <HtmlTooltip
                title={
                    <>
                        <div className=''>
                            <span className="text-xl text-black">(Blue Toyota)</span>
                            {/* TODO: Remove */}
                            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle}`} />
                        </div>
                    </>
                }
            >
                <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.plate}`} />
            </HtmlTooltip>
        </>;
    };
    const vehicleBody = (product: DataItem) => {
        return <>

            <HtmlTooltip
                title={
                    <>
                        <div className=''>
                            <span className="text-xl text-black">(Blue Toyota)</span>
                            {/* TODO: Remove */}
                            <img src={`${import.meta.env.VITE_API_BACKEND_URL}public/${product.vehicle}`} />
                        </div>
                    </>
                }
            >
                <span className={`underline text-blue-500 cursor-pointer`}> (Blue Toyota) </span>
            </HtmlTooltip>
        </>;
    };
    const [autoUpdate, setAutoUpdate] = useState(true);
    return (
        <div className="p-2 bg-white rounded-lg w-full">
            <div className='flex justify-end items-center pr-10 py-2'>
                <div className='flex items-center rounded-md border border-[#ccc] text-xs overflow-visible'>
                    <button className='p-2 border-r border-[#ccc] hover:bg-[#f8f8f8] rounded-tl-md rounded-bl-md'>&laquo;Newer</button>
                    <button className='flex items-center p-2 border-r border-[#ccc] hover:bg-[#f8f8f8] relative group'>
                        Options
                        <svg className='w-3 h-3'><use href="#svg-arrow-down" /></svg>
                        <div className='absolute top-8 -left-1 w-40 z-10 p-1 hidden group-hover:block'>
                            <div className='bg-white rounded-md border border-[#ccc] shadow-lg pl-1'>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />
                                    }
                                    label="Auto-Update"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 20 },
                                        '& .MuiFormControlLabel-label': { fontSize: 14 },
                                    }}
                                />
                            </div>
                        </div>
                    </button>
                    <button className='p-2 hover:bg-[#f8f8f8] rounded-tr-md rounded-br-md'>Older&raquo;</button>
                </div>
                <div className='p-2'><img className='w-4 h-4 loading-icon' src='/loading.png' /></div>
            </div>
            <DataTable
                // paginator rows={5} pageLinkSize={2} rowsPerPageOptions={[1, 10, 25, 50]}
                value={dataArr} tableStyle={{ minWidth: '50rem' }}>
                <Column field="lot" header="Lot name" sortable style={{ width: '10%' }}></Column>
                <Column field="camera" header="Camera" sortable style={{ width: '10%' }}></Column>
                <Column field="plateNumber" header="Plate number" sortable style={{ width: '10%' }}></Column>
                <Column field="plate" header="" body={plateNumberBody} style={{ width: '10%' }}></Column>
                <Column field="vehicle" header="Vehicle" body={vehicleBody} sortable style={{ width: '20%' }}></Column>
                <Column field="direction" header="Direction" body={
                    (item: DataItem) => <span className={`pi ${item.direction.trim().toLowerCase() === "enter" ? "pi-arrow-up-right" : "pi-arrow-down-left"}`}></span>
                } sortable style={{ width: '10%' }}></Column>
                <Column header="Entry" body={(item: DataItem) =>
                    <>
                        {item.direction.trim().toLowerCase() === "enter" &&
                            <span>{new Date(item.time).toLocaleString("en-us")}</span>}
                    </>
                } sortable style={{ width: '15%' }}></Column>
                <Column header="Exit" body={(item: DataItem) =>
                    <>
                        {item.direction.trim().toLowerCase() !== "enter" &&
                            <span>{new Date(item.time).toLocaleString("en-us")}</span>}
                    </>
                } sortable style={{ width: '15%' }}></Column>
            </DataTable>
        </div>
    );
}

