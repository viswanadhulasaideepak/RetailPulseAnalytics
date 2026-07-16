import {
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";

const LoadingTable = () => {
  return (
    <Paper sx={{ p: 3 }}>

      <Stack spacing={2}>

        <Skeleton
          variant="rounded"
          height={45}
        />

        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={60}
          />
        ))}

      </Stack>

    </Paper>
  );
};

export default LoadingTable;