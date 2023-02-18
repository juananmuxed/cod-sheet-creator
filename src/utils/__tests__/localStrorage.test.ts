import { describe, it, expect, afterEach, vi } from "vitest";
import { getLS, setLS, deleteLS, clearLS } from "../localStorage";

describe("Local storage", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
  const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
  const clearSpy = vi.spyOn(Storage.prototype, "clear");

  afterEach(() => {
    getItemSpy.mockClear();
    setItemSpy.mockClear();
    removeItemSpy.mockClear();
    clearSpy.mockClear();
    localStorage.clear();
  });

  it("get local storage", () => {
    const KEY = "key";
    const arrayString = [1, 2, 3, 4, 5].toString();

    localStorage.setItem(KEY, arrayString);

    expect(getLS(KEY)).toStrictEqual(arrayString);
    expect(getItemSpy).toHaveBeenCalledWith(KEY);
  });

  it("set local storage", () => {
    const KEY = "key";
    const arrayString = [1, 2, 3, 4, 5].toString();

    setLS(KEY, arrayString);

    expect(setItemSpy).toHaveBeenCalledWith(KEY, arrayString);
    expect(getLS(KEY)).toStrictEqual(arrayString);
  });

  it("remove local storage", () => {
    const KEY = "key";
    const arrayString = [1, 2, 3, 4, 5].toString();

    setLS(KEY, arrayString);

    expect(getLS(KEY)).toStrictEqual(arrayString);

    deleteLS(KEY);

    expect(removeItemSpy).toHaveBeenCalledWith(KEY);
    expect(getLS(KEY)).toBeNull();
  });

  it("remove local storage", () => {
    const KEY = "key";
    const KEY_OBJ = "key-obj";
    const arrayString = [1, 2, 3, 4, 5].toString();
    const object = { test: 1, data: "test" };

    setLS(KEY, arrayString);
    setLS(KEY_OBJ, JSON.stringify(object));

    expect(getLS(KEY)).toStrictEqual(arrayString);
    expect(getLS(KEY_OBJ)).toStrictEqual(JSON.stringify(object));

    clearLS();

    expect(clearSpy).toHaveBeenCalled();
    expect(getLS(KEY)).toBeNull();
    expect(getLS(KEY_OBJ)).toBeNull();
  });
});
