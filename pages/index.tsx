import { useState } from "react"
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Container, Box, Grid, Typography, Button, TextField, Stack, Alert, CircularProgress } from '@mui/material'
import { useFormik } from "formik"
import { schemaLogin } from "resources/validation/schema.login"
import { Check } from "@mui/icons-material"
import Image from "next/image";


const Login = () => {
    const { data : session} = useSession()
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

    console.log(session)

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
                        <Image
                                width={350}
                                height={100}
                                src="/logo.png"
                                alt="Logo Egatur"
                            />
                            <Typography variant="subtitle1" gutterBottom component="div"
                            >
                                Sistemas Historial Academico
                            </Typography>

                        <form
                            style={{ width: "100%"}}
                            onSubmit={formik.handleSubmit}
                        >
                            <Stack
                                spacing={2}
                            >

                                <Button
                                        color={"primary"}
                                        variant="contained"
                                        fullWidth
                                        type="submit"
                                        onClick={() =>
                                            signIn("google", {
                                                callbackUrl: "/app/dashboard",
                                            })
                                        }
                                    >
                                        Ingresar con Google
                                  </Button>
                            </Stack>

                        </form>

                    </Grid>
                </Box>
            </Grid>

        </Container >
    </div >
}

export default Login
