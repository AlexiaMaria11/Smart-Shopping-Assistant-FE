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
import type { Product } from "../shared/types/Product";
import { productsApi } from "../../api/clients/ProductApiClient";
import PageHeader from "../common/PageHeader";
import ProductFormDialog from "./ProductFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [deleting, setDeleting] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadProducts() {
    productsApi
      .getAll()
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  function handleDeleteClick(product: Product) {
    setDeleting(product);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await productsApi.remove(deleting.id);
      loadProducts();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Products"
        actionLabel="Add Product"
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
                <TableCell sx={{ width: "20%" }}>Name</TableCell>
                <TableCell sx={{ width: "15%" }}>Category</TableCell>
                <TableCell sx={{ width: "35%" }}>Description</TableCell>
                <TableCell sx={{ width: "8%" }} align="right">Price</TableCell>
                <TableCell sx={{ width: "8%" }} align="center">Image</TableCell>
                <TableCell sx={{ width: "14%" }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="data-table-body">
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                  <TableCell>
                    {product.categories.length > 0
                      ? product.categories.map((c) => c.name).join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "text.secondary" }}>
                    {product.description || "—"}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{product.price.toFixed(2)} RON</TableCell>
                  <TableCell align="center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ height: 48, width: 48, objectFit: "cover", borderRadius: 8, display: "block", margin: "0 auto" }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEdit(product)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="data-table-empty">
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {formOpen && (
        <ProductFormDialog
          product={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadProducts();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete product"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Products;
