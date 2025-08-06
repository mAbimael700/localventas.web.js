/* eslint-disable react/prop-types */
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FormSeparator,
  FormSeparatorTitle,
  FormSeparatorDesc,
} from "@/components/form-multi-step";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPickerForm } from "./calendar-picker-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { SidebarNav } from "./form-sidebar-multistep";

// eslint-disable-next-line react/prop-types
export const FormFields = ({ form, fieldsList }) => {
  return fieldsList.length > 0 ? (
    fieldsList.map((fieldItem) => (
      <React.Fragment key={`field-${fieldItem.name}}`}>
        {fieldItem.isDatePicker ? (
          <CalendarPickerForm
            key={fieldItem.name}
            label={fieldItem.label}
            name={fieldItem.name}
            form={form}
            className={"h-9"}
          />
        ) : (
          <FormField
            key={fieldItem.name}
            // eslint-disable-next-line react/prop-types
            control={form.control}
            name={fieldItem.name}
            render={({ field }) => (
              <FormItem
                className={cn(fieldItem.isDatePicker && "flex flex-col")}
              >
                {fieldItem.isCheckbox ? (
                  <div className="items-top flex space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <div className=" grid gap-1.5 leading-none">
                      <FormLabel>{fieldItem.label}</FormLabel>

                      {fieldItem.desc && (
                        <FormDescription>{fieldItem.desc}</FormDescription>
                      )}
                    </div>
                  </div>
                ) : fieldItem.isSelect ? (
                  <>
                    <FormLabel>{fieldItem.label}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={fieldItem.className}>
                          <SelectValue
                            placeholder={fieldItem.placeholder || "Seleccionar"}
                          />
                          <SelectContent>
                            {fieldItem.values.map((item, i) => (
                              <SelectItem value={item.value} key={`${item.value}-${i}`}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                  </>
                ) : (
                  <>
                    <FormLabel>{fieldItem.label}</FormLabel>
                    <FormControl>
                      {React.cloneElement(fieldItem.input, {
                        ...field,
                      })}
                    </FormControl>

                    {fieldItem.desc && (
                      <FormDescription>{fieldItem.desc}</FormDescription>
                    )}
                  </>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </React.Fragment>
    ))
  ) : (
    <span className="font-semibold">
      No hay elementos para registrar este formulario...
    </span>
  );
};

export const FormLayout = ({
  title,
  desc,
  onSubmitFn,
  schema,
  fieldsList = [],
  hasMultiSteps = false,
  hasSidebar = false,
  sidebarItems = [],
  defaultValues = {}
}) => {
  const [formStep, setFormStep] = useState(0);
  const { toast } = useToast();

  const fieldsLength = fieldsList.length;

  function onSubmit(data) {

    if (!onSubmitFn) {
      return toast({
        title: "Subiste los siguientes valores:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

    return onSubmitFn(data);
  }
  const completeFormStep = async () => {
    const fields = fieldsList[formStep].fields.map((field) => field.name);
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) {
      formValidateError();
      return;
    }

    if (formStep < fieldsLength - 1) {
      if (formStep === fieldsLength - 1) {
        await form.handleSubmit()();
      }
      setFormStep((cur) => cur + 1);
    }
  };

  const previewFormStep = () => {
    setFormStep((cur) => (cur > 0 ? cur - 1 : 0));
  };

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: defaultValues
  });

  function formValidateError(title, desc) {
    toast({
      variant: "destructive",
      title: title || "¡Olvidaste completar el formulario!",
      description: desc || "Por favor, complete el formulario.",
      action: <ToastAction altText="Okay">Entendido</ToastAction>,
    });
  }

  function handleCompleteFormErrors() {
    if (!form.formState.isValid) formValidateError();

    return
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          
          {title && (
            <FormSeparator className="mb-6">
              <FormSeparatorTitle>{title}</FormSeparatorTitle>
              {desc && <FormSeparatorDesc>{desc}</FormSeparatorDesc>}
            </FormSeparator>
          )}

          {hasMultiSteps && fieldsList.length > 0 ? (
            <div
              className={cn(
                hasSidebar &&
                  "flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"
              )}
            >
              {hasSidebar && (
                <aside className="min-w-[200px] -mx-4 lg:w-1/5 ">
                  <SidebarNav items={sidebarItems} step={formStep} />
                </aside>
              )}
              <div className={cn(hasSidebar && "flex-1 lg:max-w-2xl")}>
                {fieldsList.map((step, i) => (
                  <section
                    key={`section-${i}`}
                    className={cn(
                      "space-y-6",
                      formStep === i ? "block" : "hidden"
                    )}
                  >
                    {step.title && (
                      <FormSeparator>
                        <FormSeparatorTitle className="text-xl">
                          {step.title}
                        </FormSeparatorTitle>
                        {step.desc && (
                          <FormSeparatorDesc>{step.desc}</FormSeparatorDesc>
                        )}
                      </FormSeparator>
                    )}

                    <FormFields fieldsList={step.fields} form={form} />

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        className={formStep === 0 && "opacity-0 cursor-default"}
                        type="button"
                        onClick={previewFormStep}
                      >
                        Anterior
                      </Button>

                      <Button
                        type="button"
                        onClick={completeFormStep}
                        className={
                          formStep < fieldsLength - 1 ? "block" : "hidden"
                        }
                      >
                        Siguiente
                      </Button>

                      <Button
                        type="submit"
                        className={
                          formStep > fieldsLength - 2 ? "block" : "hidden"
                        }

                      >
                        Crear
                      </Button>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          ) : (
            <FormFields fieldsList={fieldsList} form={form} />
          )}
        </form>
      </Form>

      {!schema && (
        <div className="mt-4">
          <Button className="h-8 text-xs  " variant="destructive">
            No existen validaciones en el formulario
          </Button>
        </div>
      )}
    </>
  );
};
