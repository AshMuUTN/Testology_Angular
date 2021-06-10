import { InputOptions } from "@ui/view-models/interfaces/input-options.interface";

export const inputFields: InputOptions[] = [
    {
        name: 'correct',
        textfield: 'Valor debe ser numérico',
        label: 'Respuesta Correcta',
        type: 'number'
    },
    {
        name: 'incorrect',
        textfield: 'Valor debe ser numérico',
        label: 'Respuesta Incorrecta',
        type: 'number'
    }
]