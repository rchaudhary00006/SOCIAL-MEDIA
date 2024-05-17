import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk(
  "user/getMyProfile",
  async () => {
    try {
      const response = await axiosClient.get("/user/getMyInfo");
      // console.log(response.data);
      return response.data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
    }
  }
);

export const updateMyProfile = createAsyncThunk('user/updateProfile',async(body)=>{
  try {
    
    const response = await axiosClient.put("/user/updateProfile", body);
    // console.log(response.data.result);
    return response.data;
  } catch (e) {
    return Promise.reject(e);
  } 
})

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    toastData : {},
    myProfile: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast : (state,action)=>{
      state.toastData = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMyInfo.fulfilled, (state, action) => {
      state.myProfile = action.payload.result;
    })
    .addCase(updateMyProfile.fulfilled, (state, action) => {
      state.myProfile = action.payload.result;
    })
    
  },
});

export default appConfigSlice.reducer;

export const { setLoading ,showToast } = appConfigSlice.actions;
