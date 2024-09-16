import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTablePageEvent, DataTableSelectionChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";

interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    category?: string;
    quantity?: number;
    inventoryStatus?: string;
    rating?: number;
}

export default function CheckboxRowSelectionDemo() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<
        Product[] | Product | null
    >(null);
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    
    const op = useRef<OverlayPanel>(null!);
    const [value, setValue] = useState<string>("");
    
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const rowsPerPage = 12; 

    const fetchApiData = async (page: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            const data = response.data.data;

            const mappedProducts = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                place_of_origin: item.place_of_origin,
                artist_display: item.artist_display,
                date_start: item.date_start,
                date_end: item.date_end,
            }));

            setTotalRecords(response.data.pagination.total); 
            setProducts(mappedProducts); 
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiData(1); 
    }, []);

    const handlePageChange = (event: DataTablePageEvent) => {
        const page = event.page + 1; 
        fetchApiData(page); 
    };

    const handleSelectionChange = (e: DataTableSelectionChangeEvent) => {
        setSelectedProducts(e.value);
    };

    return (
        <div className="card">
            <div className="flex justify-content-center align-items-center mb-4 gap-2">
                <InputSwitch
                    inputId="input-rowclick"
                    checked={rowClick}
                    onChange={(e: InputSwitchChangeEvent) => setRowClick(e.value!)}
                />
                <label htmlFor="input-rowclick">Row Click</label>
            </div>
            <Button
                text
                rounded
                type="button"
                icon="pi pi-chevron-down"
                onClick={(e) => op.current.toggle(e)}
            />
            <OverlayPanel ref={op}>
                <InputText
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                />
                <Button label="Submit" />
            </OverlayPanel>

            {loading ? (
                <div className="flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
            ) : (
                <DataTable
                    value={products}
                    paginator
                    rows={rowsPerPage}
                    totalRecords={totalRecords}
                    lazy
                    onPage={handlePageChange} // Handle page change event
                    selection={selectedProducts} // Pass selected products to DataTable
                    selectionMode={rowClick ? "single" : "multiple"} // Single or multiple selection based on InputSwitch
                    onSelectionChange={handleSelectionChange} // Handle row selection change
                    dataKey="id"
                    tableStyle={{ minWidth: "50rem" }}
                >
                    {!rowClick && (
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                    )}
                    <Column field="title" header="Title"></Column>
                    <Column field="place_of_origin" header="Place of Origin"></Column>
                    <Column field="artist_display" header="Artist"></Column>
                    <Column field="date_start" header="Date Start"></Column>
                    <Column field="date_end" header="Date End"></Column>
                </DataTable>
            )}
        </div>
    );
}
