import {Card, CardContent,Typography,} from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: ReactNode;
}

const StatCard = ({
  title,
  value,
}: Props) => {
  return (
    <Card
    sx={{
        borderRadius: 3,
        boxShadow: 2,
        transition: "0.3s",
        "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: 5,
        },
    }}
>
      <CardContent>

        <Typography
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
           {value}
        </Typography>

      </CardContent>
    </Card>
  );
};

export default StatCard;