import React, { createContext, useReducer } from "react";
import { FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { multiFormReducer } from "../../reducers/form/multi-form-reducer";



export const MultiStepFormContext = createContext();

// Proveedor del contexto del formulario multi-step
export const MultiStepFormProvider = ({ children, form }) => {
  const initialState = {
    formData: {},
  };



  const [state, dispatch] = useReducer(multiFormReducer, initialState);

  const goTo = useNavigate();

  // Función para manejar el progreso del formulario
  const goToNextStep = () => {
    goTo(nextStepPath());
  };

  // Función para retroceder al paso anterior del formulario
  const goToPreviousStep = () => {
    goTo(previousStepPath());
  };

  // Función para obtener la ruta del siguiente paso
  const nextStepPath = () => {
    // Implementa la lógica para determinar la ruta del siguiente paso
    return "/transaction"; // Ejemplo de ruta del siguiente paso
  };

  const previousStepPath = () => {
    // Implementa la lógica para determinar la ruta del siguiente paso
    return "/transaction"; // Ejemplo de ruta del siguiente paso
  };

  // Función para manejar el envío final del formulario
  const submitForm = () => {
    // Implementa la lógica para enviar los datos del formulario
    console.log("Formulario enviado:", state.formData);
    // Puedes reiniciar o limpiar el estado del formulario después del envío
    // dispatch({ type: ActionTypes.SET_FORM_DATA, payload: {} });
  };

  return (
    <FormProvider {...form}>
      <MultiStepFormContext.Provider
        value={{
          state,
          dispatch,
          goToNextStep,
          goToPreviousStep,
          submitForm,
        }}
      >
        {children}
      </MultiStepFormContext.Provider>
    </FormProvider>
  );
};
