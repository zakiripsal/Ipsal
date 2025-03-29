'use client';
import { UserService } from '../../../demo/service/UserService';
import { DivisionService } from '../../../demo/service/DivisionService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';

import React, { useEffect, useState } from 'react';
import type { Demo } from '@/types';

const TableDemo = () => {
    const [users1, setUsers1] = useState<Demo.User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<Demo.User[]>([]);
    const [divisions, setDivisions] = useState<Demo.Division[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        role: { value: null, matchMode: FilterMatchMode.IN },
        division: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        email: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS },
        createdBy: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        createdAT: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });
    const [loading1, setLoading1] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const statuses = ['Active', 'Inactive'];

    const clearFilter1 = () => {
        initFilters1();
        setFilteredUsers(users1);
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;
        setFilters1(_filters1);
        setGlobalFilterValue1(value);
        let filtered = [...users1];
        if (value) {
            filtered = filtered.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
        }
        setFilteredUsers(filtered);
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

    useEffect(() => {
        setLoading1(true);
    
        UserService.getUser().then((data) => {
            console.log('Users:', data); // Log data pengguna
            setUsers1(data);
            setFilteredUsers(data); // Set filtered users to initial data
            setLoading1(false);
        });
    
        DivisionService.getDivision().then((data) => {
            console.log('Divisions:', data); // Log data divisi
            setDivisions(data); // Asumsikan data diambil dari division.json
        });
    
        initFilters1();
    }, []);

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            division: { value: null, matchMode: FilterMatchMode.EQUALS },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            
            email: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS },
            createdBy: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
                createdAT: { value: null, matchMode: FilterMatchMode.DATE_IS },

        });
        setGlobalFilterValue1('');
    };

    const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
        return <Button type="button" icon="pi pi-check" onClick={() => applyFilter(options)} severity="success"></Button>;
    };

    const applyFilter = (options) => {
        options.filterApplyCallback();
        onFilter({ filters: filters1 });
    };

    const divisionBodyTemplate = (rowData) => {
        const division = rowData.division;
        return (
            <React.Fragment>
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{division}</span>
            </React.Fragment>
        );
    };

    const divisionFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={divisions.map(division => ({ label: division.divisionName, value: division.divisionName }))}
                onChange={(e) => {
                    console.log('Selected Division:', e.value); // Log nilai filter
                    options.filterCallback(e.value);
                }}
                placeholder="Select a Division"
                className="p-column-filter"
                showClear
            />
        );
    };
    const statusBodyTemplate = (rowData: Demo.User) => {
        const statusClass = rowData.status ? 'status-true' : 'status-false';
        const statusText = rowData.status ? 'Active' : 'Inactive';
        return <span className={`customer-badge ${statusClass}`}>{statusText}</span>;
    };

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => {
                    const filterValue = e.value === 'Active' ? true : false;
                    options.filterCallback(filterValue, options.index);
                }}
                itemTemplate={statusItemTemplate}
                placeholder="Select a Status"
                className="p-column-filter"
                showClear
            />
        );
    };

    const statusItemTemplate = (option: any) => {
        const statusClass = option === 'Active' ? 'status-true' : 'status-false';
        return <span className={`customer-badge ${statusClass}`}>{option}</span>;
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
    const onFilter = (e) => {
        console.log('Filters:', e.filters); // Log filter yang diterapkan
        setFilters1(e.filters);
    
        // Terapkan filter secara manual
        let filtered = [...users1];
        if (e.filters.division && e.filters.division.value) {
            filtered = filtered.filter(user => user.division === e.filters.division.value);
        }
        console.log('Filtered Users:', filtered); // Log data pengguna setelah filter diterapkan
        setFilteredUsers(filtered);
    };
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Filter Menu</h5>
                    <DataTable
                        value={filteredUsers}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="No customers found."
                        header={header1}
                        onFilter={onFilter}
                    >
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column
                            header="Division"
                            filterField="division"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            body={divisionBodyTemplate}
                            filter
                            filterElement={divisionFilterTemplate}
                            filterApply={filterApplyTemplate}
                            filterClear={filterClearTemplate}
                        />
                        <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
                        <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
                        <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                        <Column field="createdBy" header="Created By" filter filterPlaceholder="Search by created by" style={{ minWidth: '12rem' }} />
                        <Column field="createdAT" header="Created By" filter filterPlaceholder="Search by created by" dataType="date" style={{ minWidth: '12rem' }} />

                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;