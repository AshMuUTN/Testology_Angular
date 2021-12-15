import { Image } from "@entities/image/image";
import { Option } from "./option";

export interface Question {
    id: number;
    text: string;
    subtestId: number;
    options?: Option[]; // not all questions have options, image or division
    image?: Image;
    imageId?: number;
    divisionId?: number;
}
