import React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";

function CustomToolbar({ onAdd }) {
  return (
    <GridToolbarContainer>
      <Button onClick={onAdd} color="primary" variant="contained">
        Add New
      </Button>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function DataTable({ columns, rows, onAdd, onEdit, onDelete }) {
  const actionsColumn = {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    width: 160,
    renderCell: (params) => (
      <>
        <Button size="small" onClick={() => onEdit(params.row)}>Edit</Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(params.row.id)}
        >
          Delete
        </Button>
      </>
    ),
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={[...columns, actionsColumn]}
        pageSize={10}
        rowsPerPageOptions={[10]}
        components={{ Toolbar: () => <CustomToolbar onAdd={onAdd} /> }}
      />
    </div>
  );
}
