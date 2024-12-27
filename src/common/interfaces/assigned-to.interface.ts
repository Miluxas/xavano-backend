import { MediaRef } from "../types/media-ref.type";
import { MultiLanguage } from "../types/multi-language.type";

export interface IAssignedTo {
  entity: string;
  title: string;
  id: number;
  ml_title: MultiLanguage;
  mediaRef?:MediaRef
}
