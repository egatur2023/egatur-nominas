import { useState } from "react"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Container, Box, Grid, Typography, Button, TextField, Stack, Alert, CircularProgress } from '@mui/material'
import { useFormik } from "formik"
import { schemaLogin } from "resources/validation/schema.login"
import { Check } from "@mui/icons-material"


const Login = () => {
    const router = useRouter()
    const [isError , setIsError ] = useState<boolean>(false)
    const [isSuccess , setIsSuccess] = useState<boolean>(false)
    const formik = useFormik<{email : string , password : string}>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: schemaLogin,
        onSubmit: async (values, { resetForm }) => {
            const response = await signIn('credentials', { redirect: false,
                 email: values.email,
                 password: values.password })
            console.log(response)
            if (response?.status === 200) {
                setIsError(false)
                setIsSuccess(true)
                resetForm()
                setTimeout( () => router.push('/app/dashboard') , 250)
            }else{
                setIsError(true)
                setIsSuccess(false)
            }

        },
    });

    return <div>
        <Container maxWidth="sm"
            sx={{
                height: '100vh'
            }}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                    height: '100%'
                }}>
                <Box
                    sx={{
                        width: 600,
                        padding: 6,
                        boxShadow: 2,
                    }}
                >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                    >
                        <Typography variant="h3" gutterBottom component="div">
                            Nominas EGA
                        </Typography>

                        <form
                            style={{ width: "100%"}}
                            onSubmit={formik.handleSubmit}
                        >
                            <Stack
                                spacing={2}
                            >
                                {
                                    isError &&
                                    <Alert severity="error">
                                        Usuario y/o contraseña invalida(s)
                                    </Alert>
                                }
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    type="email"
                                    label="Correo"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />

                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />

                                <Button
                                    color={isSuccess ? "success" : "primary"}
                                    disabled={formik.isSubmitting}
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                    endIcon={formik.isSubmitting ? <CircularProgress size={10}></CircularProgress> :  isSuccess ?  <Check/> : <></>}
                                    >
                                    { formik.isSubmitting ? "Verificando..." : "Ingresar" }
                                </Button>

                                <Button onClick={() => signIn('google',{callbackUrl : "/app/dashboard"})}>sign in with gooogle</Button>
                            </Stack>

                        </form>

                    </Grid>
                </Box>
            </Grid>

        </Container >
    </div >
}

export default Login
