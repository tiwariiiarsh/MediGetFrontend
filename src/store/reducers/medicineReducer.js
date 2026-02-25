const initialState = {
  medicines: [],
  page: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 8,
  loading: false,
};

export const medicineReducer = (state = initialState, action) => {
  switch (action.type) {

    case "MEDICINE_LOADING":
      return {
        ...state,
        loading: true,
      };

    case "SET_MEDICINES":
      return {
        ...state,
        medicines: action.payload.content || [],
        page: action.payload.pageNumber,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
        pageSize: action.payload.pageSize,
        loading: false,
      };

    case "SET_SEARCH_MEDICINES":
      return {
        ...state,
        medicines: Array.isArray(action.payload)
          ? action.payload
          : [],
        totalPages: 0, // disable pagination during search
        loading: false,
      };

    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };

    case "MEDICINE_ERROR":
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};