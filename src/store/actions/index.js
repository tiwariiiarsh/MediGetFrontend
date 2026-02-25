import api from "../../api/api";

// LOGIN
export const authenticateSignInUser =
  (sendData, toast, reset, navigate, setLoader) =>
  async (dispatch) => {
    try {
      setLoader(true);

      const { data } = await api.post("/auth/signin", sendData);

      dispatch({ type: "LOGIN_USER", payload: data });

      localStorage.setItem("auth", JSON.stringify(data));

      reset();
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Internal Server Error"
      );
    } finally {
      setLoader(false);
    }
  };

// SIGNUP
export const registerNewUser =
  (sendData, toast, reset, navigate, setLoader) =>
  async () => {
    try {
      setLoader(true);

      const { data } = await api.post("/auth/signup", sendData);

      reset();
      toast.success(
        data?.message || "User Registered Successfully"
      );

      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.password ||
          "Internal Server Error"
      );
    } finally {
      setLoader(false);
    }
  };

// LOGOUT
export const logOutUser = (navigate) => (dispatch) => {
  dispatch({ type: "LOG_OUT" });
  localStorage.removeItem("auth");
  navigate("/login");
};


// FETCH PAGINATED
export const fetchMedicines =
  (page = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: "MEDICINE_LOADING" });

      const { data } = await api.get(
        `/public/medicines?pageNumber=${page}&pageSize=8&sortBy=medicineId&sortOrder=asc`
      );

      dispatch({
        type: "SET_MEDICINES",
        payload: data,
      });

    } catch (error) {
      console.log(error);
      dispatch({ type: "MEDICINE_ERROR" });
    }
  };


// SEARCH NEARBY
export const searchNearbyMedicines =
  (keyword, userLat, userLng, radius) =>
  async (dispatch) => {
    try {
      dispatch({ type: "MEDICINE_LOADING" });

      const { data } = await api.get(
        `/public/medicines/nearby?keyword=${keyword}&userLat=${userLat}&userLng=${userLng}&radiusKm=${radius}`
      );

      dispatch({
        type: "SET_SEARCH_MEDICINES",
        payload: data,
      });

    } catch (error) {
      console.log(error);
      dispatch({ type: "MEDICINE_ERROR" });
    }
  };