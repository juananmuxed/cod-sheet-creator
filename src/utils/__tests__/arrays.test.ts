import { describe, it, expect, beforeEach } from "vitest";
import { suffleArray } from "../arrays";

describe("Suffle arrays", () => {
  beforeEach(() => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.4;
    global.Math = mockMath;
  });

  it("suffled array", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const suffledArray = suffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const mockSuffledArray = [10, 1, 8, 2, 6, 7, 3, 9, 4, 5];
    expect(suffledArray.length).toBe(array.length);
    expect(suffledArray.toString()).toBe(mockSuffledArray.toString());
  });
});
