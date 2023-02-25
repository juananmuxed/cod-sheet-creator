import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import CheckboxComponentVue from "../CheckboxComponent.vue";

describe("CheckboxComponent.vue test", () => {
  const ID = "Id";
  const LABEL = "Label";
  const TEST_HTML = "<b>Test</b>";
  let wrapper: VueWrapper | null = null;

  beforeEach(() => {
    wrapper = shallowMount(CheckboxComponentVue, {
      props: {
        modelValue: true,
        id: ID,
        label: LABEL,
      },
      "onUpdate:modelValue": (e: any) => wrapper?.setProps({ modelValue: e }),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it("test default slot", () => {
    wrapper?.unmount();
    wrapper = shallowMount(CheckboxComponentVue, {
      slots: {
        default: TEST_HTML,
      },
      props: {
        modelValue: true,
        id: ID,
      },
    });
    expect(wrapper?.html()).toMatch(TEST_HTML);
  });

  it("class", () => {
    expect(wrapper?.find("div").classes()).toContain("input-checkbox");
  });

  it("id", () => {
    expect(wrapper?.find("input").element.id).toMatch(ID);
  });

  it("type", () => {
    expect(wrapper?.find("input").element.type).toMatch("checkbox");
  });

  it("value", () => {
    expect(wrapper?.find("input").element.value).toBeTruthy();
  });

  it("emit value to false", () => {
    wrapper?.find("div.control").trigger("click");

    const clickEvent = wrapper?.emitted("update:modelValue");
    expect(wrapper?.emitted()).toHaveProperty("update:modelValue");
    expect(clickEvent?.[0][0]).toBeFalsy();
  });

  it("change model in input", () => {
    wrapper?.find("input").setValue(false);

    const clickEvent = wrapper?.emitted("update:modelValue");
    expect(wrapper?.emitted()).toHaveProperty("update:modelValue");
    expect(clickEvent?.[0][0]).toBeFalsy();
  });
});
