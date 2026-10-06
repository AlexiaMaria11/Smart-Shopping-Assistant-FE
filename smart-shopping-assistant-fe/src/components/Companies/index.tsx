import {
  Avatar,
  Box,
  Chip,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { companiesApi } from "../../api/clients/CompanyApiClient";
import {
  COMPANY_STATUS_LABELS,
  CompanyStatus,
  type Company,
} from "../shared/types/Company";
import PageHeader from "../common/PageHeader";
import ConfirmDialog from "../common/ConfirmDialog";
import LoadingState from "../common/LoadingState";
import ErrorAlert from "../common/ErrorAlert";
import CompanyFormDialog from "./CompanyFormDialog";

const STATUS_COLORS: Record<CompanyStatus, "warning" | "success" | "error" | "default"> = {
  [CompanyStatus.Pending]: "warning",
  [CompanyStatus.Approved]: "success",
  [CompanyStatus.Rejected]: "error",
  [CompanyStatus.Suspended]: "default",
};

function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const [deleting, setDeleting] = useState<Company | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadCompanies() {
    companiesApi
      .getAll(true)
      .then((data) => {
        setCompanies(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(company: Company) {
    setEditing(company);
    setFormOpen(true);
  }

  function handleDeleteClick(company: Company) {
    setDeleting(company);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await companiesApi.remove(deleting.id);
      loadCompanies();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleStatusChange(company: Company, status: CompanyStatus) {
    try {
      await companiesApi.updateStatus(company.id, {
        status,
        commissionPercent: company.commissionPercent,
      });
      loadCompanies();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader title="Companies" actionLabel="Add Company" onAction={handleAdd} />
      <ErrorAlert message={error} />
      {loading ? (
        <LoadingState />
      ) : (
        <TableContainer component={Paper} className="data-table-container">
          <Table>
            <TableHead className="data-table-head">
              <TableRow>
                <TableCell sx={{ width: "24%" }}>Company</TableCell>
                <TableCell sx={{ width: "20%" }}>Contact</TableCell>
                <TableCell sx={{ width: "10%" }} align="center">
                  Products
                </TableCell>
                <TableCell sx={{ width: "10%" }} align="center">
                  Commission
                </TableCell>
                <TableCell sx={{ width: "22%" }}>Status</TableCell>
                <TableCell sx={{ width: "14%" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="data-table-body">
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar src={company.logoUrl} alt={company.name} variant="rounded">
                        {company.name[0]}
                      </Avatar>
                      <Box className="data-table-cell-bold">{company.name}</Box>
                    </Box>
                  </TableCell>
                  <TableCell className="data-table-cell-muted">
                    {company.contactEmail || "—"}
                  </TableCell>
                  <TableCell align="center">{company.productCount}</TableCell>
                  <TableCell align="center">{company.commissionPercent}%</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        size="small"
                        label={COMPANY_STATUS_LABELS[company.status]}
                        color={STATUS_COLORS[company.status]}
                      />
                      <Select
                        size="small"
                        value={company.status}
                        onChange={(e) =>
                          handleStatusChange(company, e.target.value as CompanyStatus)
                        }
                        sx={{ minWidth: 120, fontSize: "0.82rem" }}
                        aria-label={`Change status of ${company.name}`}
                      >
                        {Object.values(CompanyStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {COMPANY_STATUS_LABELS[status]}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </TableCell>
                  <TableCell align="right" className="data-table-cell-nowrap">
                    <Tooltip title="Edit">
                      <IconButton
                        color="info"
                        onClick={() => handleEdit(company)}
                        aria-label={`Edit ${company.name}`}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(company)}
                        aria-label={`Delete ${company.name}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="data-table-empty">
                    No companies yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {formOpen && (
        <CompanyFormDialog
          company={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadCompanies();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete company"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Companies;
