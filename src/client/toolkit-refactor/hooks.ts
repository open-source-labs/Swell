import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * A type-safe version of React-Redux's useDispatch hook.
 */
// Separated hooks from store.ts in -- Below are Type safe hooks to use

// export const useAppDispatch : () => AppDispatch = useDispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Latest version of React-Redux (9.x) introduces withTypes, currently not working in 8.0.1
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>()