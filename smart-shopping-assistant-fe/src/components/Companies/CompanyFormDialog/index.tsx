import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { companiesApi } from "../../../api/clients/CompanyApiClient";
import type { Company } from "../../shared/types/Company";

interface CompanyFormDialogProps {
  company: Company | null;
  onClose: () => void;
  onSaved: () => void;
}

function CompanyFormDialog({ company, onClose, onSaved }: CompanyFormDialogProps) {
  const isEditing = company !== null;

  const [name, setName] = useState(company?.name ?? "");
  const [description, setDescription] = useState(company?.description ?? "");
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(company?.bannerUrl ?? "");
  const [contactEmail, setContactEmail] = useState(company?.contactEmail ?? "");
  const [website, setWebsite] = useState(company?.website ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (name.trim().length < 2) {
      setError("Name must have at least 2 characters.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = {
        name,
        description: description || undefined,
        logoUrl: logoUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        contactEmail: contactEmail || undefined,
        website: website || undefined,
      };
      if (isEditing) {
        await companiesApi.update(company.id, data);
      } else {
        await companiesApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Company" : "Add Company"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== "" && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Logo URL"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Banner URL"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Contact email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            fullWidth
            type="email"
          />
          <TextField
            label="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CompanyFormDialog;
