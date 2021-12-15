export const formSteps = {
    pickFilter: {
      titleText : "Calcular Valor",
      titleSubtext : "",
      titleBackText : "Volver",
      confirmText : "Siguiente",
      filterLabels: [
        "Valor del subtest es el valor",
        "Valor del subtest más...",
        "Valor del subtest multiplicado por...",
        "Valor del subtest dividido por...",
      ],
    },
    assignValue: {
      titleText : "Calcular Valor",
      titleSubtext : "",
      titleBackText : "Volver",
      confirmText : "Siguiente",
      subtext: "",
      options: {
        name: "assignValue",
        label: "Valor numérico",
        textfield: "Valor debe ser numérico",
        type: "number"
      },
    },
    pickNextFilter: {
      titleText : "Más Cálculos",
      titleSubtext : "",
      titleBackText : "Volver",
      confirmText : "Siguiente",
      filterLabels: [
        "sin ningún otro cálculo",
        "más...",
        "multiplicado por...",
        "dividido por...",
      ],
    }
  };