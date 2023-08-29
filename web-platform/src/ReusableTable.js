import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TablePagination } from "@mui/material";
import Plot from "./Plot";
export default function ReusableTable(props) {
  console.log(Object.keys(props.data));
  const [data, setData] = useState(props.data);
  const [dataset_name, setDatasetName] = useState(props.dataset_name)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [modalShow, setModalShow] = React.useState(false);
  const bkgColor = "#27567d";
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ backgroundColor: bkgColor, color: "white" }}>
      {data && dataset_name ? (
        <>
          <TableContainer
            component={Paper}
            style={{ backgroundColor: bkgColor }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {Object.keys(data).map((e, i) => {
                    return (
                      <TableCell
                        style={{ color: "white" }}
                        component="th"
                        scope="row"
                        key={i.toString()}
                      >
                        <Plot
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                          col={e}
                          dataset_name={dataset_name}
                        >
                          {e}
                        </Plot>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(data[Object.keys(data)[0]])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((index) => {
                    return (
                      <TableRow key={index}>
                        {Object.keys(data).map((key, idx) => {
                          return (
                            <TableCell
                              style={{ color: "white" }}
                              id={(key + idx).toString()}
                            >
                              {data[key][index].toString()}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            style={{
              color: "white",
              textAlign: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={Object.keys(data[Object.keys(data)[0]]).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
