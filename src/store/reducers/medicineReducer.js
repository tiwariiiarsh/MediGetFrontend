const initialState = {
  medicines: [],
  page: 0,
  totalPages: 0,
  totalElements: 0,
  loading: false,
};

export const medicineReducer = (state = initialState, action) => {
  switch (action.type) {

    case "MEDICINE_LOADING":
      return { ...state, loading: true };

    case "SET_MEDICINES":
      return {
        ...state,
        medicines: action.payload.medicines,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
        loading: false,
      };

    case "SET_SEARCH_MEDICINES":
      return {
        ...state,
        medicines: action.payload,
        totalPages: 0,
        loading: false,
      };

    case "MEDICINE_ERROR":
      return { ...state, loading: false };

    default:
      return state;
  }
};