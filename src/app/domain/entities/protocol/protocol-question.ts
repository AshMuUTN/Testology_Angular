import { Image } from "@entities/image/image";
import { Option } from "@entities/question/option";
import { Answer } from "./answer";

export interface ProtocolQuestion {
    id: number;
    text: string;
    subtestId: number;
    options?: Option[]; // not all questions have options
    image?: Image;
    imageId?: number;
    answer?: Answer;
}
