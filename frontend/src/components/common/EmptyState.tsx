import {
  Box,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon
from "@mui/icons-material/Inventory2Outlined";

interface Props {
  title: string;
  subtitle: string;
}

const EmptyState = ({
  title,
  subtitle,
}: Props) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
      }}
    >
      <Inventory2OutlinedIcon
        sx={{
          fontSize: 70,
          color: "#CBD5E1",
        }}
      />

      <Typography
        variant="h6"
        sx={{
          mt: 2,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      <Typography color="text.secondary">
        {subtitle}
      </Typography>

    </Box>
  );
};

export default EmptyState;