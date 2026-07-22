import RefreshIcon from "@mui/icons-material/Refresh";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import {
  Stack,
  Typography,
  Button,
} from "@mui/material";

interface Props {
  refresh: () => void;
}

const InventoryHeader = ({
  refresh,
}: Props) => {
  return (
    <Stack
      sx={{direction:"row",
      justifyContent:"space-between",
      alignItems:"center",mb:3}}>
        
      <Stack sx={{spacing : 1}}>
        <Stack
        sx={{spacing : 1, direction:"row",
          alignItems:"center"}}>
          <Inventory2Icon
            color="primary"
            fontSize="large"
          />

          <Typography
            variant="h4"
           sx={{fontWeight : 700}}
          >
            Inventory Management
          </Typography>
        </Stack>

        <Typography
          color="text.secondary"
        >
          Manage stock levels, movements and inventory
        </Typography>
      </Stack>

      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={refresh}
      >
        Refresh
      </Button>
    </Stack>
  );
};

export default InventoryHeader;