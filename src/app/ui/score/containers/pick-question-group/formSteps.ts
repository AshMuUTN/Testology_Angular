export const formSteps = {
    addAnswerGroups: {
      titleText : "Revisar Categorías",
      titleSubtext : "Estas son para categorizar las respuestas en este subtest.",
      titleBackText : "Preguntas",
      confirmText : "Siguiente",
      subtext: "",
      options: {
        name: "addAnswerGroups",
        label: "Nombre de Categoría",
        textfield: "eliminá campo no usado"
      },
    },
    assignValues: {
      titleText: "Asignar Valores",
      titleSubtext: "Estos valores se asignarán a las respuestas de la categoría correspondiente",
      titleBackText: "Volver",
      confirmText: "Siguiente",
      options : { 
        textfield : "Valor debe ser numérico",
        type: "number"
      }
    },
    pickGroup: {
      titleText : "Elegir Categoría",
      titleSubtext : "",
      titleBackText : "Volver",
      confirmText : "Siguiente"
    }
  };