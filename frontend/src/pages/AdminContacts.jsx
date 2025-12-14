import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import { contactApi } from "../api/contactApi.js";
import { formatDate } from "../utils/helper.js";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

const AdminContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching contacts...");
      const response = await contactApi.getAllContacts();

      console.log("✅ Contacts response:", response);

      // Handle different response structures
      const contactsData = response.data?.contacts || response.data || [];

      setContacts(contactsData);

      if (contactsData.length === 0) {
        console.log("ℹ️ No contacts found");
      }
    } catch (error) {
      console.error("❌ Error fetching contacts:", error);

      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        // Clear auth data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Redirect to login
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch contacts";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!contactToDelete?._id) return;

    try {
      setDeleting(true);
      console.log("🗑️ Deleting contact:", contactToDelete._id);

      await contactApi.deleteContact(contactToDelete._id);

      toast.success("Contact deleted successfully");
      setDeleteDialogOpen(false);
      setContactToDelete(null);

      // Remove from local state immediately
      setContacts((prev) => prev.filter((c) => c._id !== contactToDelete._id));
    } catch (error) {
      console.error("❌ Error deleting contact:", error);

      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete contact";

      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleRetry = () => {
    fetchContacts();
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Contact Messages
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No contact messages yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact._id} hover>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {contact.subject}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(contact.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label="New"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(contact)}
                          size="small"
                          title="View details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(contact)}
                          size="small"
                          title="Delete contact"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Display total count */}
        {contacts.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Typography variant="body2" color="text.secondary">
              Total: {contacts.length} message{contacts.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        )}
      </Container>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Contact Message Details</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{selectedContact.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{selectedContact.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="body1">
                  {selectedContact.subject}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Message
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {selectedContact.message}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Date Received
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedContact.createdAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Contact Message</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this contact message from{" "}
            <strong>{contactToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminContacts;
