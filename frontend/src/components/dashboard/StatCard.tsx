import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface Props {
  title: string;
  value: string;
}

const StatCard = ({
  title,
  value,
}: Props) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
      }}>
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