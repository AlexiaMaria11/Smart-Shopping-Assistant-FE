import { useState } from "react";
import { Avatar, Box, InputAdornment, TextField, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import { companiesApi } from "../../../api/clients/CompanyApiClient";
import type { Company } from "../../shared/types/Company";
import FormDialog from "../../common/FormDialog";
import FormSection from "../../common/FormDialog/FormSection";
import ImageUrlField from "../../common/FormDialog/ImageUrlField";
import {
  counterHelper,
  counterHelperProps,
  isDirty,
  isValidEmail,
  withScheme,
} from "../../common/FormDialog/formHelpers";
import "../../Sellers/Sellers.css";

const DESCRIPTION_MAX = 2000;

interface CompanyFormDialogProps {
  company: Company | null;
  onClose: () => void;
  onSaved: () => void;
}

interface CompanyForm {
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  contactEmail: string;
  website: string;
}

type Errors = Partial<Record<keyof CompanyForm, string>>;

function validate(form: CompanyForm): Errors {
  const errors: Errors = {};
  if (form.name.trim().length < 2) errors.name = "The name must have at least 2 characters.";
  if (form.description.length > DESCRIPTION_MAX) errors.description = "The description is too long.";
  if (form.contactEmail.trim() !== "" && !isValidEmail(form.contactEmail))
    errors.contactEmail = "This is not a valid email address.";
  return errors;
}

// How the store looks to customers on the Sellers page
function CompanyPreview({ form }: { form: CompanyForm }) {
  const name = form.name.trim() || "Your store";
  return (
    <Box className="seller-card" sx={{ pointerEvents: "none" }}>
      <Box
        className="seller-card-banner"
        sx={{ backgroundImage: form.bannerUrl ? `url(${form.bannerUrl})` : undefined }}
      />
      <Avatar src={form.logoUrl || undefined} alt={name} variant="rounded" className="seller-card-logo">
        {name[0]}
      </Avatar>
      <Box className="seller-card-body">
        <Typography className="seller-card-name">{name}</Typography>
        <Typography className="seller-card-desc">
          {form.description.trim() || "A short description of what the store sells."}
        </Typography>
        {form.website && (
          <Typography className="seller-card-meta">{form.website.replace(/^https?:\/\//, "")}</Typography>
        )}
      </Box>
    </Box>
  );
}

function CompanyFormDialog({ company, onClose, onSaved }: CompanyFormDialogProps) {
  const isEditing = company !== null;
  const [initial] = useState<CompanyForm>(() => ({
    name: company?.name ?? "",
    description: company?.description ?? "",
    logoUrl: company?.logoUrl ?? "",
    bannerUrl: company?.bannerUrl ?? "",
    contactEmail: company?.contactEmail ?? "",
    website: company?.website ?? "",
  }));
  const [form, setForm] = useState<CompanyForm>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CompanyForm>(key: K, value: CompanyForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSave() {
    const found = validate(form);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setSaving(true);
    setServerError("");
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        logoUrl: form.logoUrl.trim() || undefined,
        bannerUrl: form.bannerUrl.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
        website: withScheme(form.website) || undefined,
      };
      if (isEditing) {
        await companiesApi.update(company.id, data);
      } else {
        await companiesApi.create(data);
      }
      onSaved();
    } catch (err) {
      setServerError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <FormDialog
      title={isEditing ? "Edit company" : "Add company"}
      subtitle="These details appear on the seller's public page."
      submitLabel={isEditing ? "Save changes" : "Create company"}
      saving={saving}
      dirty={isDirty(initial, form)}
      error={serverError}
      onSubmit={handleSave}
      onClose={onClose}
      aside={<CompanyPreview form={form} />}
      asideTitle="What customers see"
    >
      <FormSection title="Store">
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          error={!!errors.description}
          helperText={counterHelper(form.description, DESCRIPTION_MAX, errors.description)}
          slotProps={{ ...counterHelperProps, htmlInput: { maxLength: DESCRIPTION_MAX } }}
          multiline
          minRows={3}
          maxRows={8}
          fullWidth
        />
      </FormSection>

      <FormSection title="Images" description="Paste links to images that are already online.">
        <ImageUrlField
          label="Logo"
          value={form.logoUrl}
          onChange={(value) => set("logoUrl", value)}
          helperText="A square image works best."
        />
        <ImageUrlField
          label="Banner"
          value={form.bannerUrl}
          onChange={(value) => set("bannerUrl", value)}
          helperText="A wide image, shown at the top of the store page."
        />
      </FormSection>

      <FormSection title="Contact">
        <Box className="form-row">
          <TextField
            label="Email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            error={!!errors.contactEmail}
            helperText={errors.contactEmail}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Website"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            onBlur={() => set("website", withScheme(form.website))}
            placeholder="example.ro"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </FormSection>
    </FormDialog>
  );
}

export default CompanyFormDialog;
