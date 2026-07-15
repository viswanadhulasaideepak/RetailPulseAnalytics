import { TextField } from "@mui/material";
import type { ChangeEvent } from "react";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: Props) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
    />
  );
};

export default InputField;