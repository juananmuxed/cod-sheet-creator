import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import IconComponentVue from "../IconComponent.vue";

describe("IconComponent.vue test", () => {
  const NAME = "check";
  let wrapper: VueWrapper | null = null;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("mount all icons", () => {
    wrapper = shallowMount(IconComponentVue, {
      props: {
        name: NAME,
        height: 24,
        width: 24,
      },
    });
  });
});
