import { getLS } from "@/utils/localStorage";

import es from "./translate/es/index";
import en from "./translate/en/index";

export interface IKeyObject {
  [key: string]: IKeyObject;
}

const defaultLocale = "es";
const locale = getLS("lang") || defaultLocale;

const messages: IKeyObject = {};

messages.es = es as any;
messages.en = en as any;

export { messages, defaultLocale, locale };
