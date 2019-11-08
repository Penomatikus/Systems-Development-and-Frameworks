import { shallowMount } from "@vue/test-utils";
import ListItem from "@/components/ListItem.vue";

const wrapper = shallowMount(ListItem, {
  propsData: {
    todo: {
      id: 1,
      message: "todo.text"
    }
  }
});

describe("ListItem.vue", () => {
  it("renders todo.text", () => {
    expect(wrapper.html()).toContain("todo.text");
  });
  it("does not show input field", () => {
    expect(wrapper.find("input").exists()).toBe(false);
  });
  describe("click on 'Edit' button", () => {
    it("show input field", () => {
      wrapper.find("#edit").trigger("click");

      expect(wrapper.find("input").exists()).toBe(true);
    });
    describe("edit text and submit", () => {
      it("$emits 'save' with edited todo", () => {
        wrapper.find("#save").trigger("click");

        expect(wrapper.emitted("update-todo")).toBeTruthy();
      });
    });
  });
  describe("click on 'Delete' button", () => {
    it("$emit 'delete'", () => {
      wrapper.find("#delete").trigger("click");

      expect(wrapper.emitted("delete-todo")).toBeTruthy();
    });
  });
});
