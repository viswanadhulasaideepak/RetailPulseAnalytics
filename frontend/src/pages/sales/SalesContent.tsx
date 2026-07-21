import {Card,CardContent,Stack,Typography,} from "@mui/material";
import SalesTable from "../../components/tables/SalesTable";
import type { Sale } from "../../types/sale";

interface Props {
  loading: boolean;
  sales: Sale[];
  onDelete: (id: number) => void;
  //onRefresh: () => void;
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
}

const SalesContent = ({
  loading,
  sales,
  onDelete,
  //onRefresh,
  onView,
  onEdit
}: Props) => {

  return (

    <Card sx={{ borderRadius: 3}}>

      <CardContent>

        <Stack
          sx={{direction : "row",
          justifyContent : "space-between",
          alignItems : "center",
          mb : 2}}>

          <Typography variant = "h6" sx={{  fontWeight : 600}}>
            Sales Transactions
          </Typography>

          <Typography variant="body2" color="text.secondary">
           {sales.length} Sales Found
          </Typography>

        </Stack>

        <SalesTable
        loading={loading}
        sales={sales}
        onDelete={onDelete}
       // onRefresh={onRefresh}
        onView={onView}
        onEdit={onEdit}/>

      </CardContent>

    </Card>

  );

};

export default SalesContent;