import { Question } from "./question";

export interface AppQuestion {
    question: Question, 
    hasOptions: boolean, 
    optionsMustBeNumbers: boolean 
}
