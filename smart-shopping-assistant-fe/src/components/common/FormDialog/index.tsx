import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import ConfirmDialog from "../ConfirmDialog";
import "./FormDialog.css";

interface FormDialogProps {
  title: string;
  subtitle?: string;
  submitLabel: string;
  saving: boolean;
  // Save stays disabled until something changed, and closing asks before throwing changes away
  dirty: boolean;
  // Errors coming from the server (field errors are shown under each field)
  error?: string;
  onSubmit: () => void;
  onClose: () => void;
  // Optional live preview shown next to the form
  aside?: ReactNode;
  asideTitle?: string;
  maxWidth?: "sm" | "md";
  children: ReactNode;
}

function FormDialog({
  title,
  subtitle,
  submitLabel,
  saving,
  dirty,
  error,
  onSubmit,
  onClose,
  aside,
  asideTitle = "Preview",
  maxWidth = aside ? "md" : "sm",
  children,
}: FormDialogProps) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const titleId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  function requestClose() {
    if (saving) return;
    if (dirty) setConfirmDiscard(true);
    else onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (saving || !dirty) return;
    onSubmit();
    // If validation found problems, bring the first one into view (it may be below the fold)
    setTimeout(() => {
      const field = formRef.current?.querySelector<HTMLElement>(".MuiInputBase-root.Mui-error");
      if (!field) return;
      field.scrollIntoView({ behavior: "smooth", block: "center" });
      field
        .querySelector<HTMLElement>('input:not([aria-hidden="true"]), textarea, [role="combobox"]')
        ?.focus({ preventScroll: true });
    }, 50);
  }

  return (
    <>
      <Dialog
        open
        onClose={requestClose}
        fullWidth
        maxWidth={maxWidth}
        className="form-dialog"
        aria-labelledby={titleId}
      >
        <DialogTitle id={titleId} className="form-dialog-header" component="div">
          <Box className="form-dialog-heading">
            <Typography component="h2" className="form-dialog-title">
              {title}
            </Typography>
            {subtitle && <Typography className="form-dialog-subtitle">{subtitle}</Typography>}
          </Box>
          <IconButton onClick={requestClose} aria-label="Close" className="form-dialog-close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box
          component="form"
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="form-dialog-form"
        >
          <DialogContent className="form-dialog-body">
            {error && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {error}
              </Alert>
            )}
            <Box className={aside ? "form-dialog-columns" : undefined}>
              <Box className="form-dialog-main">{children}</Box>
              {aside && (
                <Box className="form-dialog-aside">
                  <Typography className="form-dialog-aside-title">{asideTitle}</Typography>
                  {aside}
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions className="form-dialog-footer">
            <Button onClick={requestClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving || !dirty}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {saving ? "Saving…" : submitLabel}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={confirmDiscard}
        title="Discard changes?"
        description="You have changes that were not saved. If you close now, they will be lost."
        confirmLabel="Discard"
        onConfirm={() => {
          setConfirmDiscard(false);
          onClose();
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </>
  );
}

export default FormDialog;
