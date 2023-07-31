import { reactive, readonly } from 'vue';

const state = reactive({
  eventListeners: {},
});

const eventBus = {
  on(eventName, callback) {
    if (!state.eventListeners[eventName]) {
      state.eventListeners[eventName] = [];
    }
    state.eventListeners[eventName].push(callback);
  },

  emit(eventName, ...args) {
    const listeners = state.eventListeners[eventName];
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
  },
};

export default readonly(eventBus);
