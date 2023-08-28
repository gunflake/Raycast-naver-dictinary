import axios from "axios";
import * as crypto from "crypto";

const NAVER_DICTIONARY_URL = "https://ac-dict.naver.com/enko/ac";

export interface DictionaryEntry {
  id: string;
  title: string;
  subtitle: string;
}

export const getDictionaryData = async (word: string): Promise<DictionaryEntry[]> => {
  const url = NAVER_DICTIONARY_URL;
  const params = {
    q_enc: "utf-8",
    st: 11001,
    r_format: "json",
    r_enc: "utf-8",
    r_lt: 10001,
    r_unicode: 0,
    r_escape: 1,
    q: word,
  };

  try {
    const response = await axios.get(url, { params });

    const result = await processData(response.data);
    return result ?? [];
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    throw error;
  }
};

const processData = async (data: any) => {
  try {
    const results: DictionaryEntry[] = [];

    console.log(JSON.stringify(data));

    for (const items of data["items"]) {
      for (const item of items) {
        if (item.length > 0) {
          const txt = item[0][0];
          const rtxt = item[2][0];
          results.push({
            id: crypto.randomUUID(),
            title: txt,
            subtitle: rtxt,
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error(`Error occurred: ${error}`);
  }
};
