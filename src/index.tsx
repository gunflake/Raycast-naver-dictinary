import { Action, ActionPanel, List } from "@raycast/api";
import { useState } from "react";
import { useDebounce } from "react-use";
import { DictionaryEntry, getDictionaryData } from "./api";
import { getNaverDictionaryUrl } from "./function";

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
              <Action.CopyToClipboard content={el.subtitle.split(",")[0]} shortcut={{ modifiers: ["cmd"], key: "1" }} />
              <Action.CopyToClipboard content={el.subtitle.split(",")[1]} shortcut={{ modifiers: ["cmd"], key: "2" }} />
              <Action.CopyToClipboard content={el.subtitle.split(",")[2]} shortcut={{ modifiers: ["cmd"], key: "3" }} />
              <Action.CopyToClipboard content={el.subtitle.split(",")[3]} shortcut={{ modifiers: ["cmd"], key: "4" }} />
              <Action.OpenInBrowser url={getNaverDictionaryUrl(el.title)} shortcut={{ modifiers: ["cmd"], key: "`" }} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
