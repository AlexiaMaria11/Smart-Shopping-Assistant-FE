import { useState } from "react";
import { TextField } from "@mui/material";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";
import type { CategoryModel } from "../../../api/models/CategoryModel";
import FormDialog from "../../common/FormDialog";
import FormSection from "../../common/FormDialog/FormSection";
import { counterHelper, counterHelperProps, isDirty } from "../../common/FormDialog/formHelpers";

const NAME_MAX = 100;
const DESCRIPTION_MAX = 500;

interface CategoryFormDialogProps {
  category: CategoryModel | null;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryFormDialog({ category, onClose, onSaved }: CategoryFormDialogProps) {
  const isEditing = category !== null;
  const [initial] = useState(() => ({
    name: category?.name ?? "",
    description: category?.description ?? "",
  }));
  const [form, setForm] = useState(initial);
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (form.name.trim().length < 2) {
      setNameError("The name must have at least 2 characters.");
      return;
    }
    setSaving(true);
    setServerError("");
    try {
      const data = { name: form.name.trim(), description: form.description.trim() };
      if (isEditing) {
        await categoriesApi.update(category.id, data);
      } else {
        await categoriesApi.create(data);
      }
      onSaved();
    } catch (err) {
      setServerError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <FormDialog
      title={isEditing ? "Edit category" : "Add category"}
      subtitle="Categories group products in the shop filters and help the AI suggest related products."
      submitLabel={isEditing ? "Save changes" : "Add category"}
      saving={saving}
      dirty={isDirty(initial, form)}
      error={serverError}
      onSubmit={handleSave}
      onClose={onClose}
    >
      <FormSection title="Category">
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            setNameError("");
          }}
          error={nameError !== ""}
          helperText={nameError || "Shown to customers, for example \"Home & Garden\"."}
          slotProps={{ htmlInput: { maxLength: NAME_MAX } }}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          helperText={counterHelper(form.description, DESCRIPTION_MAX)}
          slotProps={{ ...counterHelperProps, htmlInput: { maxLength: DESCRIPTION_MAX } }}
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
        />
      </FormSection>
    </FormDialog>
  );
}

export default CategoryFormDialog;
