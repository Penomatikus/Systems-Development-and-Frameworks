import { shallowMount } from "@vue/test-utils";
import ListItem from "@/components/ListItem.vue";

describe("ListItem.vue", () => {
  it("Register is a component", () => {
  const wrapper = shallowMount(ListItem,{
  todo: {
        id: '1',
	newMessage: ""
      }
});

  // checks ListItem is a component.

    expect(wrapper.isVueInstance()).toBeTruthy();
  });


});
