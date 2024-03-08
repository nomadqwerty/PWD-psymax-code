const gridStyling = {
  '& .MuiDataGrid-columnHeaders': {
    display: 'none',
  },
  '&, [class^=MuiDataGrid]': {
    fontWeight: 500,
    fontSize: '0.975rem',
    border: 'none',
    fontFamily: 'Inter Tight, sans-serif',
  },
  '& .MuiDataGrid-row': {
    border: '1px solid #CCC',
    borderRadius: 1,
    width: '98%',
    padding: '0 0.5rem',
    alignItems: 'start',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-selected': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-selected.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-cell.MuiDataGrid-withBorderColor': {
    borderColor: 'transparent',
    outline: 'none',
  },
  '& .MuiDataGrid-cell': {
    border: 'none',
    fontFamily: 'Inter Tight, sans-serif',
    fontWeight: 400,
    fontSize: '0.975rem',
    padding: '1rem 0.5rem',
    height: 'auto',
    backgroundColor: 'transparent',
    outline: 'none',
  },
};

export default gridStyling;
