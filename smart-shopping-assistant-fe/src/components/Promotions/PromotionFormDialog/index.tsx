import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { promotionsApi } from "../../../api/clients/PromotionApiClient";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";
import { productsApi } from "../../../api/clients/ProductApiClient";
import { companiesApi } from "../../../api/clients/CompanyApiClient";
import { PromotionReward, PromotionType } from "../../../api/models/PromotionModel";
import { Role } from "../../../api/models/AuthModel";
import { useAuth } from "../../../context/AuthContext/auth-context";
import type { Company } from "../../shared/types/Company";
import type { Category } from "../../shared/types/Category";
import type { Product } from "../../shared/types/Product";
import type { Promotion } from "../../shared/types/Promotion";
import FormDialog from "../../common/FormDialog";
import FormSection from "../../common/FormDialog/FormSection";
import { isDirty } from "../../common/FormDialog/formHelpers";

interface PromotionFormDialogProps {
  promotion: Promotion | null;
  onClose: () => void;
  onSaved: () => void;
}

type AppliesTo = "none" | "product" | "category";

interface PromotionForm {
  name: string;
  type: PromotionType;
  threshold: string;
  reward: PromotionReward;
  rewardValue: string;
  appliesTo: AppliesTo;
  productId: number | "";
  categoryId: number | "";
  companyId: number | "";
  isActive: boolean;
}

type Errors = Partial<Record<keyof PromotionForm, string>>;

function getInitialAppliesTo(promotion: Promotion | null): AppliesTo {
  if (promotion?.productId) return "product";
  if (promotion?.categoryId) return "category";
  return "none";
}

function validate(form: PromotionForm): Errors {
  const errors: Errors = {};
  if (form.name.trim() === "") errors.name = "Give the promotion a name customers will understand.";

  const threshold = Number(form.threshold);
  if (form.threshold.trim() === "" || isNaN(threshold) || threshold <= 0)
    errors.threshold = "Enter a number greater than 0.";
  else if (form.type === PromotionType.Quantity && !Number.isInteger(threshold))
    errors.threshold = "The number of items must be a whole number.";

  const value = Number(form.rewardValue);
  if (form.rewardValue.trim() === "" || !Number.isInteger(value) || value <= 0)
    errors.rewardValue = "Enter a whole number greater than 0.";
  else if (form.reward === PromotionReward.PercentDiscount && value > 100)
    errors.rewardValue = "A discount cannot be more than 100%.";

  if (form.appliesTo === "product" && form.productId === "") errors.productId = "Choose a product.";
  if (form.appliesTo === "category" && form.categoryId === "") errors.categoryId = "Choose a category.";
  return errors;
}

// "Buy 3 Sports products, get 1 free" — the rule in plain words
function describe(form: PromotionForm, productName: string, categoryName: string, sellerName: string): string {
  const threshold = form.threshold.trim() || "…";
  const value = form.rewardValue.trim() || "…";
  const from = sellerName ? ` from ${sellerName}` : "";

  const product = productName || "the chosen product";
  const category = categoryName || "the chosen category";

  let condition: string;
  if (form.type === PromotionType.Quantity) {
    if (form.appliesTo === "product") condition = `Buy ${threshold} × ${product}${from}`;
    else if (form.appliesTo === "category") condition = `Buy ${threshold} ${category} products${from}`;
    else condition = `Buy ${threshold} products${from}`;
  } else {
    if (form.appliesTo === "product") condition = `Spend at least ${threshold} RON on ${product}${from}`;
    else if (form.appliesTo === "category") condition = `Spend at least ${threshold} RON on ${category} products${from}`;
    else condition = `Spend at least ${threshold} RON${from ? ` on products${from}` : ""}`;
  }

  const reward =
    form.reward === PromotionReward.FreeItems
      ? `get ${value} ${value === "1" ? "item" : "items"} free (the cheapest)`
      : `get ${value}% off`;

  return `${condition}, ${reward}.`;
}

function PromotionSummary({ text, isActive, scope }: { text: string; isActive: boolean; scope: string }) {
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        <LocalOfferOutlinedIcon sx={{ color: "var(--primary)", mt: "2px" }} />
        <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontSize: "0.95rem", fontWeight: 500 }}>
          {text}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
        <Chip size="small" label={isActive ? "Active" : "Inactive"} color={isActive ? "success" : "default"} />
        <Chip size="small" label={scope} variant="outlined" />
      </Box>
      <Typography sx={{ fontFamily: '"Poppins", sans-serif', fontSize: "0.78rem", color: "var(--text-secondary)", mt: 2 }}>
        The discount is applied automatically in the cart, no code needed.
      </Typography>
    </Box>
  );
}

function PromotionFormDialog({ promotion, onClose, onSaved }: PromotionFormDialogProps) {
  const isEditing = promotion !== null;
  const { user, hasRole } = useAuth();
  const isSeller = hasRole(Role.Seller);

  const [initial] = useState<PromotionForm>(() => ({
    name: promotion?.name ?? "",
    type: promotion?.type ?? PromotionType.Quantity,
    threshold: promotion?.threshold?.toString() ?? "",
    reward: promotion?.reward ?? PromotionReward.FreeItems,
    rewardValue: promotion?.rewardValue?.toString() ?? "",
    appliesTo: getInitialAppliesTo(promotion),
    productId: promotion?.productId ?? "",
    categoryId: promotion?.categoryId ?? "",
    companyId: promotion?.companyId ?? "",
    isActive: promotion?.isActive ?? true,
  }));
  const [form, setForm] = useState<PromotionForm>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    productsApi.getManaged().then(setProducts).catch(() => {});
    categoriesApi.getAll().then(setCategories).catch(() => {});
    if (!isSeller) {
      companiesApi.getAll(true).then(setCompanies).catch(() => {});
    }
  }, [isSeller]);

  function set<K extends keyof PromotionForm>(key: K, value: PromotionForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  const sellerName = isSeller
    ? (user?.companyName ?? "")
    : (companies.find((c) => c.id === form.companyId)?.name ?? "");
  const productName = products.find((p) => p.id === form.productId)?.name ?? "";
  const categoryName = categories.find((c) => c.id === form.categoryId)?.name ?? "";
  const availableProducts = products.filter((p) => form.companyId === "" || p.companyId === form.companyId);

  async function handleSave() {
    const found = validate(form);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setSaving(true);
    setServerError("");
    try {
      const data = {
        name: form.name.trim(),
        type: form.type,
        threshold: Number(form.threshold),
        reward: form.reward,
        rewardValue: Number(form.rewardValue),
        productId: form.appliesTo === "product" && form.productId !== "" ? form.productId : undefined,
        categoryId: form.appliesTo === "category" && form.categoryId !== "" ? form.categoryId : undefined,
        companyId: form.companyId !== "" ? form.companyId : undefined,
        isActive: form.isActive,
      };
      if (isEditing) {
        await promotionsApi.update(promotion.id, data);
      } else {
        await promotionsApi.create(data);
      }
      onSaved();
    } catch (err) {
      setServerError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <FormDialog
      title={isEditing ? "Edit promotion" : "Add promotion"}
      subtitle="Promotions are applied automatically when a cart meets the condition."
      submitLabel={isEditing ? "Save changes" : "Add promotion"}
      saving={saving}
      dirty={isDirty(initial, form)}
      error={serverError}
      onSubmit={handleSave}
      onClose={onClose}
      aside={
        <PromotionSummary
          text={describe(form, productName, categoryName, sellerName)}
          isActive={form.isActive}
          scope={sellerName ? `Only ${sellerName}` : "All sellers"}
        />
      }
      asideTitle="The rule in plain words"
    >
      <FormSection title="Promotion">
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name ?? "Shown in the cart, for example \"10% off Electronics over 100 RON\"."}
          slotProps={{ htmlInput: { maxLength: 200 } }}
          required
          fullWidth
          autoFocus
        />
        <FormControlLabel
          control={<Switch checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />}
          label={form.isActive ? "Active: customers get it right away" : "Inactive: saved, but not applied"}
        />
      </FormSection>

      <FormSection title="Condition" description="What the cart needs for the promotion to apply.">
        <ToggleButtonGroup
          value={form.type}
          exclusive
          onChange={(_, value) => value !== null && set("type", value)}
          size="small"
          className="form-toggle"
        >
          <ToggleButton value={PromotionType.Quantity}>Number of items</ToggleButton>
          <ToggleButton value={PromotionType.CartTotal}>Amount spent</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label={form.type === PromotionType.Quantity ? "At least this many items" : "At least this amount"}
          value={form.threshold}
          onChange={(e) => set("threshold", e.target.value)}
          error={!!errors.threshold}
          helperText={errors.threshold}
          type="number"
          required
          fullWidth
          slotProps={{
            htmlInput: { min: 0, step: form.type === PromotionType.Quantity ? 1 : 0.01 },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {form.type === PromotionType.Quantity ? "items" : "RON"}
                </InputAdornment>
              ),
            },
          }}
        />
      </FormSection>

      <FormSection title="Reward">
        <ToggleButtonGroup
          value={form.reward}
          exclusive
          onChange={(_, value) => value !== null && set("reward", value)}
          size="small"
          className="form-toggle"
        >
          <ToggleButton value={PromotionReward.PercentDiscount}>Percent off</ToggleButton>
          <ToggleButton value={PromotionReward.FreeItems}>Free items</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label={form.reward === PromotionReward.PercentDiscount ? "Discount" : "Free items"}
          value={form.rewardValue}
          onChange={(e) => set("rewardValue", e.target.value)}
          error={!!errors.rewardValue}
          helperText={
            errors.rewardValue ??
            (form.reward === PromotionReward.FreeItems ? "The cheapest items in the promotion are the free ones." : undefined)
          }
          type="number"
          required
          fullWidth
          slotProps={{
            htmlInput: { min: 1, max: form.reward === PromotionReward.PercentDiscount ? 100 : undefined, step: 1 },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {form.reward === PromotionReward.PercentDiscount ? "%" : "items"}
                </InputAdornment>
              ),
            },
          }}
        />
      </FormSection>

      <FormSection title="Applies to">
        <ToggleButtonGroup
          value={form.appliesTo}
          exclusive
          onChange={(_, value) => value !== null && set("appliesTo", value)}
          size="small"
          className="form-toggle"
        >
          <ToggleButton value="none">Whole cart</ToggleButton>
          <ToggleButton value="category">A category</ToggleButton>
          <ToggleButton value="product">One product</ToggleButton>
        </ToggleButtonGroup>

        {form.appliesTo === "category" && (
          <FormControl fullWidth required error={!!errors.categoryId}>
            <InputLabel id="promotion-category-label">Category</InputLabel>
            <Select
              labelId="promotion-category-label"
              value={form.categoryId}
              label="Category"
              onChange={(e) => set("categoryId", e.target.value as number)}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
          </FormControl>
        )}

        {form.appliesTo === "product" && (
          <FormControl fullWidth required error={!!errors.productId}>
            <InputLabel id="promotion-product-label">Product</InputLabel>
            <Select
              labelId="promotion-product-label"
              value={form.productId}
              label="Product"
              onChange={(e) => set("productId", e.target.value as number)}
            >
              {availableProducts.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
            {errors.productId && <FormHelperText>{errors.productId}</FormHelperText>}
          </FormControl>
        )}

        {!isSeller && (
          <FormControl fullWidth>
            <InputLabel id="promotion-seller-label" shrink>
              Seller
            </InputLabel>
            <Select
              labelId="promotion-seller-label"
              value={form.companyId}
              label="Seller"
              notched
              displayEmpty
              onChange={(e) => {
                set("companyId", e.target.value as number | "");
                set("productId", "");
              }}
            >
              <MenuItem value="">All sellers (platform promotion)</MenuItem>
              {companies.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              A seller promotion only counts that seller's products in the cart.
            </FormHelperText>
          </FormControl>
        )}
      </FormSection>
    </FormDialog>
  );
}

export default PromotionFormDialog;
