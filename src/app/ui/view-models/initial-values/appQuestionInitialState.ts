import { AppQuestion } from "@entities/question/app-question";

export const appQuestionInitialState: AppQuestion = {
    question : {
        id: 0,
        text: "",
        subtestId: 0
      },
    hasOptions: false,
    optionsMustBeNumbers: false
};