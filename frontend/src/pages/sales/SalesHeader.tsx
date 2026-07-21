import {
  Button,
  Stack,
  Typography,
} from "@mui/material";

import AddShoppingCartRoundedIcon
from "@mui/icons-material/AddShoppingCartRounded";

type Props = {

  onCreate: () => void;

};

const SalesHeader = ({
  onCreate,
}: Props) => {

  return (

    <Stack
      sx={{direction : "row",
      justifyContent : "space-between",
      alignItems : "center",
      mb : 4}}
    >

      <div>

        <Typography
          sx={{variant : "h4",
          fontWeight : 700}}
        >
          Sales
        </Typography>

        <Typography
          color="text.secondary"
        >
          Manage customer sales and transactions
        </Typography>

      </div>

      <Button
        variant="contained"
        startIcon={
          <AddShoppingCartRoundedIcon />
        }
        onClick={onCreate}
      >
        New Sale
      </Button>

    </Stack>

  );

};

export default SalesHeader;