import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import BadgeComponentVue from "../BadgeComponent.vue";

describe("BadgeComponent.vue test", () => {
  const TEST = "Test";
  const TEST_HTML = "<b>Test</b>";
  const COLOR = "secondary";
  const CENTER = "center";
  const TITLE = "Text title";
  let wrapper: VueWrapper | null = null;

  beforeEach(() => {
    wrapper = shallowMount(BadgeComponentVue, {
      props: {
        label: TEST,
        color: COLOR,
        rounded: true,
        outlined: true,
        small: true,
        align: CENTER,
        title: TITLE,
      },
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it("test default slot", () => {
    wrapper?.unmount();
    wrapper = shallowMount(BadgeComponentVue, {
      slots: {
        default: TEST_HTML,
      },
    });
    expect(wrapper?.html()).toMatch(TEST_HTML);
  });

  it("test label", () => {
    expect(wrapper?.text()).toMatch(TEST);
  });

  it("class", () => {
    expect(wrapper?.find("div").classes()).toContain("badge");
  });

  it("test color", () => {
    expect(wrapper?.find("div").classes()).toContain(COLOR);
    expect(wrapper?.find("div").classes()).not.toContain("primary");
  });

  it("test rounded", () => {
    expect(wrapper?.find("div").classes()).toContain("rounded");
  });

  it("test outlined", () => {
    expect(wrapper?.find("div").classes()).toContain("outlined");
  });

  it("test small", () => {
    expect(wrapper?.find("div").classes()).toContain("small");
  });

  it("test align", () => {
    expect(wrapper?.find("div").element.style.verticalAlign).toMatch(CENTER);
  });

  it("test title", () => {
    expect(wrapper?.find("span").attributes().title).toMatch(TITLE);
  });
});
