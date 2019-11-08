import { shallowMount } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import ListItem from "@/components/ListItem.vue";

describe("ListItem.vue", () => {
  it("renders todo.text", () => {
    const wrapper = shallowMount(ListItem, {
      propsData: { 
        todo: {
            id: 1,
            message: "todo.text"
        }
      }
    }); 

    expect(wrapper.html()).toContain('todo.text');
  })
  it("does not show input field", () => {
    const wrapper = shallowMount(ListItem, {
      propsData: { 
        todo: {
            id: 1,
      message: ""
        }
      }
    }); 

    expect(wrapper.find('input').exists()).toBe(false);
  })

  it("shows input field", () => {
    const wrapper = mount(ListItem, {
      propsData: { 
        todo: {
            id: 1,
      message: ""
        }
      }
    }); 

    wrapper.find('#edit').trigger('click')
  })
});
