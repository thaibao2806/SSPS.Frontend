import Board, {
  moveCard,
  moveColumn,
  removeCard,
  addCard,
  addColumn,
  removeColumn,
} from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import useBoard from "../../../utils/Board";
import "./board.css";
import { RxCross2 } from "react-icons/rx";
import { ImBin } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import AddCardModal from "../../../components/AddCardModal/AddCardModal";
import AddColumnModal from "../../../components/AddColumnModal/AddColumnModal";
import { useEffect, useState } from "react";
import { createTodoCard, createTodoNote, deleteTodoCard, deleteTodoNote, getAllTodoNote, swapTodoCard, updateTodoCard, updateTodoNote } from "../../../data/todo";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../../../redux/apiRequest";
import { useMediaQuery, useTheme } from "@mui/material";
import { createAxios } from "../../../createInstance";
import { updateToken } from "../../../redux/authSlice";

const BoardPage = () => {
  // const [ board, setBoard ] = useState();
  const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { board, setBoard } = useBoard();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.login?.currentUser);
  let axoisJWT = createAxios(user, dispatch, updateToken)
  const [openAddColumn, setOpenAddColumn] = useState(false)
  useEffect(() => {
    getAllNote()
  }, []);
  const handleColumnMove = (_card, source, destination) => {
    const updatedBoard = moveColumn(board, source, destination);
    setBoard(updatedBoard);
  };

  const handleCardMove = async(_card, source, destination) => {
    try {
      let res = await swapTodoCard(
        _card.id,
        source.fromColumnId,
        destination.toColumnId,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        const updatedBoard = moveCard(board, source, destination);
        setBoard(updatedBoard);
      } else {
        toast.error("failed!!");
      }
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

  const getAllNote = async() => {
    try {
      let res = await getAllTodoNote(user.data?.accessToken, axoisJWT);
      if (res && res.data.msgCode === "SUCCESS") {
        const newColumns = res.data?.data.map((item) => ({
          id: item.id,
          title: item.title,
          fromDate: item.fromDate,
          toDate: item.toDate,
          color: item.color,
          cards: item.cards || [],
        }));
        const newBoard = {
          columns: newColumns,
        };
        setBoard(newBoard);
      }
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
  }

  const getColumn = async(card) => {
    
    const column = board.columns.filter((column) =>
      column?.cards.includes(card)
    );
    return column[0];
  };

  const handleColumnAdd = async(title, fromDate, toDate, color) => {
    try {
      if (!user?.data) {
        navigate("/login");
        return;
      }
      const cards = [];
      let res = await createTodoNote(
        title,
        fromDate,
        toDate,
        color,
        cards,
        user.data?.accessToken,
        axoisJWT
      );
      if (res && res.data.msgCode === "SUCCESS") {
        toast.success("Create success!!!");
        getAllNote();
        setOpenAddColumn(false);
      } else {
        toast.error("Create failed!!!");
      }
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

  return (
    <div className={`board-container ${isSmallScreen ? 'small-screen' : 'large-screen'}`}>
      <div>
        <span>SSPS Board</span>
        <button
          className="btn ms-3 btn-outline-primary"
          onClick={() => setOpenAddColumn(true)}
        >
          {" "}
          Add column
        </button>
      </div>
      <AddColumnModal
        visible={openAddColumn}
        handleColumnAdd={handleColumnAdd}
        onClose={() => setOpenAddColumn(false)}
      />
      <Board
        allowAddColumn
        allowRenameColumn
        allowRemoveCard
        onCardDragEnd={handleCardMove}
        onColumnDragEnd={handleColumnMove}
        renderCard={(props) => {
          const [opened, setOpened] = useState(false);
          const [selectedCardData, setSelectedCardData] = useState(null);
          const [color, setColor] = useState("")
          const handleCardClick = (cardData) => {
            setOpened(true);
            setSelectedCardData(cardData);
          };
          useEffect(() => {
            getColor()
          }, [])
          const getColor = async() => {
            const column = await getColumn(props)
            setColor(column.color)
          }
          const handleCardUpdate = async(title, detail) => {
            try {
              const card = {
                id: props.id,
                title,
                description: detail,
              };
              const column = await getColumn(props);
              let res = await updateTodoCard(
                column.id,
                props.id,
                title,
                detail,
                user.data?.accessToken,
                axoisJWT
              );
              if (res && res.data.msgCode === "SUCCESS") {
                toast.success("Update success");
                getAllNote();
                setOpened(false);
              } else {
                toast.error("Failed");
              }
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

          const handleDeleteCard = async(props) => {
            try {
              const column = await getColumn(props);
              let res = await deleteTodoCard(
                column.id,
                props.id,
                user.data?.accessToken,
                axoisJWT
              );
              if (res && res.data.msgCode === "SUCCESS") {
                toast.success("Delete success!");
                const updatedBoard = removeCard(
                  board,
                  await getColumn(props),
                  props
                );
                setBoard(updatedBoard);
              } else {
                toast.error("Failed!!");
              }
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
          }

          return (
            <>
              <div
                className="kanban-card"
                style={{ background: `#${color}` }}
              >
                <div
                  style={{
                    borderBottom: "1px dashed ",
                    paddingBottom: "5px",
                  }}
                >
                  <span className="title-card">{props.title} </span>
                  <div>
                    <button
                      className="remove-button"
                      type="button"
                      onClick={() => handleCardClick(props)}
                    >
                      <FaEdit color="white" size={15} />
                    </button>
                    <button
                      className="remove-button"
                      type="button"
                      onClick={() => handleDeleteCard(props)}
                    >
                      <ImBin color="white" size={15} />
                    </button>
                  </div>
                </div>
                <span className="kanban-card-description">
                  {props.description}
                </span>
              </div>
              <AddCardModal
                visible={opened}
                handleCardAdd={handleCardUpdate}
                onClose={() => {
                  setOpened(false);
                  setSelectedCardData(null); // Reset the selectedCardData when the modal is closed
                }}
                cardData={selectedCardData}
              />
            </>
          );
        }}
        renderColumnHeader={(props) => {
          
          const [modalOpened, setModalOpened] = useState(false);
          const [isUpdate, setIsUpdate] = useState(false)
          const [selectedColumnData, setSelectedColumnData] = useState(null)
          const handleCardAdd = async(title, detail) => {
            try {
              const card = {
                id: new Date().getTime(),
                title,
                description: detail,
              };
              let res = await createTodoCard(
                props.id,
                card,
                user.data?.accessToken,
                axoisJWT
              );
              if (res && res.data.msgCode === "SUCCESS") {
                toast.success("Create success");
                getAllNote();
                const updatedBoard = addCard(board, props, card);
                setBoard(updatedBoard);
                setModalOpened(false);
              } else {
                toast.error("Create failed!!!");
              }
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

          const handleClickEdit = (column) => {
            console.log(column)
            console.log(column.id)
            setSelectedColumnData(column)
            // setColor(column.color)
            setIsUpdate(true);
          }

          const handleUpdateColumn = async(id,title, fromDate, toDate, color,cards) => {
            try {
              let res = await updateTodoNote(
                id,
                title,
                fromDate,
                toDate,
                color,
                cards,
                user.data?.accessToken,
                axoisJWT
              );

              if (res && res.data.msgCode === "SUCCESS") {
                toast.success("Update success!!");
                getAllNote();
                setIsUpdate(false);
              } else {
                toast.error("Update failed!!");
              }
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
          }

          const handleDeleteColumn = async() => {
            try {
              let res = await deleteTodoNote(props.id, user.data?.accessToken,axoisJWT);
              if (res && res.data.msgCode === "SUCCESS") {
                toast.success("Delete success!!");
              } else {
                toast.error("Delete failed!!!");
              }
              const updatedBoard = removeColumn(board, props);
              setBoard(updatedBoard);
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

          const formatDate = (dateString) => {
            const options = {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            };
            const formattedDate = new Date(dateString).toLocaleDateString(
              undefined,
              options
            );
            return formattedDate;
          };

          const isDatePassed = (dateString) => {
            const currentDate = new Date();
            const toDate = new Date(dateString);
            return currentDate > toDate;
          };

          return (
            <>
              <div className="column-header">
                <span style={{ fontWeight: 600, fontSize:"16px" }}>{props.title}</span>
                <div>
                  <IoMdAdd
                    color="white"
                    size={25}
                    title="Add card"
                    onClick={() => setModalOpened(true)}
                  />
                  <FaEdit
                    style={{ margin: "0px 5px 0px 5px" }}
                    color="white"
                    onClick={() => handleClickEdit(props)}
                    size={20}
                    title="Update column"
                  />
                  <ImBin
                    color="#ff1a1a"
                    size={20}
                    title="Remove column"
                    onClick={handleDeleteColumn}
                  />
                </div>
                <AddColumnModal
                  visible={isUpdate}
                  columnData={selectedColumnData}
                  handleColumnAdd={handleUpdateColumn}
                  onClose={() => setIsUpdate(false)}
                />
                <AddCardModal
                  visible={modalOpened}
                  handleCardAdd={handleCardAdd}
                  onClose={() => setModalOpened(false)}
                />
              </div>
              <div
                className="column-header"
                style={{ color: isDatePassed(props?.toDate) ? "red" : "" }}
              >
                {formatDate(props?.fromDate)} - {formatDate(props?.toDate)}
              </div>
            </>
          );
        }}
      >
        {board}
      </Board>
    </div>
  );
};

export default BoardPage;
