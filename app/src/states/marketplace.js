/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MarketplaceService from '../services/MarketplaceService'

const initialState = {
  marketplaces: [],
  marketplaceDetail: {},
  loading: false,
}

// Thunks
export const getMarketplaces = createAsyncThunk(
  'marketplace/getMarketplaces',
  async () => {
    const response = await MarketplaceService.getMarketplace()
    return response.data
  }
)

export const getMarketplaceById = createAsyncThunk(
  'marketplace/getMarketplaceById',
  async id => {
    const response = await MarketplaceService.getMarketplaceDetail(id)
    return response.data
  }
)

export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Marketplace
    builder.addCase(getMarketplaces.pending, state => {
      state.marketplaces = {}
      state.loading = true
    })
    builder.addCase(getMarketplaces.fulfilled, (state, action) => {
      state.marketplaces = action.payload
      state.loading = false
    })
    builder.addCase(getMarketplaces.rejected, state => {
      state.marketplaces = {}
      state.loading = false
    })

    // Marketplace detail
    builder.addCase(getMarketplaceById.pending, state => {
      state.marketplaceDetail = {}
      state.loading = true
    })
    builder.addCase(getMarketplaceById.fulfilled, (state, action) => {
      state.marketplaceDetail = action.payload
      state.loading = false
    })
    builder.addCase(getMarketplaceById.rejected, state => {
      state.marketplaceDetail = {}
      state.loading = false
    })
  },
})

export default marketplaceSlice.reducer
