import { Box, Stack, TextField, Typography, Table, TableBody, TableCell, TableRow, tableCellClasses, TableContainer, TableHead, Paper, Button, Dialog } from "@mui/material"; //UI components
import { useEffect, useState } from "react"; 
import { useStore } from "../../store/Store"; //for conditionsl routing using roles
import { styled } from "@mui/material/styles"; //to create custom table cell
import axios from "axios"; //for convinent http requests

function Mainpage() {
  
  // Custom table cell
  const CTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  // Custom table row
  const CTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  //sates
  const { Role } = useStore();
  const [open, setOpen] = useState(false); //for dialog
  const [openEdit, setOpenEdit] = useState(false); //for edit dialog

  //for easier data manipulation marks and editmaks are objects
  const [marks, setMarks] = useState({
    stuid: "",
    subject1: "",
    subject2: "",
    subject3: "",
    subject4: "",
    subject5: "",
    total: 0,
  });

  const [editMarks, setEditMarks] = useState({
    stuid: "",
    subject1: "",
    subject2: "",
    subject3: "",
    subject4: "",
    subject5: "",
    total: 0,
  });

  //marks from the database
  const [fetchedMarks, setFetchedMarks] = useState([]);


  useEffect(() => {
    //Admin page has seperate pending db
    if (Role === "A") {
      fetchPending();
    } else {
      fetchMarks();
    }
  }, [Role]/* changes effect when role renders */);

  //handle for admin page
  const handleApprove = async (sub1,sub2,sub3,sub4,sub5,total,stuid) => {
    const res = await axios.put("http://localhost:7000/api/enter-mark", {
      subject1: sub1,
      subject2: sub2,
      subject3: sub3,
      subject4: sub4,
      subject5: sub5,
      total: total,
      stuid: stuid,
    });
    console.log("Attempt to approve edit:", res);
    if (res.status === 200) {
      alert("Edit approved successfully");
      fetchPending(); // Refresh the marks after approve
    } else {
      alert("Failed to approve Edit");
    }
  //   const del = await axios.delete("http://localhost:7000/api/delete-pending", {
  //     data: {
  //       stuid: fetchedMarks.stuid,
  //     },
  //   });
  //   console.log("Attempt to delete pending:", del);
  //   if (del.status === 200) {
  //     console.log("Pending deleted successfully");
  //   } else {
  //     console.error("Failed to delete pending"); 
  // }

  //to delete forom pending table
  handleDeny(stuid);
};

  //handle for admin page and to delete from pending table
  const handleDeny = async (id) => {
    console.log(`Denied: ${id}`);
    const res = await axios.delete("http://localhost:7000/api/delete-pending", {
      data: {
        stuid: id,
      },
    });
    console.log("Attempt to deny edit:", res);
    if (res.status === 200) {
      // alert("Edit denied successfully");
      fetchPending(); // Refresh the marks after deny
    } else {
      alert("Failed to deny Edit");
    }
  };


  //handle for faculty page
  const handleEdit = (id) => {
    const markToEdit = fetchedMarks.find((mark) => mark.id === id);
    setEditMarks(markToEdit);
    setOpenEdit(true);
  };

  //handle for faculty page
  const handleDelete = async (id) => {
    console.log(`Delete: ${id}`);
    try {
      const res = await axios.delete("http://localhost:7000/api/delete-mark", {
        data: {
          stuid: id,
        },//objects are passed due to axios
      });
      console.log("Attempt to delete mark:", res);
      if (res.status === 200) {
        alert("Mark deleted successfully");
        fetchMarks(); // Refresh the marks after deletion
      } else {
        alert("Failed to delete mark");
      }
    } catch (error) {
      console.error("Failed to delete mark:", error);
    }
  };

  //opens the dialog
  const handleDialogOpen = () => {
    setOpen(true);
  };
  //closes the dialog
  const handleDialogClose = () => {
    setOpen(false);
  };

  //closes the edit dialog and requests for edit
  const handleEditClose = async () => {
    console.log("Edit requested:", editMarks);
    try {
      const res = await axios.post(
        "http://localhost:7000/api/req-edit",
        editMarks
      );
      console.log("Attempt to request edit:", res);
      if (res.status === 200) {
        alert("Edit requested successfully");
      } else {
        alert("Failed to request edit");
      }
    } catch (error) {
      console.error("Failed to request edit:", error);
    }
    setOpenEdit(false);
  };

  //fetches the marks from the database
  const fetchMarks = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/fetch-marks", {
        params: {
          stuid: marks.stuid,
        },
      });
      const data = res.data;
      console.log("Attempt to fetch marks:", data.marks);
      if (res.status === 200) {
        setFetchedMarks(data.marks || []);
      } else {
        console.error("Failed to fetch marks");
      }
    } catch (error) {
      console.error("Failed to fetch marks:", error);
    }
  };

  //fetches the pending marks from the database
  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/fetch-pending");
      const data = res.data;
      console.log(data);
      console.log("Attempt to fetch pending:", data.marks);
      if (res.status === 200) {
        setFetchedMarks(data.pending || []);
      } else {
        console.error("Failed to fetch marks");
      }
    } catch (error) {
      console.error("Failed to fetch marks:", error);
    }
  };

  //handles the change in marks and calculates the total
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarks((prev) => ({
      ...prev,
      [name]: value,
      total: calculateTotal({ ...prev, [name]: value }),
    }));
  };

//handles the change in marks and calculates the total but for edit dialogue
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMarks((prev) => ({
      ...prev,
      [name]: value,
      total: calculateTotal({ ...prev, [name]: value }),
    }));
  };

  //calculates the total
  const calculateTotal = (marks) => {
    return (
      Number(marks.subject1) +
      Number(marks.subject2) +
      Number(marks.subject3) +
      Number(marks.subject4) +
      Number(marks.subject5)
    );
  };

  //uploads the marks to the database
  const handleUpload = async () => {
    console.log("Marks to be uploaded:", marks); //for logging
    try {
      const res = await axios.post(
        "http://localhost:7000/api/enter-mark",
        marks
      );
      console.log("Attempt to add marks:", res);
      if (res.status === 200) {
        console.log("Marks uploaded successfully");
      } else {
        console.error("Failed to upload marks");
      }
    } catch (error) {
      console.error("Failed to upload marks:", error);
    }
    fetchMarks();//refresh the marks after upload
    setOpen(false);
  };

  //diabled upload untill the fields are filled
  const isUploadDisabled = () => {
    return (
      !marks.stuid ||
      !marks.subject1 ||
      !marks.subject2 ||
      !marks.subject3 ||
      !marks.subject4 ||
      !marks.subject5
    );
  };

  //disabled edit untill the fields are filled
  const isEditDisabled = () => {
    return (
      !editMarks.stuid ||
      !editMarks.subject1 ||
      !editMarks.subject2 ||
      !editMarks.subject3 ||
      !editMarks.subject4 ||
      !editMarks.subject5
    );
  };

  //renders the page based on the role here student
  if (Role === "S") {
    return (
      <Box>
        <Stack>
          <Typography variant="h6" gutterBottom>
            Welcome Student
          </Typography>
          <TableContainer component={Paper} className="mr-4 mt-5">
            <Table>
              <TableHead>
                <CTableRow>
                  <CTableCell>S.No</CTableCell>
                  <CTableCell>StudentID</CTableCell>
                  <CTableCell>Subject1</CTableCell>
                  <CTableCell>Subject2</CTableCell>
                  <CTableCell>Subject3</CTableCell>
                  <CTableCell>Subject4</CTableCell>
                  <CTableCell>Subject5</CTableCell>
                  <CTableCell>Total</CTableCell>
                </CTableRow>
              </TableHead>
              <TableBody>
                {/* filles the table */}
                {fetchedMarks.map((row, index) => (
                  <CTableRow key={row.id}>
                    <CTableCell>{index + 1}</CTableCell>
                    <CTableCell>{row.stuid}</CTableCell>
                    <CTableCell>{row.sub1}</CTableCell>
                    <CTableCell>{row.sub2}</CTableCell>
                    <CTableCell>{row.sub3}</CTableCell>
                    <CTableCell>{row.sub4}</CTableCell>
                    <CTableCell>{row.sub5}</CTableCell>
                    <CTableCell>{row.total}</CTableCell>
                  </CTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    );
  }

  //renders the page based on the role here admin
  if (Role === "A") {
    return (
      <Box>
        <Stack>
          <Typography variant="h6" gutterBottom>
            Welcome Admin
          </Typography>
          <TableContainer component={Paper} className="mr-4 mt-5">
            <Table>
              <TableHead>
                <CTableRow>
                  <CTableCell>S.No</CTableCell>
                  <CTableCell>StudentID</CTableCell>
                  <CTableCell>Subject1</CTableCell>
                  <CTableCell>Subject2</CTableCell>
                  <CTableCell>Subject3</CTableCell>
                  <CTableCell>Subject4</CTableCell>
                  <CTableCell>Subject5</CTableCell>
                  <CTableCell>Total</CTableCell>
                  <CTableCell>Approve</CTableCell>
                  <CTableCell>Deny</CTableCell>
                </CTableRow>
              </TableHead>
              <TableBody>
                {/* filles the table */}
                {Array.isArray(fetchedMarks) && fetchedMarks.map((row, index) => (
                  <CTableRow key={row.id}>
                    <CTableCell>{index + 1}</CTableCell>
                    <CTableCell>{row.stuid}</CTableCell>
                    <CTableCell>{row.sub1}</CTableCell>
                    <CTableCell>{row.sub2}</CTableCell>
                    <CTableCell>{row.sub3}</CTableCell>
                    <CTableCell>{row.sub4}</CTableCell>
                    <CTableCell>{row.sub5}</CTableCell>
                    <CTableCell>{row.total}</CTableCell>
                    <CTableCell>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove( row.sub1, row.sub2, row.sub3, row.sub4, row.sub5, row.total , row.stuid)}
                      >
                        Approve
                      </Button>
                    </CTableCell>
                    <CTableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeny(row.stuid)}
                      >
                        Deny
                      </Button>
                    </CTableCell>
                  </CTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    );
  }


  //renders the page based on the role here faculty
  if (Role === "F") {
    return (
      <Box>
        <Dialog open={open} onClose={handleDialogClose}> {/*upload dialogue*/}
          <Stack spacing={2} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom textAlign={"center"}>
              Upload Marks
            </Typography>
            <TextField
              label="Student ID"
              name="stuid"
              variant="outlined"
              value={marks.stuid}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Subject 1"
              name="subject1"
              variant="outlined"
              type="number"
              value={marks.subject1}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Subject 2"
              name="subject2"
              type="number"
              variant="outlined"
              value={marks.subject2}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Subject 3"
              name="subject3"
              type="number"
              variant="outlined"
              value={marks.subject3}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Subject 4"
              name="subject4"
              type="number"
              variant="outlined"
              value={marks.subject4}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              type="number"
              label="Subject 5"
              name="subject5"
              variant="outlined"
              value={marks.subject5}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Total"
              name="total"
              variant="outlined"
              value={marks.total}
              disabled
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={isUploadDisabled()}
            >
              Upload
            </Button>
          </Stack>
        </Dialog>
        <Dialog open={openEdit} onClose={handleEditClose}> {/*edit dialogue*/}
          <Stack spacing={2} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom textAlign={"center"}>
              Edit Marks
            </Typography>
            <TextField
              label="Student ID"
              name="stuid"
              variant="outlined"
              value={editMarks.stuid}
              onChange={handleEditChange}
              disabled
              fullWidth
            />
            <TextField
              label="Subject 1"
              name="subject1"
              variant="outlined"
              type="number"
              value={editMarks.subject1}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Subject 2"
              name="subject2"
              type="number"
              variant="outlined"
              value={editMarks.subject2}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Subject 3"
              name="subject3"
              type="number"
              variant="outlined"
              value={editMarks.subject3}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Subject 4"
              name="subject4"
              type="number"
              variant="outlined"
              value={editMarks.subject4}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              type="number"
              label="Subject 5"
              name="subject5"
              variant="outlined"
              value={editMarks.subject5}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Total"
              name="total"
              variant="outlined"
              value={editMarks.total}
              disabled
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClose}
              disabled={isEditDisabled()}
            >
              Request Edit
            </Button>
          </Stack>
        </Dialog>
        <Stack>
          <Typography variant="h6" gutterBottom>
            Welcome Faculty Member
          </Typography>
          <Button variant="contained" onClick={handleDialogOpen}>
            Upload marks
          </Button>
          <TableContainer component={Paper} className="mr-4 mt-5">
            <Table>
              <TableHead>
                <CTableRow>
                  <CTableCell>S.No</CTableCell>
                  <CTableCell>StudentID</CTableCell>
                  <CTableCell>Subject1</CTableCell>
                  <CTableCell>Subject2</CTableCell>
                  <CTableCell>Subject3</CTableCell>
                  <CTableCell>Subject4</CTableCell>
                  <CTableCell>Subject5</CTableCell>
                  <CTableCell>Total</CTableCell>
                  <CTableCell>Edit</CTableCell>
                  <CTableCell>Delete</CTableCell>
                </CTableRow>
              </TableHead>
              <TableBody>
                {fetchedMarks.map((row, index) => (
                  <CTableRow key={row.id}>
                    <CTableCell>{index + 1}</CTableCell>
                    <CTableCell>{row.stuid}</CTableCell>
                    <CTableCell>{row.sub1}</CTableCell>
                    <CTableCell>{row.sub2}</CTableCell>
                    <CTableCell>{row.sub3}</CTableCell>
                    <CTableCell>{row.sub4}</CTableCell>
                    <CTableCell>{row.sub5}</CTableCell>
                    <CTableCell>{row.total}</CTableCell>
                    <CTableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(row.id)}
                      >
                        Edit
                      </Button>
                    </CTableCell>
                    <CTableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.stuid)}
                      >
                        Delete
                      </Button>
                    </CTableCell>
                  </CTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    );
  }
  //prevents the page from rendering if the role is not defined
  return null;
}

export default Mainpage;
