const setLocalStorage = (lsName: string, lsValue: string): void => {
  localStorage.setItem(lsName, lsValue);
};

const getLocalStorage = (lsName: string = ""): string | null => {
  return localStorage.getItem(lsName);
};

const deleteLocalStorage = (lsName: string) => {
  localStorage.removeItem(lsName);
};

const clearLocalStorage = () => {
  localStorage.clear();
};

export {
  setLocalStorage as setLS,
  getLocalStorage as getLS,
  deleteLocalStorage as deleteLS,
  clearLocalStorage as clearLS,
};
