import { v4 as uuidv4 } from "uuid";
import Key from "../models/Key";

export const generateKey = async (key: string): Promise<string> => {
  const keyExists = await Key.find({ value: key });

  if (keyExists.length === 0)
    return key;

  return generateKey(uuidv4());
}