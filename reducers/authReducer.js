const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      const userPrefs = action.payload.preferences || {}; // Handle null/undefined
      const userData = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        avatar: action.payload.avatar || null, // ✅ Include avatar here
        preferences: {
          spice_level: userPrefs.spice_level || "",
          calories: userPrefs.calories || 0,
          price: userPrefs.price || 0,
          gluten_free: userPrefs.gluten_free || false,
          vegetarian: userPrefs.vegetarian || false,
          allergies: userPrefs.allergies || [] // Ensure array
        }
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      return {
        ...state,
        user: userData
      };
    case 'LOGOUT':
      localStorage.removeItem("user"); // Remove the user data from localStorage on logout
      return {
        ...state,
        user: null,
      };
      case 'UPDATE_PREFERENCES':
        const updatedPrefs = {
          ...state.user.preferences,
          ...action.payload,
          // Maintain backend field names
          calories: action.payload.calorie_range,
          price: action.payload.price_range
        };
        
        const updatedUser = {
          ...state.user,
          preferences: updatedPrefs
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return {
          ...state,
          user: updatedUser
        };
      
      case 'UPDATE_ALLERGIES':
        return {
          ...state,
          user: {
            ...state.user,
            preferences: {
              ...state.user.preferences,
              allergies: action.payload
            }
          }
        };
    default:
      return state;
  }
};

export default authReducer;

export const login = (user) => ({ type: "LOGIN", payload: user });
export const logout = () => ({ type: "LOGOUT" });
export const updatePreferences = (preferences) => ({ type: "UPDATE_PREFERENCES", payload: preferences });
export const updateAllergies = (allergies) => ({ type: "UPDATE_ALLERGIES", payload: allergies });
