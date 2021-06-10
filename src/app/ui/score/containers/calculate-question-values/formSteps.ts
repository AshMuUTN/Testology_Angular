export const formSteps = {
    pickFilter: {
      titleText : "Calcular Valor",
      titleSubtext : "",
      titleBackText : "Volver",
      confirmText : "Siguiente",
      filterLabels: [
        "Respuesta es el valor",
        "Respuesta más...",
        "Respuesta multiplicado por...",
        "Respuesta dividido por...",
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
    },
    makeRangeFilters: {
      titleText : "Calcular Valor",
      titleSubtext : "",
      titleBackText : "Volver",
      confirmText : "Siguiente",
      labels: ["desde", "hasta", "valor"],
      textfield: "Valor debe ser numérico"
    },
  };