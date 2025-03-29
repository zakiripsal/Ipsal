'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";

import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { DivisionService } from '../../../demo/service/DivisionService';


const DivisionTable = () => {
    let emptyDivision: Demo.Division = {
        id: '',
        divisionName: '',
        createdBy: '',
        createdAt: '',
        statusActive: false
    };

    const [divisions, setDivisions] = useState<Demo.Division[]>([]); // Initialize with an empty array
    //const dt = useRef(null);
    const [divisionDialog, setDivisionDialog] = useState(false);
    const [deleteDivisionDialog, setDeleteDivisionDialog] = useState(false);
    const [deleteDivisionsDialog, setDeleteDivisionsDialog] = useState(false);

    const [selectedDivisions, setSelectedDivisions] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [division, setDivision] = useState<Demo.Division>(emptyDivision);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [switchValue, setSwitchValue] = useState(false);


    useEffect(() => {
        DivisionService.getDivision().then((data) => setDivisions(data as Demo.Division[]));
    }, []);

    const [globalFilter, setGlobalFilter] = useState('');

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < divisions.length; i++) {
            if (divisions[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };


    const exportCSV = () => {
        dt.current?.exportCSV();
    };


    const openNew = () => {
        setDivision(emptyDivision);
        setSubmitted(false);
        setDivisionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDivisionDialog(false);
    };

    const hideDeleteDivisionDialog = () => {
        setDeleteDivisionDialog(false);
    };

    const hideDeleteDivisionsDialog = () => {
        setDeleteDivisionsDialog(false);
    };

    //button action save
    const saveProduct = () => {
        setSubmitted(true);

        if (division.divisionName.trim()) {
            console.log("Nama divisi tidak kosong");

            let _divisions = [...(divisions as any)];
            let _division = { ...division };
            if (division.id) {
                console.log("Mengedit divisi dengan ID:", division.id);

                const index = findIndexById(division.id);
                _divisions[index] = _division;
                console.log("Divisi diperbarui pada indeks:", index);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                    
                });

            } else {
                _division.id = createId();
                // _product.image = 'product-placeholder.svg';
                // _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setDivisions(_divisions as any);
            setDivisionDialog(false);
            setDivision(emptyDivision);
        }
    };

    //button action edit
    const editDivision = (division: Demo.Division) => {

        setDivision({ ...division });
        setDivisionDialog(true);
    };


    
  


    const confirmDeleteDivision = (division: Demo.Division) => {
        setDivision(division);
        setDeleteDivisionDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteDivisionsDialog(true);
    };

    const deleteSelectedDivisions = () => {
        let _divisions = (divisions as any)?.filter((val: any) => !(selectedDivisions as any)?.includes(val));
        setDivisions(_divisions);
        setDeleteDivisionsDialog(false);
        setSelectedDivisions(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const deleteDivision = () => {
        let _divisions = (divisions as any)?.filter((val: any) => val.id !== division.id);
        setDivisions(_divisions);
        setDeleteDivisionDialog(false);
        setDivision(emptyDivision);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const val = (e.target && e.target.value) || '';
        let _division = { ...division };
        _division[field] = val;
    
        setDivision(_division);
    };

    const onStatusChange = (e: InputSwitchChangeEvent) => {
        setSwitchValue(e.value);
        let _division = { ...division };
        _division.statusActive = e.value;
        setDivision(_division);
    };
    
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDivisions || !(selectedDivisions as any).length} />
                </div>
            </React.Fragment>
        );
    };

    
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Division) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDivision(rowData)} />
               <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteDivision(rowData)} />
            </>
        );
    };

    //judul header
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Divisions</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    //button save and cancel
    const divisionDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );


    const deleteDivisionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDivisionDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteDivision} />
        </>
    );
    const deleteDivisionsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDivisionsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedDivisions} />
        </>
    );

    const statusBodyTemplate = (rowData : Demo.Division) => {
        return rowData.statusActive ? 'Active' : 'Inactive';
    };
    
    const updateStatusActive = (id: string, newStatus: boolean) => {
        const updatedDivisions = divisions.map(division => 
            division.id === id ? { ...division, statusActive: newStatus } : division
        );
        setDivisions(updatedDivisions);
    };
    
    return (
        <div className="grid division">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}> </Toolbar>

            <DataTable
                ref={dt}
                value={divisions}
                selection={selectedDivisions}
                onSelectionChange={(e) => setSelectedDivisions(e.value as any)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} divisions"
                globalFilter={globalFilter}
                emptyMessage="No divisions found."
                header={header}
                responsiveLayout="scroll"
            >
                {/* field  */}
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column> 
                <Column field="divisionName" filter filterPlaceholder="Search by division" header="Division Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                <Column field="createdBy" filter filterPlaceholder="Search by created By"  header="Created By" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                <Column field="createdAT" header="Created At" filter filterPlaceholder="Search by created At" dataType="date" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                {/* <Column field="statusActive" header="Status" sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                <Column field="statusActive" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>

                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>

            </DataTable>

            {/* popup action */}
            <Dialog visible={divisionDialog} style={{ width: '450px' }} header="Division Details" modal className="p-fluid" footer={divisionDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={division.divisionName}
                                onChange={(e) => onInputChange(e, 'divisionName')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !division.divisionName
                                })}
                            />
                            {submitted && !division.divisionName && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="status">Status Active</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <InputSwitch
                                    id='status'
                            
                                    checked={switchValue}
                                   // onChange={(e) => setSwitchValue(e.value ?? false)}
                                   onChange={onStatusChange}

                                    />
                            </div>
                         </div>
                   
                    
                    </Dialog>

                    <Dialog visible={deleteDivisionDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDivisionDialogFooter} onHide={hideDeleteDivisionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {division && (
                                <span>
                                    Are you sure you want to delete Division <b>{division.divisionName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDivisionsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDivisionsDialogFooter} onHide={hideDeleteDivisionsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {division && <span>Are you sure you want to delete the selected Division?</span>}
                        </div>
                    </Dialog>
        </div>
        </div>
        </div>

    );
};

export default DivisionTable;
