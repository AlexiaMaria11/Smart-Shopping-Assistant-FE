import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Analysis, Suggestion } from "../../shared/types/Analysis";
import { useCart } from "../../../context/CartContext/cart-context";
import { cartApi } from "../../../api/clients/CartApiClient";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "./AnalyzeDialog.css";


interface AnalyzeDialogProps {
  onClose: () => void;
}

type Decision = "approved" | "declined";

const loadingMessages = [
  "Reading your cart...",
  "Checking promotions...",
  "Finding the best deals...",
  "Composing suggestions...",
];

function AnalyzeDialog({ onClose }: AnalyzeDialogProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const { addItem } = useCart();

  useEffect(() => {
    cartApi
      .analyze()
      .then((data) => {
        setAnalysis(data);
        setError("");
        setProgress(100);
      })
      .catch((err) => {
        setError((err as Error).message);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 300);
      });
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setProgress((current) => (current >= 88 ? 88 : current + 6));
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 700);
    return () => clearInterval(timer);
  }, [loading]);

  async function handleApprove(suggestion: Suggestion) {
    await addItem(suggestion.productId, suggestion.quantity);
    setDecisions((current) => ({
      ...current,
      [suggestion.productId]: "approved",
    }));
  }

  function handleDecline(suggestion: Suggestion) {
    setDecisions((current) => ({
      ...current,
      [suggestion.productId]: "declined",
    }));
  }

  function handleUndo(suggestion: Suggestion) {
    setDecisions((current) => {
      const next = { ...current };
      delete next[suggestion.productId];
      return next;
    });
  }

  async function handleApproveAll() {
    if (!analysis) return;
    const pending = analysis.suggestions.filter(
      (s) => decisions[s.productId] === undefined,
    );
    for (const s of pending) {
      await addItem(s.productId, s.quantity);
    }
    setDecisions((current) => {
      const next = { ...current };
      pending.forEach((s) => {
        next[s.productId] = "approved";
      });
      return next;
    });
  }

  const approvedSavings =
    analysis?.suggestions
      .filter(
        (s) => decisions[s.productId] === "approved" && s.savings !== null,
      )
      .reduce((sum, s) => sum + (s.savings ?? 0), 0) ?? 0;

  const pendingCount =
    analysis?.suggestions.filter((s) => decisions[s.productId] === undefined)
      .length ?? 0;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <AutoAwesomeIcon sx={{ color: "#C9A84C", fontSize: "1.3rem" }} />
        AI Cart Analysis
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box className="analyze-loading">
            <Typography className="analyze-loading-msg">
              {loadingMessages[messageIndex]}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              className="analyze-progress"
            />
          </Box>
        )}

        {error !== "" && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {analysis !== null && !loading && (
          <Stack spacing={2.5}>
            <Box className="analyze-summary">
              <Typography className="analyze-summary-text">
                {analysis.summary}
              </Typography>
              {approvedSavings > 0 && (
                <Chip
                  label={`You save ${approvedSavings.toFixed(2)} RON`}
                  color="success"
                  size="small"
                  className="analyze-savings-chip"
                />
              )}
            </Box>

            <Divider />

            {analysis.suggestions.length === 0 ? (
              <Typography className="analyze-no-suggestions">
                No suggestions for this cart.
              </Typography>
            ) : (
              <>
                {pendingCount > 1 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleApproveAll}
                    className="analyze-approve-all-btn"
                  >
                    Approve all ({pendingCount})
                  </Button>
                )}

                {analysis.suggestions.map((suggestion) => {
                  const decision = decisions[suggestion.productId];
                  return (
                    <Box
                      key={suggestion.productId}
                      className={`suggestion-card${decision === "approved" ? " suggestion-card--approved" : decision === "declined" ? " suggestion-card--declined" : ""}`}
                    >
                      <Box className="suggestion-card-header">
                        <Typography className="suggestion-card-name">
                          {suggestion.name} × {suggestion.quantity}
                        </Typography>
                        <Typography className="suggestion-card-price">
                          {suggestion.priceLabel}
                        </Typography>
                      </Box>

                      <Typography className="suggestion-card-reason">
                        {suggestion.reason}
                      </Typography>

                      {suggestion.savingsLabel !== null && (
                        <Chip
                          label={`Saves ${suggestion.savingsLabel}`}
                          color="success"
                          size="small"
                          className="suggestion-savings-chip"
                        />
                      )}

                      <Box className="suggestion-card-actions">
                        {decision === undefined && (
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<CheckCircleOutlineIcon />}
                              onClick={() => handleApprove(suggestion)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<CancelOutlinedIcon />}
                              onClick={() => handleDecline(suggestion)}
                            >
                              Decline
                            </Button>
                          </Stack>
                        )}

                        {decision === "approved" && (
                          <Box className="suggestion-decision suggestion-decision--approved">
                            <CheckCircleOutlineIcon className="suggestion-decision-icon" />
                            <Typography className="suggestion-decision-text">
                              Added to cart
                            </Typography>
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<UndoIcon />}
                              onClick={() => handleUndo(suggestion)}
                              className="suggestion-undo-btn"
                            >
                              Undo
                            </Button>
                          </Box>
                        )}

                        {decision === "declined" && (
                          <Box className="suggestion-decision suggestion-decision--declined">
                            <CancelOutlinedIcon className="suggestion-decision-icon" />
                            <Typography className="suggestion-decision-text">
                              Declined
                            </Typography>
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<UndoIcon />}
                              onClick={() => handleUndo(suggestion)}
                              className="suggestion-undo-btn"
                            >
                              Undo
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AnalyzeDialog;
