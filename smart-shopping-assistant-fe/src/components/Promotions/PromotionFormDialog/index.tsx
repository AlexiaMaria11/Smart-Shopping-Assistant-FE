import { useState } from "react";
import { promotionsApi } from "../../../api/clients/PromotionApiClient";
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
} from "@mui/material";
import type { PromotionModel } from "../../../api/models/PromotionModel";

interface PromotionFormDialogProps {
  promotion: PromotionModel | null;
  onClose: () => void;
  onSaved: () => void;
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
  const [productId, setProductId] = useState(
    promotion?.productId?.toString() ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    promotion?.categoryId?.toString() ?? ""
  );
  const [isActive, setIsActive] = useState(promotion?.isActive ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    setError("");
    try {
      const data = {
        name,
        type,
        threshold: parsedThreshold,
        reward,
        rewardValue: parsedRewardValue,
        productId: productId !== "" ? parseInt(productId) : undefined,
        categoryId: categoryId !== "" ? parseInt(categoryId) : undefined,
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
            inputProps={{ min: 0, step: "0.01" }}
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
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Product ID (optional)"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
            type="number"
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Category ID (optional)"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            fullWidth
            type="number"
            inputProps={{ min: 1 }}
          />
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
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PromotionFormDialog;
