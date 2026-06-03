import {
  Box,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import type { Category } from "../shared/types/Category";
import { categoriesApi } from "../../api/clients/CategoryApiClient";
import PageHeader from "../common/PageHeader";
import CategoryFormDialog from "./CategoryFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [deleting, setDeleting] = useState<Category | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadCategories() {
    categoriesApi
      .getAll()
      .then((data) => {
        setCategories(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function handleEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  function handleDeleteClick(category: Category) {
    setDeleting(category);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await categoriesApi.remove(deleting.id);
      loadCategories();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title={"Categories"}
        actionLabel={"Add Category"}
        onAction={handleAdd}
      />
      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="data-table-container">
          <Table>
            <TableHead className="data-table-head">
              <TableRow>
                <TableCell sx={{ width: "25%" }}>Name</TableCell>
                <TableCell sx={{ width: "60%" }}>Description</TableCell>
                <TableCell sx={{ width: "15%" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="data-table-body">
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {category.name}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {category.description || "—"}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Edit">
                      <IconButton
                        color="info"
                        onClick={() => handleEdit(category)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    className="data-table-empty"
                  >
                    No categories yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {formOpen && (
        <CategoryFormDialog
          category={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadCategories();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete category"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Categories;
