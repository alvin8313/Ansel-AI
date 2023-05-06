import { create } from "zustand";
import { persist } from "zustand/middleware";
import Fuse from "fuse.js";
<<<<<<< HEAD
=======
import { getLang } from "../locales";
import { StoreKey } from "../constant";
>>>>>>> e773ed2912d2484d58c2f521d7f098d6da12baf5

export interface Prompt {
  id?: number;
  isUser?: boolean;
  title: string;
  content: string;
}

export interface PromptStore {
  counter: number;
  latestId: number;
  prompts: Record<number, Prompt>;

  add: (prompt: Prompt) => number;
  get: (id: number) => Prompt | undefined;
  remove: (id: number) => void;
  search: (text: string) => Prompt[];
  update: (id: number, updater: (prompt: Prompt) => void) => void;

  getUserPrompts: () => Prompt[];
}

export const SearchService = {
  ready: false,
  builtinEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  userEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  count: {
    builtin: 0,
  },
<<<<<<< HEAD
=======
  allPrompts: [] as Prompt[],
  builtinPrompts: [] as Prompt[],
>>>>>>> e773ed2912d2484d58c2f521d7f098d6da12baf5

  init(builtinPrompts: Prompt[], userPrompts: Prompt[]) {
    if (this.ready) {
      return;
    }
<<<<<<< HEAD
    this.engine.setCollection(prompts);
=======
    this.allPrompts = userPrompts.concat(builtinPrompts);
    this.builtinPrompts = builtinPrompts.slice();
    this.builtinEngine.setCollection(builtinPrompts);
    this.userEngine.setCollection(userPrompts);
>>>>>>> e773ed2912d2484d58c2f521d7f098d6da12baf5
    this.ready = true;
  },

  remove(id: number) {
    this.userEngine.remove((doc) => doc.id === id);
  },

  add(prompt: Prompt) {
    this.userEngine.add(prompt);
  },

  search(text: string) {
    const userResults = this.userEngine.search(text);
    const builtinResults = this.builtinEngine.search(text);
    return userResults.concat(builtinResults).map((v) => v.item);
  },
};

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      counter: 0,
      latestId: 0,
      prompts: {},

      add(prompt) {
        const prompts = get().prompts;
        prompt.id = get().latestId + 1;
        prompt.isUser = true;
        prompts[prompt.id] = prompt;

        set(() => ({
          latestId: prompt.id!,
          prompts: prompts,
        }));

        return prompt.id!;
      },

      get(id) {
        const targetPrompt = get().prompts[id];

        if (!targetPrompt) {
          return SearchService.builtinPrompts.find((v) => v.id === id);
        }

        return targetPrompt;
      },

      remove(id) {
        const prompts = get().prompts;
        delete prompts[id];
        SearchService.remove(id);

        set(() => ({
          prompts,
          counter: get().counter + 1,
        }));
      },

      getUserPrompts() {
        const userPrompts = Object.values(get().prompts ?? {});
        userPrompts.sort((a, b) => (b.id && a.id ? b.id - a.id : 0));
        return userPrompts;
      },

      update(id: number, updater) {
        const prompt = get().prompts[id] ?? {
          title: "",
          content: "",
          id,
        };

        SearchService.remove(id);
        updater(prompt);
        const prompts = get().prompts;
        prompts[id] = prompt;
        set(() => ({ prompts }));
        SearchService.add(prompt);
      },

      search(text) {
<<<<<<< HEAD
=======
        if (text.length === 0) {
          // return all rompts
          return SearchService.allPrompts.concat([...get().getUserPrompts()]);
        }
>>>>>>> e773ed2912d2484d58c2f521d7f098d6da12baf5
        return SearchService.search(text) as Prompt[];
      },
    }),
    {
      name: StoreKey.Prompt,
      version: 1,
      onRehydrateStorage(state) {
        const PROMPT_URL = "./prompts.json";

        type PromptList = Array<[string, string]>;

        fetch(PROMPT_URL)
          .then((res) => res.json())
          .then((res) => {
<<<<<<< HEAD
            const builtinPrompts = [res.en, res.cn]
              .map((promptList: PromptList) => {
=======
            let fetchPrompts = [res.en, res.cn];
            if (getLang() === "cn") {
              fetchPrompts = fetchPrompts.reverse();
            }
            const builtinPrompts = fetchPrompts.map(
              (promptList: PromptList) => {
>>>>>>> e773ed2912d2484d58c2f521d7f098d6da12baf5
                return promptList.map(
                  ([title, content]) =>
                    ({
                      id: Math.random(),
                      title,
                      content,
                    } as Prompt),
                );
              },
            );

            const userPrompts =
              usePromptStore.getState().getUserPrompts() ?? [];

            const allPromptsForSearch = builtinPrompts
              .reduce((pre, cur) => pre.concat(cur), [])
              .filter((v) => !!v.title && !!v.content);
            SearchService.count.builtin = res.en.length + res.cn.length;
            SearchService.init(allPromptsForSearch, userPrompts);
          });
      },
    },
  ),
);
