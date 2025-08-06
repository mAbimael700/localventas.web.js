
// Definimos los tipos de acciones para el reducer
const ActionTypes = {
  SET_FORM_DATA: "SET_FORM_DATA",
};

// Reducer para manejar el estado del formulario
export const multiFormReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_FORM_DATA:
      return { ...state, formData: { ...state.formData, ...action.payload } };
    default:
      return state;
  }
};