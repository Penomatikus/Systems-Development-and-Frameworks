import { shallowMount } from "@vue/test-utils";
import ListItem from "@/components/ListItem.vue";

describe("ListItem.vue", () => {
  it("Register is a component", () => {
  const wrapper = shallowMount(ListItem, {
  propsData: { 
    todo: {
        id: 1,
  newMessage: ""
    }
      }
}); 

expect(wrapper.vm.newMessage).toBe("");

})

});
