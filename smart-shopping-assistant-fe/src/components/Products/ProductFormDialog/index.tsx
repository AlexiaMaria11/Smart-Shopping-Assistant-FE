import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { productsApi } from "../../../api/clients/ProductApiClient";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";
import { companiesApi } from "../../../api/clients/CompanyApiClient";
import {
  galleryOf,
  LOW_STOCK_THRESHOLD,
  type Product,
} from "../../shared/types/Product";
import type { Category } from "../../shared/types/Category";
import type { Company } from "../../shared/types/Company";
import { useAuth } from "../../../context/AuthContext/auth-context";
import { Role } from "../../../api/models/AuthModel";
import FormDialog from "../../common/FormDialog";
import FormSection from "../../common/FormDialog/FormSection";
import ProductImagesField, { type ImageRow } from "./ProductImagesField";
import { counterHelper, counterHelperProps, isDirty } from "../../common/FormDialog/formHelpers";
import "../../common/ProductCard/ProductCard.css";

const NAME_MAX = 200;
const DESCRIPTION_MAX = 1000;

interface ProductFormDialogProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  images: ImageRow[];
  companyId: number | "";
  categoryIds: number[];
}

type Errors = Partial<Record<keyof ProductForm, string>>;

function validate(form: ProductForm): Errors {
  const errors: Errors = {};
  if (form.name.trim() === "") errors.name = "Please give the product a name.";
  const price = Number(form.price);
  if (form.price.trim() === "" || isNaN(price) || price <= 0) errors.price = "Enter a price greater than 0.";
  const stock = Number(form.stock);
  if (form.stock.trim() === "" || !Number.isInteger(stock) || stock < 0)
    errors.stock = "Enter a whole number, 0 or more.";
  if (form.images.some((image) => image.url.trim() === ""))
    errors.images = "Fill in the empty image links, or remove those rows.";
  else {
    const urls = form.images.map((image) => image.url.trim().toLowerCase());
    if (new Set(urls).size !== urls.length) errors.images = "The same picture is listed twice.";
  }
  if (form.companyId === "") errors.companyId = "Choose the company that sells this product.";
  if (form.categoryIds.length === 0) errors.categoryIds = "Choose at least one category, so customers can find it.";
  return errors;
}

// The card exactly as customers will see it in the shop
function mainImageUrl(images: ImageRow[]): string {
  const main = images.find((image) => image.isMain) ?? images[0];
  return (main?.url ?? "").trim();
}

function ProductPreview({ form, sellerName }: { form: ProductForm; sellerName: string }) {
  const stock = Number(form.stock);
  const imageUrl = mainImageUrl(form.images);
  const outOfStock = form.stock.trim() !== "" && stock <= 0;
  const lowStock = !outOfStock && stock > 0 && stock <= LOW_STOCK_THRESHOLD;
  const price = Number(form.price);

  return (
    <Card
      sx={{ pointerEvents: "none" }}
      className={outOfStock ? "product-card--sold-out" : undefined}
    >
      <Box className="card-image-wrap">
        {outOfStock && <Box className="product-stock-badge">Out of stock</Box>}
        {lowStock && (
          <Box className="product-stock-badge product-stock-badge--low">Only {stock} left</Box>
        )}
        {imageUrl !== "" ? (
          <CardMedia component="img" height="170" image={imageUrl} alt="" sx={{ objectFit: "cover" }} />
        ) : (
          <Box
            sx={{
              height: 170,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--cream-dark)",
              color: "var(--accent)",
            }}
          >
            <ImageOutlinedIcon fontSize="large" />
          </Box>
        )}
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography className="product-card-name">{form.name.trim() || "Product name"}</Typography>
        {sellerName && (
          <span className="product-card-seller">
            <StorefrontOutlinedIcon className="product-card-seller-icon" />
            {sellerName}
          </span>
        )}
        <Typography className="product-card-desc">
          {form.description.trim() || "A short description of the product."}
        </Typography>
        <Box className="product-card-divider" />
        <Box className="product-card-price-row">
          <Typography className="price-tag">{price > 0 ? price.toFixed(2) : "0.00"}</Typography>
          <Typography className="product-card-currency">RON</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function ProductFormDialog({ product, onClose, onSaved }: ProductFormDialogProps) {
  const isEditing = product !== null;
  const { user, hasRole } = useAuth();
  // Sellers always sell under their own company, the server enforces it too
  const isSeller = hasRole(Role.Seller);

  const [initial] = useState<ProductForm>(() => ({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    stock: product?.stockQuantity?.toString() ?? "0",
    // Products saved before galleries existed have a single ImageUrl
    images: product
      ? galleryOf(product).map((image) => ({ id: image.id, url: image.url, isMain: image.isMain }))
      : [],
    companyId: product?.companyId ?? (isSeller ? (user?.companyId ?? "") : ""),
    categoryIds: product?.categories.map((c) => c.id) ?? [],
  }));
  const [form, setForm] = useState<ProductForm>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
    if (!isSeller) {
      companiesApi.getAll(true).then(setCompanies).catch(() => {});
    }
  }, [isSeller]);

  function set<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  const sellerName = isSeller
    ? (user?.companyName ?? "")
    : (companies.find((c) => c.id === form.companyId)?.name ?? product?.companyName ?? "");

  async function handleSave() {
    const found = validate(form);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setSaving(true);
    setServerError("");
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stockQuantity: Number(form.stock),
        imageUrl: mainImageUrl(form.images),
        images: form.images
          .filter((image) => image.url.trim() !== "")
          .map((image) => ({ id: image.id, url: image.url.trim(), isMain: image.isMain })),
        companyId: form.companyId as number,
        categoryIds: form.categoryIds,
      };
      if (isEditing) {
        await productsApi.update(product.id, data);
      } else {
        await productsApi.create(data);
      }
      onSaved();
    } catch (err) {
      setServerError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <FormDialog
      title={isEditing ? "Edit product" : "Add product"}
      subtitle={
        isEditing
          ? "Changes are visible in the shop as soon as you save."
          : "The product appears in the shop as soon as you save it."
      }
      submitLabel={isEditing ? "Save changes" : "Add product"}
      saving={saving}
      dirty={isDirty(initial, form)}
      error={serverError}
      onSubmit={handleSave}
      onClose={onClose}
      aside={<ProductPreview form={form} sellerName={sellerName} />}
      asideTitle="How it looks in the shop"
    >
      <FormSection title="Product">
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          slotProps={{ htmlInput: { maxLength: NAME_MAX } }}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          helperText={counterHelper(form.description, DESCRIPTION_MAX)}
          slotProps={{ ...counterHelperProps, htmlInput: { maxLength: DESCRIPTION_MAX } }}
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
        />
      </FormSection>

      <FormSection title="Price and stock">
        <Box className="form-row">
          <TextField
            label="Price"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
            type="number"
            required
            fullWidth
            slotProps={{
              htmlInput: { min: 0, step: 0.01 },
              input: { endAdornment: <InputAdornment position="end">RON</InputAdornment> },
            }}
          />
          <TextField
            label="Units in stock"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            error={!!errors.stock}
            helperText={errors.stock ?? (Number(form.stock) === 0 ? "Customers will see it as out of stock." : undefined)}
            type="number"
            required
            fullWidth
            slotProps={{
              htmlInput: { min: 0, step: 1 },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory2OutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </FormSection>

      <FormSection
        title="Images"
        description="Customers see these in this order on the product page. Square photos on a clean background look best."
      >
        <ProductImagesField
          images={form.images}
          onChange={(images) => set("images", images)}
          error={errors.images}
        />
      </FormSection>

      <FormSection title="Where it appears">
        {!isSeller && (
          <FormControl fullWidth required error={!!errors.companyId}>
            <InputLabel id="product-company-label">Sold by</InputLabel>
            <Select
              labelId="product-company-label"
              value={form.companyId}
              label="Sold by"
              onChange={(e) => set("companyId", e.target.value as number)}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
            {errors.companyId && <FormHelperText>{errors.companyId}</FormHelperText>}
          </FormControl>
        )}
        <FormControl fullWidth required error={!!errors.categoryIds}>
          <InputLabel id="product-categories-label">Categories</InputLabel>
          <Select
            labelId="product-categories-label"
            multiple
            value={form.categoryIds}
            label="Categories"
            onChange={(e) => set("categoryIds", e.target.value as number[])}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {categories
                  .filter((c) => (selected as number[]).includes(c.id))
                  .map((c) => (
                    <Chip key={c.id} label={c.name} size="small" />
                  ))}
              </Box>
            )}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Checkbox checked={form.categoryIds.includes(cat.id)} />
                <ListItemText primary={cat.name} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.categoryIds ?? "Used by the shop filters and by the AI suggestions."}</FormHelperText>
        </FormControl>
      </FormSection>
    </FormDialog>
  );
}

export default ProductFormDialog;
