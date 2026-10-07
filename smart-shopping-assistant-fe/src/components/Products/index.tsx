import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { LOW_STOCK_THRESHOLD, type Product } from "../shared/types/Product";
import { productsApi } from "../../api/clients/ProductApiClient";
import PageHeader from "../common/PageHeader";
import ProductFormDialog from "./ProductFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";
import LoadingState from "../common/LoadingState";
import ErrorAlert from "../common/ErrorAlert";
import { useAuth } from "../../context/AuthContext/auth-context";
import { Role } from "../../api/models/AuthModel";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [deleting, setDeleting] = useState<Product | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { hasRole } = useAuth();
  const isSeller = hasRole(Role.Seller);

  function loadProducts() {
    productsApi
      .getManaged()
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
        title={isSeller ? "My products" : "Products"}
        actionLabel="Add Product"
        onAction={handleAdd}
      />
      <ErrorAlert message={error} />
      {loading ? (
        <LoadingState />
      ) : (
        <TableContainer component={Paper} className="data-table-container">
          <Table>
            <TableHead className="data-table-head">
              <TableRow>
                <TableCell sx={{ width: "20%" }}>Name</TableCell>
                {!isSeller && <TableCell sx={{ width: "12%" }}>Sold by</TableCell>}
                <TableCell sx={{ width: "15%" }}>Category</TableCell>
                <TableCell sx={{ width: "23%" }}>Description</TableCell>
                <TableCell sx={{ width: "8%" }} align="right">
                  Price
                </TableCell>
                <TableCell sx={{ width: "7%" }} align="right">
                  Stock
                </TableCell>
                <TableCell sx={{ width: "8%" }} align="center">
                  Image
                </TableCell>
                <TableCell sx={{ width: "14%" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="data-table-body">
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="data-table-cell-bold">
                    {product.name}
                  </TableCell>
                  {!isSeller && <TableCell>{product.companyName}</TableCell>}
                  <TableCell>
                    {product.categories.length > 0
                      ? product.categories.map((c) => c.name).join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell
                    className="data-table-cell-muted"
                    sx={{
                      maxWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.description || "—"}
                  </TableCell>
                  <TableCell align="right" className="data-table-cell-bold">
                    {product.price.toFixed(2)} RON
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      product.stockQuantity === 0
                        ? "stock-cell stock-cell--out"
                        : product.stockQuantity <= LOW_STOCK_THRESHOLD
                          ? "stock-cell stock-cell--low"
                          : "stock-cell"
                    }
                  >
                    {product.stockQuantity}
                  </TableCell>
                  <TableCell align="center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-thumb"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell align="right" className="data-table-cell-nowrap">
                    <Tooltip title="Edit">
                      <IconButton
                        color="info"
                        onClick={() => handleEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(product)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isSeller ? 7 : 8}
                    align="center"
                    className="data-table-empty"
                  >
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
