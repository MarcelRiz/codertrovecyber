import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type blogManagementState = {
  blogs: any
  pending: boolean
  error: any
  editingBlog: any
}

const initialState: blogManagementState = {
  blogs: [],
  editingBlog: {},
  pending: false,
  error: null,
}

export const getBlogs = createAsyncThunk(
  'blogManagement/getBlogs',
  async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs`)
    return response
  }
)

export const deletedBlog = createAsyncThunk(
  'blogManagement/deletedBlog',
  async (payload: any) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${payload.id}`
    )
    return response
  }
)

export const updateBlog = createAsyncThunk(
  'blogManagement/updateBlog',
  async (payload: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${payload.id}`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const createBlog = createAsyncThunk(
  'blogManagement/createBlog',
  async (payload: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const getBlog = createAsyncThunk(
  'blogManagement/getBlog',
  async (payload: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${payload.id}`
    )
    return response
  }
)

const blogManagementSlice = createSlice({
  name: 'blogManagement',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: builder => {
    // eslint-disable-next-line no-unused-expressions
    builder.addCase(getBlogs.pending, state => {
      state.pending = true
    }),
      builder.addCase(getBlogs.fulfilled, (state, action) => {
        state.pending = false
        let blogs = action.payload?.data || []

        blogs = blogs?.map(item => ({
          ...item,
          categoryName: item.categoryId?.name || '',
          authorName: item.author?.username || '',
        }))

        state.blogs = blogs
      }),
      builder.addCase(getBlogs.rejected, state => {
        state.pending = false
      }),
      builder.addCase(deletedBlog.pending, state => {
        state.pending = true
      }),
      builder.addCase(deletedBlog.fulfilled, (state, action) => {
        state.pending = false
        state.blogs = state.blogs.filter(
          blog => blog.id !== action?.payload?.data?.id
        )
      }),
      builder.addCase(deletedBlog.rejected, state => {
        state.pending = false
      }),
      builder.addCase(createBlog.pending, state => {
        state.pending = true
      }),
      builder.addCase(createBlog.fulfilled, state => {
        state.pending = false
      }),
      builder.addCase(createBlog.rejected, (state, action) => {
        state.pending = false
        state.error = action.error.message
      }),
      builder.addCase(getBlog.pending, state => {
        state.pending = true
      }),
      builder.addCase(getBlog.fulfilled, (state, action) => {
        state.pending = false
        state.editingBlog = action.payload?.data || null
      }),
      builder.addCase(getBlog.rejected, state => {
        state.pending = false
      })
  },
})
export const { setError } = blogManagementSlice.actions
export const selectBlogManagement = (state: RootState) => state.blogManagement
export default blogManagementSlice.reducer
