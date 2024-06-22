import {  useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/admin/Header";
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import { getUserByAdmin, updateUserByAdmin } from "../../data/authApi";
import { ToastContainer, toast } from "react-toastify";
import { logOutUser } from "../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { updateToken } from "../../redux/authSlice";
import { LockClockOutlined, LockPersonOutlined } from "@mui/icons-material";
const roles = ["Market", "Finance", "Development"];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows = [
  {
    id: 2,
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      {/* <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button> */}
    </GridToolbarContainer>
  );
}

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [editedData, setEditedData] = useState([]);
  const user = useSelector(state => state.auth.login?.currentUser)
  let axoisJWT = createAxios(user, dispatch, updateToken)
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 100,
    page: 1,
    total: 0,
    isLoading: false
  });


  useEffect(() => {
    getUser(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);

  const getUser = async (page, pageSize) => {
    try {
      setPaginationModel((prev) => ({ ...prev, isLoading: true }));
      let res = await getUserByAdmin(page, pageSize, user.data.accessToken, axoisJWT);
      if (res && res.status === 200) {
        setRows(res.data?.data);
        setPaginationModel((prev) => ({
          ...prev,
          total: res.data?.paginationResult.totalPage || 0,
          isLoading: false,
        }));
      } else {
        // Xử lý lỗi API
        console.error("Lỗi khi lấy dữ liệu:", res.statusText);
        toast.error("Lấy dữ liệu thất bại. Vui lòng thử lại sau.");
        setPaginationModel((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      // Xử lý các lỗi khác
      console.error("Lỗi khi lấy dữ liệu:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      setPaginationModel((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== paginationModel.page) {
      setPaginationModel((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if (newPageSize !== paginationModel.pageSize) {
      // Đặt lại trang về 1 khi thay đổi kích thước trang
      setPaginationModel((prev) => ({ ...prev, page: 1, pageSize: newPageSize }));
    }
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async() => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async(newRow) => {
    try {
      const updatedRow = { ...newRow, isNew: false };
      // Lấy được dữ liệu của dòng đã chỉnh sửa
      const editedRowData = updatedRow;
      let res = await updateUserByAdmin(
        editedRowData.id,
        editedRowData.firstName,
        editedRowData.lastName,
        editedRowData.code,
        editedRowData.phone,
        editedRowData.location,
        editedRowData.school,
        editedRowData.status,
        user.data.accessToken,
        axoisJWT
      );
      if (res && res.status === 200) {
        toast.success("Update success!!");
      } else {
        toast.error("Update fail !!");
      }
      getUser(paginationModel.page, paginationModel.pageSize);
      return updatedRow;
    } catch (error) {
      if (error.response.status === 401) {
        console.log(401);
        const timeoutDelay = 5000;

        toast.warning("Session expired. Logging out in 5 seconds.");

        setTimeout(() => {
          logOutUser(dispatch, navigate);
        }, timeoutDelay);
      }
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "code", headerName: "Code", width: 100, editable: false },
    { field: "email", headerName: "Email", width: 150, editable: false },
    { field: "phone", headerName: "Phone", width: 100, editable: true },
    {
      field: "firstName",
      headerName: "First Name",
      width: 100,
      editable: true,
    },
    { field: "lastName", headerName: "Last Name", width: 100, editable: true },
    { field: "school", headerName: "School", width: 150, editable: true },
    { field: "location", headerName: "Location", width: 300, editable: true },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      editable: false,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === "ACTIVE"
                ? colors.greenAccent[600]
                : status === "INACTIVE"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {status === "ACTIVE" && <LockOpenOutlinedIcon />}
            {status === "INACTIVE" && <LockPersonOutlined />}
            {status === "BLOCK" && <LockClockOutlined />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 90,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              className="textPrimary"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="MANAGE USER" subtitle="List Users " />
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          serverMode
          totalRows={paginationModel.total}
          pageSize={paginationModel.pageSize}
          pageSizeOptions={[5, 10, 25]}
          currentPage={paginationModel.page - 1}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={paginationModel.isLoading}
        />
      </Box>
      {/* <ToastContainer /> */}
    </Box>
  );
};

export default Contacts;
