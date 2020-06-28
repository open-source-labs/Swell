import reducer from "../src/client/reducers/ui";

describe("UI Reducer", () => {
  let state;

  beforeEach(() => {
    state = {
      warningIsDisplayed: null,
      composerDisplay: "Request",
    };
  });

  describe("SHOW_WARNING", () => {
    const action = { type: "SHOW_WARNING" };

    it("should set warningIsDisplayed to true", () => {
      const { warningIsDisplayed } = reducer(state, action);
      expect(warningIsDisplayed).toBe(true);
    });
  });

  describe("HIDE_WARNING", () => {
    const action = { type: "HIDE_WARNING" };

    it("should set warningIsDisplayed to false", () => {
      const { warningIsDisplayed } = reducer(state, action);
      expect(warningIsDisplayed).toBe(false);
    });
  });

  describe("SET_COMPOSER_DISPLAY", () => {
    const action = { type: "SET_COMPOSER_DISPLAY", payload: "CHANGE" };

    it("should update the composerDisplay", () => {
      const { composerDisplay } = reducer(state, action);
      expect(composerDisplay).toEqual(action.payload);
    });
  });
});
