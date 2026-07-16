import { useEffect, useState } from "react";

import {Box,Button,Card,CardContent,Chip,IconButton,Stack,Table,
  TableBody,TableCell,TableHead,TableRow,TextField,Typography,} from "@mui/material";

import type {Category,CategoryFormData,} from "../../types/category";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DashboardLayout from "../../layouts/DashboardLayout";
import CategoryDialog from "./CategoryDialog";
  
import {getCategories,createCategory,
  updateCategory,deleteCategory} from "../../api/categoryApi";

const Categories = () => {

  const [categories, setCategories] =useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory,setSelectedCategory,] = useState<Category | null>(null);
  const loadCategories = async () => {

    try {
      const res = await getCategories(search);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    loadCategories();
  }, [search]);

  const handleSave = async (data: CategoryFormData) => {
  console.log("Saving category:", data);

  try {
    let res;

    if (selectedCategory) {
      res = await updateCategory(selectedCategory.id, data);
      console.log("Update Response:", res.data);
    } else {
      res = await createCategory(data);
      console.log("Create Response:", res.data);
    }

    alert("Category saved successfully!");

    setOpen(false);
    setSelectedCategory(null);
    loadCategories();

  } catch (err: any) {
    console.error("Category Save Error:", err);

    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);

    alert(err.response?.data?.detail || "Unable to save category");
  }
};

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this category?"))
      return;
    try {
      await deleteCategory(id);
      loadCategories();
    } catch {
      alert("Unable to delete category");
    }

  };

  return (

    <DashboardLayout>
      <Stack direction="row"
      sx={{
         justifyContent: "space-between",
         alignItems: "center",
         mb: 4,
         }}>
        <Box>
          <Typography  variant="h4"
          sx={{
            fontWeight: 700,
            }}>
            Categories
          </Typography>

          <Typography color="text.secondary">
            Manage product categories
          </Typography>

        </Box>

        <Button variant="contained"
          startIcon={<AddIcon />} onClick={() => {
            setSelectedCategory(null);
            setOpen(true);
          }}>
          Add Category
        </Button>
      </Stack>

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
          <TextField label="Search Category"
            fullWidth value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            sx={{ mb: 3 }}/>
                    <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  <strong>Category Name</strong>
                </TableCell>

                <TableCell>
                  <strong>Description</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Status</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Products</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {categories.length === 0 ? (

                <TableRow>

                  <TableCell colSpan={5} align="center">
                    No Categories Found
                  </TableCell>

                </TableRow>

              ) : (

                categories.map((category: Category) => (

                  <TableRow key={category.id} hover>

                    <TableCell>

                      <Typography
                      sx={{
                        fontWeight: 600,
                        }}>
                        {category.name}
                      </Typography>

                    </TableCell>

                    <TableCell>
                      {category.description || "-"}
                    </TableCell>

                    <TableCell align="center">
                      <Chip label={category.status}
                        color={
                          category.status === "Active" ? "success" : "default"
                        }
                        size="small"/>
                    </TableCell>

                    <TableCell align="center">
                      {category.product_count}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton color="primary"
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpen(true);
                        }}>

                        <EditIcon />

                      </IconButton>

                      <IconButton color="error"
                        onClick={() =>
                          handleDelete(category.id)
                        }>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CategoryDialog open={open} category={selectedCategory}
        onClose={() => {
          setOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}/>
    </DashboardLayout>
  );
};
export default Categories;