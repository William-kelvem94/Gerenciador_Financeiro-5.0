import React from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';

export default function LoginPage() {
  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={values => {
            // Aqui você pode chamar a API de login
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="E-mail"
                type="email"
                fullWidth
                margin="normal"
                required
              />
              <Field
                as={TextField}
                name="password"
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                Entrar
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
