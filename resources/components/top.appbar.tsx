import { MouseEvent,useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { signOut } from 'next-auth/react';
import { useStoreSidebar } from 'resources/local/store.sidebar';


export default function TopAppBar() {

    const { setToggleSidebar } = useStoreSidebar()
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const handleLogOut = () => {
    setAnchorElUser(null)
    signOut()
    }

    return (
        <Box sx={{ flexGrow: 1  , mb : "96px"}}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={()=> setToggleSidebar(true) }
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Registros</Typography>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="Remy Sharp" src="" />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem onClick={handleCloseUserMenu}>
                            <Typography textAlign="center">Perfil</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogOut}>
                            <Typography textAlign="center">Cerrar sesión</Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
