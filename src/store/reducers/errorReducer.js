const initialState = {
  isLoading: false,
  errorMessage: null,
};

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {

    case "START_LOADING":
      return { isLoading: true, errorMessage: null };

    case "STOP_LOADING":
      return { ...state, isLoading: false };

    case "SET_ERROR":
      return { isLoading: false, errorMessage: action.payload };

    default:
      return state;
  }
};