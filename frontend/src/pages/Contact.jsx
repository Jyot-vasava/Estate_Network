import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { contactSchema } from "../utils/validation.js";
import { contactApi } from "../api/contactApi.js";
import toast from "react-hot-toast";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      await contactApi.createContact(data);
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message");
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
          Have a question? We'd love to hear from you. Send us a message or feedback.
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Send us a Message
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
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
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    fullWidth
                    label="Your Email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    {...register("subject")}
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={6}
                    {...register("message")}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    loading={isSubmitting}
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
