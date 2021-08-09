/**
 * custom Event
 *
 * NOTE: these are likely SYNCRONOUS
 */
// from:
// https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript/25833162

// You can simply create a new EventTarget instance
// like some have suggested without having to create a DOM object, like so:

const target = new EventTarget();
target.addEventListener('customEvent', console.log);
target.dispatchEvent(new Event('customEvent'));

// This provides all the functionality you're used to with DOM events
// and doesn't require an empty document element or node to be created.

// See the Mozilla Developer Guide for more information:
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
