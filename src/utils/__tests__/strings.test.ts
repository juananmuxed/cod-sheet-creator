import { describe, it, expect } from "vitest";
import { kebabize } from "../strings";

describe("Kebabize", () => {
  it("camel to kebab case", () => {
    const camelString = "notKebabCase";
    const kebabString = "not-kebab-case";
    expect(kebabize(camelString)).toMatch(kebabString);
  });

  it("capitalize to kebab case", () => {
    const capitalize = "Capitalize";
    const kebabString = "capitalize";
    expect(kebabize(capitalize)).toMatch(kebabString);
  });
});
