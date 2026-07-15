import {
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { useState, type ChangeEvent } from "react";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = ({ label, name, value, onChange }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <TextField
      fullWidth
      margin="normal"
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      type={show ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShow((prev) => !prev)}
                edge="end"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;