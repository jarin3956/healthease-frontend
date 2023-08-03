
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeSchedule } from '../../Redux- toolkit/authslice';
import Drawer from '@mui/material/Drawer';


import Swal from 'sweetalert2';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));



function Navbar({ userType }) {



    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const navigate = useNavigate()
    const dispatch = useDispatch()



    const logOutUser = (e) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure to logout ?',
            text: 'This action cannot be undone!',
            showCancelButton: true,
            confirmButtonText: 'Yes, Logout!',
            cancelButtonText: 'No, keep it',
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#333333',
        }).then((result) => {
            if (result.isConfirmed) {

                handlelogOutUser(e);
            }
        });
    }

    const viewProfile = () => {
        switch (userType) {
            case 'user':
                navigate('/profile')
                break;
            case 'doctor':
                navigate('/doctor/profile')
                break;
            default:
                break;
        }
    }

    const handlelogOutUser = (e) => {
        e.preventDefault();
        switch (userType) {
            case 'user':
                localStorage.removeItem('token');
                navigate('/login');
                break;
            case 'doctor':
                localStorage.removeItem('doctortoken');
                dispatch(removeSchedule());
                navigate('/doctor/login');
                break;
            case 'admin':
                localStorage.removeItem('admintoken');
                navigate('/admin/login');
                break;
            default:
                break;
        }

    };




    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);



    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >

        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={viewProfile}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>

        </Menu>
    );



    const getNavigationLinks = () => {
        if (userType === 'user') {
            let token = localStorage.getItem('token')
            return (
                <>
                    {token ? (
                        <>
                            <MenuItem onClick={() => navigate('/home')}  >
                                Home
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/profile')} >

                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/view-Bookings')}>

                                Booking
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/aboutus')}>

                                About Us
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/contactus')}>

                                Contact Us
                            </MenuItem>
                            <MenuItem onClick={logOutUser}>

                                Logout
                            </MenuItem>
                        </>
                    ) : (
                        <MenuItem onClick={() => navigate('/login')}>

                            Login
                        </MenuItem>
                    )}
                </>
            );
        } else if (userType === 'doctor') {
            const doctortoken = localStorage.getItem('doctortoken')
            return (
                <>
                    {doctortoken ? (

                        <>
                            <MenuItem onClick={() => navigate('/doctor/home')}>

                                Home
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/doctor/profile')}>

                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/doctor/aboutus')}>

                                About Us
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/doctor/contactus')}>

                                Contact Us
                            </MenuItem>
                            <MenuItem onClick={logOutUser}>

                                Logout
                            </MenuItem>
                        </>


                    ) : (
                        <MenuItem onClick={() => navigate('/doctor/login')}>

                            Login
                        </MenuItem>
                    )}
                </>
            )
        } else if (userType === 'admin') {
            const admintoken = localStorage.getItem('admintoken')
            return (
                <>
                    {admintoken ? (
                        <>
                            <MenuItem onClick={() => navigate('/admin/dashboard')}>

                                Dashboard
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/users')}>

                                Users
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/doctors')}>

                                Doctors
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/specialization')}>

                                Specialization
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/bookings')}>

                                Bookings
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/admin/revenue')}>

                                Revenue
                            </MenuItem>

                            <MenuItem onClick={logOutUser}>

                                Logout
                            </MenuItem>
                        </>
                    ) : (
                        <MenuItem onClick={() => navigate('/admin/login')}>

                            Login
                        </MenuItem>
                    )}
                </>
            )
        }
    }



    return (


        <Box sx={{ position: 'sticky', top: 0, zIndex: 999, flexGrow: 2 }} >
            <AppBar position="sticky" sx={{ backgroundColor: '#0490DB', height: '75px' }} >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <img src="/healtheaselogo.png" className='rounded-3' alt="Logo" style={{ height: 40, marginRight: 10 }} />

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        HealthEase
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            color="inherit"
                            onClick={viewProfile}
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerClose}
            >
                <img src="/healtheaselogo.png" className='rounded-3' alt="Logo" style={{ height: '200px', marginRight: 10 }} />

                {getNavigationLinks()}
                <MenuItem onClick={handleDrawerClose}>

                    Close
                </MenuItem>


            </Drawer>
            {renderMobileMenu}
            {renderMenu}
        </Box>



    )
}

export default Navbar