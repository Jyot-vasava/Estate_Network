import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "../components/common/Button.jsx";
import { validateForm, validationRules } from "../utils/apiUtils.js";
import { contactApi } from "../api/contactApi.js";
import toast from "react-hot-toast";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateForm(formData, validationRules.contact);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await contactApi.createContact(formData);
      toast.success("Message sent successfully!");
      handleReset();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="page-container">
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          mb={6}
        >
          Have a question? We'd love to hear from you. Send us a message or
          feedback.
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Send us a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    mt: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    loading={loading}
                  >
                    Send Message
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 4, height: "100%" }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Get in Touch
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                Feel free to reach out to us through any of these channels
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      vasavajyotkumar@gmail.com
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Phone
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +91 9998212821
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Surat, Gujarat, India
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Business Hours
                </Typography>
                <Typography variant="body2">
                  Monday - Friday: 9:00 AM - 6:00 PM
                </Typography>
                <Typography variant="body2">
                  Saturday: 10:00 AM - 4:00 PM
                </Typography>
                <Typography variant="body2">Sunday: Closed</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
