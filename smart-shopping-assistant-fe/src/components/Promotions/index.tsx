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
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import type { Promotion } from "../shared/types/Promotion";
import {
  PROMOTION_REWARD_LABELS,
  PROMOTION_TYPE_LABELS,
} from "../shared/types/Promotion";
import type { Product } from "../shared/types/Product";
import type { Category } from "../shared/types/Category";
import { promotionsApi } from "../../api/clients/PromotionApiClient";
import { productsApi } from "../../api/clients/ProductApiClient";
import { categoriesApi } from "../../api/clients/CategoryApiClient";
import PageHeader from "../common/PageHeader";
import PromotionFormDialog from "./PromotionFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";
import LoadingState from "../common/LoadingState";
import ErrorAlert from "../common/ErrorAlert";

function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  const [deleting, setDeleting] = useState<Promotion | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadPromotions() {
    promotionsApi
      .getManaged()
      .then((data) => {
        setPromotions(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(promotion: Promotion) {
    setEditing(promotion);
    setFormOpen(true);
  }

  function handleDeleteClick(promotion: Promotion) {
    setDeleting(promotion);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await promotionsApi.remove(deleting.id);
      loadPromotions();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadPromotions();
    productsApi.getManaged().then(setProducts).catch(() => {});
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Promotions"
        actionLabel="Add Promotion"
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
                <TableCell sx={{ width: "10%" }}>Type</TableCell>
                <TableCell sx={{ width: "10%" }} align="right">
                  Threshold
                </TableCell>
                <TableCell sx={{ width: "13%" }}>Reward</TableCell>
                <TableCell sx={{ width: "10%" }} align="right">
                  Reward Value
                </TableCell>
                <TableCell sx={{ width: "17%" }}>Applies To</TableCell>
                <TableCell sx={{ width: "10%" }} align="center">
                  Status
                </TableCell>
                <TableCell sx={{ width: "10%" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="data-table-body">
              {promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell className="data-table-cell-bold">
                    {promotion.name}
                  </TableCell>
                  <TableCell>{PROMOTION_TYPE_LABELS[promotion.type]}</TableCell>
                  <TableCell align="right">
                    {promotion.threshold.toFixed(2)} RON
                  </TableCell>
                  <TableCell>
                    {PROMOTION_REWARD_LABELS[promotion.reward]}
                  </TableCell>
                  <TableCell align="right">{promotion.rewardValue}</TableCell>
                  <TableCell className="data-table-cell-muted">
                    {promotion.productId
                      ? `Product: ${products.find((p) => p.id === promotion.productId)?.name ?? promotion.productId}`
                      : promotion.categoryId
                        ? `Category: ${categories.find((c) => c.id === promotion.categoryId)?.name ?? promotion.categoryId}`
                        : "—"}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={promotion.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={promotion.isActive ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell align="right" className="data-table-cell-nowrap">
                    <Tooltip title="Edit">
                      <IconButton
                        color="info"
                        onClick={() => handleEdit(promotion)}
                        aria-label={`Edit ${promotion.name}`}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(promotion)}
                        aria-label={`Delete ${promotion.name}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    className="data-table-empty"
                  >
                    No promotions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {formOpen && (
        <PromotionFormDialog
          promotion={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadPromotions();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete promotion"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Promotions;
