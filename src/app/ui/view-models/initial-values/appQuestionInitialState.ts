import { AppQuestion } from "@entities/question/app-question";

export const appQuestionInitialState: AppQuestion = {
    question : {
        id: 0,
        text: "",
        subtestId: 0,
        options: []
      },
    hasOptions: false,
    optionsMustBeNumbers: false
};