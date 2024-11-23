import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI.ts';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (): Promise<Category[]> => {
    const response = await axiosApi.get('/categories.json');
    console.log('Fetched categories:', response.data);

    return Object.entries(response.data || {}).map(([id, category]) => ({
      id,
      ...(category as Omit<Category, 'id'>),
    }));
  }
);


export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: string): Promise<string> => {
    await axiosApi.delete(`/categories/${id}.json`);
    return id;
  }
);


const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((category) => category.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
