import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt: string;
}

interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (): Promise<Transaction[]> => {
    const response = await axiosApi.get<Record<string, Omit<Transaction, 'id'>>>('/transactions.json');
    return Object.entries(response.data || {}).map(([id, transaction]) => ({
      id,
      ...transaction,
    }));
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const response = await axiosApi.post('/transactions.json', transaction);
    return { id: response.data.name, ...transaction };
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/edit',
  async (transaction: Transaction): Promise<Transaction> => {
    const { id, ...data } = transaction;
    await axiosApi.put(`/transactions/${id}.json`, data);
    return transaction;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: string): Promise<string> => {
    await axiosApi.delete(`/transactions/${id}.json`);
    return id;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index === -1) {
          state.items.push(action.payload);
        }
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add transaction';
      })
      .addCase(editTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to edit transaction';
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete transaction';
      });
  },
});

export default transactionsSlice.reducer;
