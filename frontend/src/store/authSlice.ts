import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import client from '../api/client';

interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
};

// Async Thunk for Login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            // Note: URL is relative to baseURL '/api', so it calls '/api/auth/login'
            const response = await client.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.detail) {
                return rejectWithValue(error.response.data.detail);
            }
            return rejectWithValue('Login failed. Please check your network connection.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token;
                // Decode token or use user info if provided in response. 
                // For now, we assume backend might send role separately or we decode it.
                // If backend sends: { access_token, role, ... }
                state.user = { role: action.payload.role, username: action.payload.username };
                localStorage.setItem('token', action.payload.access_token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
