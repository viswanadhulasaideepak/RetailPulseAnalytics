import { Box, Typography } from "@mui/material";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";

interface Props {
  message?: string;
}

const EmptyState = ({
  message = "No Data Found",
}: Props) => {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
      }}
    >
      <InboxRoundedIcon
        sx={{
          fontSize: 60,
          color: "#94A3B8",
        }}
      />

      <Typography
        sx={{ mt: 2 }}
        color="text.secondary"
      >
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;