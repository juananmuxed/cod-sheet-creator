import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import CheckboxGroupComponentVue from "../CheckboxGroupComponent.vue";

describe("CheckboxGroupComponent.vue test", () => {
  const ARRAY_IDS = ["id01"];
  const ARRAY_IDS_MULTI = ["id01", "id02"];
  const OPTIONS = [
    {
      label: "Test 01",
      name: "TEST01",
      value: "id01",
    },
    {
      label: "Test 02",
      name: "TEST02",
      value: "id02",
    },
    {
      label: "Test 03",
      name: "TEST03",
      value: undefined,
    },
  ];
  let wrapper: VueWrapper | null = null;

  beforeEach(() => {
    wrapper = shallowMount(CheckboxGroupComponentVue, {
      props: {
        modelValue: ARRAY_IDS,
        options: OPTIONS,
      },
      "onUpdate:modelValue": (e: any) => wrapper?.setProps({ modelValue: e }),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it("length of model", () => {
    expect(wrapper?.findAll("label").length).toBe(OPTIONS.length);
  });

  it("class", () => {
    expect(wrapper?.find("div").classes()).toContain("checkbox-group");
  });

  it("emit event", () => {
    wrapper?.findAll("input")[1].setValue(ARRAY_IDS_MULTI);

    const clickEvent = wrapper?.emitted("update:modelValue");
    expect(wrapper?.emitted()).toHaveProperty("update:modelValue");
    expect(clickEvent?.[0][0]).toContain(ARRAY_IDS_MULTI[0]);
    expect(clickEvent?.[0][0]).toContain(ARRAY_IDS_MULTI[1]);
  });
});
