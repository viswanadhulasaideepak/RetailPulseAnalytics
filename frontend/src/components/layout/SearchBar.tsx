import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputBase, Paper } from "@mui/material";

const SearchBar = () => {
  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        width: 320,
        bgcolor: "#1E293B",
        borderRadius: 4,
        boxShadow: "none",
      }}
    >
      <SearchRoundedIcon
sx={{
color:"#94A3B8"
}}
/>

      <InputBase
        placeholder="Search..."
        sx={{
ml:1,
flex:1,
color:"white"
}}
      />
    </Paper>
  );
};

export default SearchBar;