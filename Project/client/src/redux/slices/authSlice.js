import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk('auth/loginUser', async (creds) => {
  const response = await api.post('/auth/login', creds);
  return response.data;
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data) => {
  await api.post('/auth/register', data);
});

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: !!token, user },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.isAuthenticated = true;
      state.user = action.payload.user;
    });
    builder.addCase(registerUser.fulfilled, () => { });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
