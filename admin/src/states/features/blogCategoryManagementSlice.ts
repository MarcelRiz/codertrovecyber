import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RootState } from '../store'

export type blogCategoryManagementState = {
  blogCategories: any
  pending: boolean
  error: any
  editingCategory: any
}

const initialState: blogCategoryManagementState = {
  blogCategories: [],
  editingCategory: {},
  pending: false,
  error: null,
}

export const getBlogCategories = createAsyncThunk(
  'blogCategoryManagement/getCategories',
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blog-categories`
      )
      return response
    } catch (error) {
      return error.response.data
    }
  }
)

export const deletedBlogCategory = createAsyncThunk(
  'blogCategoryManagement/deletedBlogCategory',
  async (payload: any) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/blog-categories/${payload.id}`
      )
      return response
    } catch (error) {
      toast.error(error.response.data.message)
      return error.response.data
    }
  }
)

export const updateCategory = createAsyncThunk(
  'blogCategoryManagement/updateCategory',
  async (payload: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/blog-categories/${payload.id}`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const createCategory = createAsyncThunk(
  'blogCategoryManagement/createCategory',
  async (payload: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/blog-categories`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const getCategory = createAsyncThunk(
  'blogCategoryManagement/getCategory',
  async (payload: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/blog-categories/${payload.id}`
    )
    return response
  }
)

const blogCategoryManagementSlice = createSlice({
  name: 'blogCategoryManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getBlogCategories.pending, state => {
      state.pending = true
    }),
      builder.addCase(getBlogCategories.fulfilled, (state, action) => {
        state.pending = false
        const categories = action.payload?.data || []
        state.blogCategories = categories
      }),
      builder.addCase(getBlogCategories.rejected, state => {
        state.pending = false
      }),
      builder.addCase(deletedBlogCategory.pending, state => {
        state.pending = true
      }),
      builder.addCase(deletedBlogCategory.fulfilled, (state, action) => {
        state.pending = false
        state.blogCategories = state.blogCategories.filter(
          category => category.id !== action?.payload?.data?.id
        )
      }),
      builder.addCase(deletedBlogCategory.rejected, state => {
        state.pending = false
      }),
      builder.addCase(createCategory.pending, state => {
        state.pending = true
      }),
      builder.addCase(createCategory.fulfilled, state => {
        state.pending = false
      }),
      builder.addCase(createCategory.rejected, (state, action) => {
        state.pending = false
        state.error = action.error.message
      }),
      builder.addCase(getCategory.pending, state => {
        state.pending = true
      }),
      builder.addCase(getCategory.fulfilled, (state, action) => {
        state.pending = false
        state.editingCategory = action.payload?.data || null
      }),
      builder.addCase(getCategory.rejected, state => {
        state.pending = false
      })
  },
})
export const selectBlogCategoryManagement = (state: RootState) =>
  state.blogCategoryManagement
export default blogCategoryManagementSlice.reducer
