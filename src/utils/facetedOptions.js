export function obtenerValores(data, propiedad) {
  const valores = data.map((column) => column[propiedad]);
  return [...new Set(valores)];
}

export function facetedOption(values) {
  return values.map((value) => {
    const options = {
      value: value,
      label: value,
    };

    return options;
  });
}
