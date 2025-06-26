import {
    TypedUseSelectorHook,
    useSelector,
    useDispatch,
} from 'react-redux';
import type {
    AppState,
} from '../store/store';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch();