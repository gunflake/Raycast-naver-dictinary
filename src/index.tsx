import { Action, ActionPanel, List } from "@raycast/api";
import { useState } from "react";
import { useDebounce } from "react-use";
import { DictionaryEntry, getDictionaryData } from "./api";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchWord = async (query: string) => {
    if (query) {
      try {
        const data = await getDictionaryData(query);
        setDictionaryData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  useDebounce(
    () => {
      setIsLoading(true);
      searchWord(searchText);
    },
    500,
    [searchText]
  );

  return (
    <List onSearchTextChange={setSearchText} isLoading={isLoading}>
      {dictionaryData?.map((el) => (
        <List.Item
          key={el.id}
          title={el.title}
          subtitle={el.subtitle}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard content={el.title} />
              {/*<Action.OpenInBrowser url={getNaverDictionaryUrl(el.title)} />*/}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
