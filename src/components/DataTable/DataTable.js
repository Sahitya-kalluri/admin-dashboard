// src/components/DataTable/DataTable.js
import React, { useState, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./DataTable.css";

// Status badge cell renderer
function StatusBadge({ value }) {
  const map = {
    Active: "badge badge-success",
    Inactive: "badge badge-neutral",
    Completed: "badge badge-success",
    Pending: "badge badge-warning",
    Processing: "badge badge-info",
    Cancelled: "badge badge-danger",
  };
  return <span className={map[value] || "badge badge-neutral"}>{value}</span>;
}

// Role badge cell renderer
function RoleBadge({ value }) {
  const map = {
    Admin: "badge badge-danger",
    Editor: "badge badge-info",
    Viewer: "badge badge-neutral",
  };
  return <span className={map[value] || "badge badge-neutral"}>{value}</span>;
}

// Action buttons cell renderer
function ActionButtons({ data, onDelete }) {
  return (
    <div className="action-btns">
      <button className="btn-action edit" title="Edit">✏️</button>
      <button
        className="btn-action delete"
        title="Delete"
        onClick={() => onDelete(data.id)}
      >
        🗑️
      </button>
    </div>
  );
}

export default function DataTable({ rows, onDelete, title = "Data Table" }) {
  const gridRef = useRef();
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 140,
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 2,
        minWidth: 180,
      },
      {
        field: "role",
        headerName: "Role",
        sortable: true,
        filter: true,
        width: 120,
        cellRenderer: RoleBadge,
      },
      {
        field: "status",
        headerName: "Status",
        sortable: true,
        filter: true,
        width: 120,
        cellRenderer: StatusBadge,
      },
      {
        field: "joined",
        headerName: "Joined",
        sortable: true,
        width: 130,
      },
      {
        headerName: "Actions",
        width: 100,
        sortable: false,
        filter: false,
        cellRenderer: (params) => (
          <ActionButtons data={params.data} onDelete={onDelete} />
        ),
      },
    ],
    [onDelete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      suppressMovable: false,
    }),
    []
  );

  const onFilterTextChange = useCallback((e) => {
    setSearch(e.target.value);
    gridRef.current?.api?.setGridOption("quickFilterText", e.target.value);
  }, []);

  const onExport = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: "users-export.csv" });
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
        <div className="table-controls">
          <input
            placeholder="Search all columns..."
            value={search}
            onChange={onFilterTextChange}
            className="table-search"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
          <button className="btn btn-outline" onClick={onExport}>
            ⬇ Export
          </button>
        </div>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: 420, width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={pageSize}
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={true}
        />
      </div>
    </div>
  );
}
