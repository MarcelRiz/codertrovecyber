/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import BlogService from '../services/BlogService'

const initialState = {
  categories: [],
  blogs: [],
  blogDetail: {},
  loading: false,
}

// Thunks
export const getBlogCategories = createAsyncThunk(
  'blog/getCategories',
  async () => {
    const response = await BlogService.getBlogCategory()
    return response.data
  }
)

export const getBlogs = createAsyncThunk('blog/getBlogs', async payload => {
  const response = await BlogService.getBlog(payload)
  return response
})

export const getBlogById = createAsyncThunk('blog/getBlogById', async id => {
  const response = await BlogService.getBlogDetail(id)
  return response.data
})

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Category
    builder.addCase(getBlogCategories.pending, state => {
      state.categories = []
    })
    builder.addCase(getBlogCategories.fulfilled, (state, action) => {
      const categories = action.payload || []
      state.categories = categories
    })
    builder.addCase(getBlogCategories.rejected, state => {
      state.categories = []
    })

    // Blogs
    builder.addCase(getBlogs.pending, state => {
      state.blogs = []
      state.loading = true
    })
    builder.addCase(getBlogs.fulfilled, (state, action) => {
      let blogs = action.payload?.data || []
      blogs = blogs?.map(item => ({
        ...item,
        categoryName: item.categoryId.name || '',
        authorName:
          item.author && item.author.firstName && item.author.lastName
            ? `${item.author.firstName} ${item.author.lastName}`
            : item.author?.username,
      }))

      state.blogs = blogs
      state.loading = false
    })
    builder.addCase(getBlogs.rejected, state => {
      state.blogs = []
      state.loading = false
    })

    // Blog detail
    builder.addCase(getBlogById.pending, state => {
      state.blogDetail = {}
    })
    builder.addCase(getBlogById.fulfilled, (state, action) => {
      state.blogDetail = action.payload
    })
    builder.addCase(getBlogById.rejected, state => {
      state.blogDetail = {}
    })
  },
})

export default blogSlice.reducer
