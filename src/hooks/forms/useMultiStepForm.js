import { MultiStepFormContext } from "../../contexts/form/multi-form-context";

export const useMultiStepForm = () => {


  const form = useContext(MultiStepFormContext);

  if (form === undefined) {
    throw new Error(
      "useMultiStepForm must be used within a MultiStepFormProvider"
    );
  }

  return form;
};
