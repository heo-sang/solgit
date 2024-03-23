import { atom, selector } from "recoil";

export const selectBranch = atom({
  key: "selectBranch",
  default: "",
});

export const selectedBranch = selector({
  key: "selectedBranch",
  get: ({ get }) => {
    const branch = get(selectBranch);
    return branch;
  },
});

export const pushedBranch = atom({
  key: "pushedBranch",
  default: "",
});

export const currentBranch = atom({
  key: "currentBranch",
  default: "",
});

export const deleteBranch = atom({
  key: "deleteBranch",
  default: "",
});
export const mergingBranch = atom({
  key: "mergingBranch",
  default: "",
});

export const pushedData = atom({
  key: "pushedData",
  default: {},
});
export const mergeRequest = atom({
  key: "mergeRequest",
  default: {},
});

export const mergeCommit = atom({
  key: "mergeCommit",
  default: [],
});

export const allRequests = atom({
  key: "allRequests",
  default: [],
});

export const mergedRequests = atom({
  key: "mergedRequests",
  default: [],
});

export const commandLine = atom({
  key: "commandLine",
  default: `cd "${localStorage.getItem("currentRepo")}"`,
});
export const reviewModal = atom({
  key: "reviewModal",
  default: false,
});

export const isLoading = atom({
  key: "isLoading",
  default: false,
});

export const pushBtn = atom({
  key: "pushBtn",
  default: "add",
});

export const committedFiles = atom({
  key: "committedFiles",
  default: [],
});

export const logsList = atom({
  key: "logsList",
  default: [],
});

export const deleteBtn = atom({
  key: "deleteBtn",
  default: false,
});

export const createBtn = atom({
  key: "createBtn",
  default: false,
});

export const cmtList = atom({
  key:"committedList",
  default:[]
})
