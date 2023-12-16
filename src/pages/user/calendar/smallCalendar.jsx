import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Box } from '@mui/material';
const smallCalendar = () => {
  return (
    <Box sx={{"& .css-1q04gal-MuiDateCalendar-root " : {
      width: "250px"
    }}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
      </LocalizationProvider>
    </Box>
  );
}

export default smallCalendar