import React, { useState, useEffect, useRef } from "react";
import { DataTable, DataTableSelectionChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { ProductService } from "../service/ProductService";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import 'primeicons/primeicons.css';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

    const op = useRef<OverlayPanel>(null!);

    const [value, setValue] = useState<string>("");

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    const handleSelectionChange = (e: DataTableSelectionChangeEvent) => {
        setSelectedProducts(e.value);
    };

    return (
        <div className="card">
            <div className="flex justify-content-center align-items-center mb-4 gap-2">
                <InputSwitch
                    inputId="input-rowclick"
                    checked={rowClick}
                    onChange={(e: InputSwitchChangeEvent) =>
                        setRowClick(e.value!)
                    }
                />
                <label htmlFor="input-rowclick">Row Click</label>
            </div>
            <Button
                text
                rounded
                type="button"
                icon="pi pi-chevron-down"
                onClick={(e) => op.current.toggle(e)} />
            <OverlayPanel ref={op}>
                <InputText
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue(e.target.value)
                    }
                />
                <Button label="Submit" />
            </OverlayPanel>
            <DataTable
                value={products}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                selection={selectedProducts}
                selectionMode={rowClick ? "single" : "multiple"}
                onSelectionChange={handleSelectionChange}
                dataKey="id"
                tableStyle={{ minWidth: "50rem" }}>
                {!rowClick && (
                    <Column
                        selectionMode="multiple"
                        headerStyle={{ width: "3rem" }}></Column>
                )}
                <Column ></Column>
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
        </div>
    );
}
