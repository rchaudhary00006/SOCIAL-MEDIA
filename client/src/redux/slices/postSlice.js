import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);
      //   console.log(response.data.result);
      return response.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);
export const likeandUnlike = createAsyncThunk(
  "post/likeAndUnlike",
  async (body) => {
    try {
      const response = await axiosClient.post("/post/like", body);
      //   console.log(response.data.result);
      return response.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action?.payload?.result;
      })
      .addCase(likeandUnlike.fulfilled, (state, action) => {
        console.log(action.payload, "payload");
        const post = action.payload?.result?.post;
        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        console.log("index", index);
        if (index !== undefined && index !== -1) {
          state.userProfile.posts[index] = post;
        }
      });
  },
});

export default postSlice.reducer;
