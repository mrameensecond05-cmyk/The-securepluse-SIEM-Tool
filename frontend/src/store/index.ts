import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

// Create slices later, for now just a basic store
export const store = configureStore({
    reducer: {
        // Placeholder to prevent "valid reducer" error
        _dummy: (state = {}) => state,
        // auth: authReducer,
        // assets: assetsReducer,
        // alerts: alertsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
