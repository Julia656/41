// Booking App with React-router, Formik, MUI, Axios, Redux
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Container, TextField, Button, MenuItem, List, ListItem, ListItemText, CssBaseline, ThemeProvider, createTheme
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

// Initial Redux State & Slice
const hotelsSlice = createSlice({
  name: 'hotels',
  initialState: [],
  reducers: {
    setHotels: (state, action) => action.payload
  }
});

const { setHotels } = hotelsSlice.actions;
const store = configureStore({ reducer: { hotels: hotelsSlice.reducer } });

const theme = createTheme();

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Booking App</Typography>
        <Button color="inherit" href="/">Main</Button>
        <Button color="inherit" href="/about">About</Button>
        <Button color="inherit" href="/hotels">Hotels</Button>
      </Toolbar>
    </AppBar>
  );
}

function MainPage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = React.useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/data/db.json') // Replace with actual server endpoint or local JSON
      .then(res => setDestinations(res.data.destinations));
  }, []);

  const formik = useFormik({
    initialValues: { name: '', destination: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      destination: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      axios.post('/hotels', values) // Replace with actual server endpoint or Beeceptor
        .then(res => {
          dispatch(setHotels(res.data));
          navigate('/hotels');
        });
    }
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Book your hotel</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          select
          label="Destination"
          name="destination"
          value={formik.values.destination}
          onChange={formik.handleChange}
          error={formik.touched.destination && Boolean(formik.errors.destination)}
          helperText={formik.touched.destination && formik.errors.destination}
          sx={{ mb: 2 }}
        >
          {destinations.map((d, index) => (
            <MenuItem key={index} value={d}>{d}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained">Send</Button>
      </form>
    </Container>
  );
}

function AboutPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">About</Typography>
      <Typography>Цей додаток дозволяє знаходити готелі за напрямками через форму.</Typography>
    </Container>
  );
}

function HotelsPage() {
  const hotels = useSelector((state) => state.hotels);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Hotels</Typography>
      <List>
        {hotels.map((hotel, index) => (
          <ListItem key={index}>
            <ListItemText primary={hotel.name} secondary={hotel.location} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}
