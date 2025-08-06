import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./form/form-sidebar";

export const FormSeparator = ({ className, children }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className={"space-y-0.5"}>{children}</div>
      {children ? <Separator /> : null}
    </div>
  );
};

export const FormSeparatorTitle = ({ children, className }) => {
  return (
    <>
      <h2 className={cn("text-2xl font-bold tracking-tight", className)}>{children}</h2>
    </>
  );
};

export const FormSeparatorDesc = ({ className, children }) => {
  return (
    <div className={cn( className)}>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
};

export const FormFieldSet = ({ label, desc, input }) => {
  return (
    <fieldset className="space-y-2">
      <Label className="capitalize">{label}</Label>
      {input}

      {desc && <span className="text-sm text-muted-foreground">{desc}</span>}
    </fieldset>
  );
};

export const FormStep = ({ title, desc, inputData, isEnd = false }) => {
  return (
    <>
      {/* <FormSeparator title={title} desc={desc} /> */}

      {inputData.map((el) => {
        return (
          <FormFieldSet
            key={el.label}
            label={el.label}
            desc={el.desc || null}
            input={el.input}
          />
        );
      })}

      <Button type={isEnd ? "submit" : "button"}>
        {isEnd ? "Crear" : "Siguiente"}
      </Button>
    </>
  );
};

export const FormMultiStep = ({ formFields, title, desc, stepItems }) => {
  const { handleSubmit } = useForm();

  return (
    <>
      {/* <FormSeparator title={title} desc={desc} /> */}

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          {stepItems && <SidebarNav items={stepItems} />}
        </aside>

        {/* Formulario */}
        <div className="flex-1 lg:max-w-2xl">
          <form
            onSubmit={handleSubmit(() => {
              console.log("Formulario enviado");
            })}
            className="space-y-8"
          >
            {formFields &&
              formFields.map((formStep) => {
                return (
                  <FormStep
                    desc={formStep.desc}
                    inputData={formStep.fields}
                    key={formStep.title}
                    title={formStep.title}
                  />
                );
              })}
          </form>
        </div>
      </div>
    </>
  );
};
