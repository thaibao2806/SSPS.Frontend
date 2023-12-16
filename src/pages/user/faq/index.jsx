import { Box, useTheme } from "@mui/material";
import Header from "../../../components/admin/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do you manage your monthly expenses when you have limited income
            from part-time work?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I create a monthly budget to track expenses. I prioritize fixed
            costs such as tuition and basic living expenses, then allocate funds
            for things like entertainment and shopping. I also try to find
            additional sources of income through part-time work or freelance
            projects.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do you search for student discounts or deals to reduce daily
            expenses?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I regularly check for discounts at stores, restaurants, or services
            that offer special deals for students. Sometimes, simply presenting
            a student ID can result in significant savings. Additionally, I
            often shop at places with student discount policies.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do you manage the costs of textbooks and study materials without
            affecting your budget significantly?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I often consider buying used or second-hand textbooks. I check the
            university library for available printed copies of required
            readings. Occasionally, I share textbooks with classmates to cut
            costs. For study materials, I purchase only the essentials and look
            for discounts at discounted stores.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do you handle expenses for social events or entertainment
            activities when your budget is limited?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I try to find free or discounted events for students. I may team up
            with friends to share costs, or organize budget-friendly activities
            at home. The key is to make entertainment choices that align with my
            monthly budget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do you avoid debt and maintain financial stability during your
            time in university?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            I avoid using credit cards recklessly and have a plan for repaying
            any debts if necessary. If I need to borrow, I explore low-interest
            student loan options and opt for flexible repayment plans. Keeping a
            close eye on my expenses and adjusting my budget as needed is
            crucial.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
