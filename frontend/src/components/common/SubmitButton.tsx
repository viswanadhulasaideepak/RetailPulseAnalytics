import { Button, CircularProgress } from "@mui/material";

interface Props {
  text: string;
  loading?: boolean;
}

const SubmitButton = ({
  text,
  loading = false,
}: Props) => {
  return (
    <Button
      fullWidth
      variant="contained"
      type="submit"
      sx={{
        mt: 3,
        py: 1.5,
        borderRadius: 3,
      }}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress
          color="inherit"
          size={22}
        />
      ) : (
        text
      )}
    </Button>
  );
};

export default SubmitButton;