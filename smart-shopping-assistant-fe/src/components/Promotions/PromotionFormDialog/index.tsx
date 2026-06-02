import { useEffect, useState } from "react";
import { promotionsApi } from "../../../api/clients/PromotionApiClient";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";
import { productsApi } from "../../../api/clients/ProductApiClient";
import {
  PromotionReward,
  PromotionType,
} from "../../../api/models/PromotionModel";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { Category } from "../../shared/types/Category";
import type { Product } from "../../shared/types/Product";
import type { Promotion } from "../../shared/types/Promotion";

interface PromotionFormDialogProps {
  promotion: Promotion | null;
  onClose: () => void;
  onSaved: () => void;
}

type AppliesTo = "none" | "product" | "category";

function getInitialAppliesTo(promotion: Promotion | null): AppliesTo {
  if (!promotion) return "none";
  if (promotion.productId) return "product";
  if (promotion.categoryId) return "category";
  return "none";
}

function PromotionFormDialog({
  promotion,
  onClose,
  onSaved,
}: PromotionFormDialogProps) {
  const isEditing = promotion !== null;

  const [name, setName] = useState(promotion?.name ?? "");
  const [type, setType] = useState<PromotionType>(
    promotion?.type ?? PromotionType.Quantity
  );
  const [threshold, setThreshold] = useState(
    promotion?.threshold?.toString() ?? ""
  );
  const [reward, setReward] = useState<PromotionReward>(
    promotion?.reward ?? PromotionReward.FreeItems
  );
  const [rewardValue, setRewardValue] = useState(
    promotion?.rewardValue?.toString() ?? ""
  );
  const [appliesTo, setAppliesTo] = useState<AppliesTo>(getInitialAppliesTo(promotion));
  const [selectedProductId, setSelectedProductId] = useState<number | "">(
    promotion?.productId ?? ""
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">(
    promotion?.categoryId ?? ""
  );

  const [isActive, setIsActive] = useState(promotion?.isActive ?? true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    productsApi.getAll().then(setProducts).catch(() => {});
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    const parsedThreshold = parseFloat(threshold);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setError("Threshold must be a valid positive number.");
      return;
    }
    const parsedRewardValue = parseInt(rewardValue);
    if (isNaN(parsedRewardValue) || parsedRewardValue < 0) {
      setError("Reward value must be a valid positive number.");
      return;
    }
    if (appliesTo === "product" && selectedProductId === "") {
      setError("Please select a product.");
      return;
    }
    if (appliesTo === "category" && selectedCategoryId === "") {
      setError("Please select a category.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = {
        name,
        type,
        threshold: parsedThreshold,
        reward,
        rewardValue: parsedRewardValue,
        productId: appliesTo === "product" && selectedProductId !== "" ? selectedProductId : undefined,
        categoryId: appliesTo === "category" && selectedCategoryId !== "" ? selectedCategoryId : undefined,
        isActive,
      };
      if (isEditing) {
        await promotionsApi.update(promotion.id, data);
      } else {
        await promotionsApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Promotion" : "Add Promotion"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== "" && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as PromotionType)}
            >
              <MenuItem value={PromotionType.Quantity}>Quantity</MenuItem>
              <MenuItem value={PromotionType.CartTotal}>Cart Total</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            fullWidth
            type="number"
          />
          <FormControl fullWidth>
            <InputLabel>Reward</InputLabel>
            <Select
              value={reward}
              label="Reward"
              onChange={(e) => setReward(e.target.value as PromotionReward)}
            >
              <MenuItem value={PromotionReward.FreeItems}>Free Items</MenuItem>
              <MenuItem value={PromotionReward.PercentDiscount}>
                Percent Discount
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Reward Value"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
            fullWidth
            type="number"
          />
          <ToggleButtonGroup
            value={appliesTo}
            exclusive
            onChange={(_, val) => { if (val !== null) setAppliesTo(val); }}
            size="small"
          >
            <ToggleButton value="none">None</ToggleButton>
            <ToggleButton value="product">Product</ToggleButton>
            <ToggleButton value="category">Category</ToggleButton>
          </ToggleButtonGroup>
          {appliesTo === "product" && (
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={selectedProductId}
                label="Product"
                onChange={(e) => setSelectedProductId(e.target.value as number)}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {appliesTo === "category" && (
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategoryId}
                label="Category"
                onChange={(e) => setSelectedCategoryId(e.target.value as number)}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="success" onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PromotionFormDialog;
