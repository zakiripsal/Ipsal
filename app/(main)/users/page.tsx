'use client';
import { Button } from 'primereact/button';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";

import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { UserService } from '../../../demo/service/UserService';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

interface InputValue {
    name: string;
    code: string;
}

const UserTable = () => {
    let emptyUser: Demo.User = {
        id: '',
        name: '',
        image:'',
        role: '',
        division:'',
        email:'',
        verified: false,
        password:'',
        messages: [],
        lastSeen: '',
        status: false,
        createdBy: '',
        createdAt: ''

    };

    const [users, setUsers] = useState<Demo.User[]>([]); // Initialize with an empty array
    //const dt = useRef(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = useState<Demo.User>(emptyUser);
    const toast = useRef<Toast>(null);
    // const dt = useRef<DataTable<any>>(null);
    const dt = useRef<DataTable<any>>(null);


    const [switchValue, setSwitchValue] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);

    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading2, setLoading2] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    
    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ]; 
    

    // useEffect(() => {
    //     setLoading1(true);
    //     UserService.getUser().then((data) => 
    //     setUsers(data as Demo.User[]));
    //     setLoading1(false);

    //     initFilters1();

    // }, []);

    useEffect(() => {
        setLoading1(true);
        UserService.getUser().then((data) => {
            setUsers(data);
            setLoading1(false);
        });

        initFilters1();
    }, []);

    const [globalFilter, setGlobalFilter] = useState('');

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };


    const clearFilter1 = () => {
        initFilters1();
    };

    const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

  


    const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };
    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };
    
    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.IN }]
            }
            // 'country.name': {
            //     operator: FilterOperator.AND,
            //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            // },
            // representative: { value: null, matchMode: FilterMatchMode.IN },
            // date: {
            //     operator: FilterOperator.AND,
            //     constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            // },
            // balance: {
            //     operator: FilterOperator.AND,
            //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            // },
            // status: {
            //     operator: FilterOperator.OR,
            //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            // },
            // activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const dropdownValues: InputValue[] = [
        { name: "User", code: "AG" },
        { name: "Super User", code: "SAG" },
        { name: "Supervisor", code: "SPV" },
        { name: "Manager", code: "MGR" },
        { name: "Admin", code: "ADM" },
    ];

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
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
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };
    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };



    //button action save
    const saveProduct = () => {
        setSubmitted(true);

        if (user.name.trim()) {
            console.log("Nama divisi tidak kosong");

            let _users = [...(users as any)];
            let _user = { ...user };
            if (user.id) {
                console.log("Mengedit divisi dengan ID:", user.id);

                const index = findIndexById(user.id);
                _users[index] = _user;
                console.log("Divisi diperbarui pada indeks:", index);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                    
                });

            } else {
                _user.id = createId();
                // _product.image = 'product-placeholder.svg';
                // _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setUsers(_users as any);
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    //button action edit
    const editUser = (user: Demo.User) => {

        setUser({ ...user });
        setUserDialog(true);
    };


    
  


    const confirmDeleteUser = (user: Demo.User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    

    const deleteUser = () => {
        let _users = (users as any)?.filter((val: any) => val.id !== user.id);
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const deleteSelectedUsers = () => {
        let _users = (users as any)?.filter((val: any) => !(selectedUsers as any)?.includes(val));
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[field] = val;
    
        setUser(_user);
    };

    const onStatusChange = (e: InputSwitchChangeEvent) => {
        setSwitchValue(e.value);
        let _user = { ...user };
        _user.statusActive = e.value;
        setUser(_user);
    };
    

    const userBodyTemplate = (rowData: Demo.User) => {
        //const user = rowData.user;
        return (
            <React.Fragment>
                <img
                    alt={rowData.name}
                    src={`/demo/images/avatar/${rowData.image}`}
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.name}</span>
            </React.Fragment>
        );
    };

    const headerTemplate = (data: Demo.User) => {
        return (
            <React.Fragment>
                <img alt={data.user.name} src={`/demo/images/avatar/${data.user.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span className="font-bold ml-2">{data.user.name}</span>
            </React.Fragment>
        );
    };

    // const userFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     console.log('Filter options:', options);
    //     return (
    //         <>
    //             <div className="mb-3 text-bold">User Picker</div>
    //             <MultiSelect
    //                 value={options.value}
    //                 options={users}
    //                 itemTemplate={usersItemTemplate}
    //                 onChange={(e) => {
    //                     console.log('Selected value:', e.value);
    //                     options.filterCallback(e.value);
    //                 }}
    //                 optionLabel="name"
    //                 placeholder="Any"
    //                 className="p-column-filter"
    //             />
    //         </>
    //     );
    // };


     const userFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <>
                <div className="mb-3 text-bold">User Picker</div>
                <MultiSelect
                    value={options.value}
                    options={users}
                    itemTemplate={usersItemTemplate}
                    onChange={(e) => {
                        console.log('Selected value:', e.value);
                        options.filterCallback(e.value);
                    }}
                    optionLabel="name"
                    placeholder="Any"
                    className="p-column-filter"
                />
            </>
        );
    };

    
    

    const usersItemTemplate = (option: any) => {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`/demo/images/avatar/${option.image}`} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{option.name}</span>
            </div>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !(selectedUsers as any).length} />
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

    const actionBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
               <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    //judul header
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    //button save and cancel
    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );


    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedUsers} />
        </>
    );

    const statusBodyTemplate = (rowData : Demo.User) => {
        return rowData.statusActive ? 'Active' : 'Inactive';
    };
    
    const updateStatusActive = (id: string, newStatus: boolean) => {
        const updatedUsers = users.map(user => 
            user.id === id ? { ...user, statusActive: newStatus } : user
        );
        setUsers(updatedUsers);
    };


    const verifiedBodyTemplate = (rowData: Demo.User) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': rowData.verified,
                    'text-pink-500 pi-times-circle': !rowData.verified
                })}
            ></i>
        );
    };

    const verifiedFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };
    const header1 = renderHeader1();
    return (
        <div className="grid user">
            <div className="col-12">
                
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}> </Toolbar>

            <DataTable
                ref={dt}
                value={users}
                selection={selectedUsers}
                onSelectionChange={(e) => setSelectedUsers(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                globalFilter={globalFilter}
                emptyMessage="No users found."
                header={header1}
                responsiveLayout="scroll"
                showGridlines
                filters={filters1}
                filterDisplay="menu"
                loading={loading1}
                
            >
                {/* field  */}
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column> 
                
                {/* <Column field="name" header="Name" filter filterPlaceholder="Search by name"  sortable headerStyle={{ minWidth: '15rem' }}></Column> */}

                <Column
                            header="Name"
                            filterField="name"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            body={userBodyTemplate}
                            filter
                            filterElement={userFilterTemplate}
                        />
                {/* <Column field="image" header="Image" sortable headerStyle={{ minWidth: '15rem' }}></Column> */}
                <Column field="role"  header="Role" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="division" header="Division" sortable headerStyle={{ minWidth: '11rem' }}></Column>
                <Column field="email" header="Email" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                {/* <Column field="verified" header="Verified" sortable headerStyle={{ minWidth: '15rem' }}></Column> */}
                <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                <Column field="statusActive" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>

                <Column field="createdBy" header="Created By" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                <Column field="createdAT" header="Created At" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                {/* <Column field="statusActive" header="Status" sortable headerStyle={{ minWidth: '10rem' }}></Column> */}

                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>

            </DataTable>

            {/* popup action */}
            <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={user.userName}
                                onChange={(e) => onInputChange(e, 'userName')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !user.userName
                                })}
                            />
                            {submitted && !user.userName && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="role">Role</label>
                            <Dropdown
                                value={dropdownValue}
                                onChange={(e) => setDropdownValue(e.value)}
                                options={dropdownValues}
                                optionLabel="name"
                                placeholder="Select"

                                className={classNames({
                                    'p-invalid': submitted && !user.userRole
                                })}
                            />
                            {submitted && !user.userRole && <small className="p-invalid">Role is required.</small>}
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

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Are you sure you want to delete User <b>{user.userName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete the selected User?</span>}
                        </div>
                    </Dialog>
        </div>
        </div>
        </div>

    );
};

export default UserTable;
