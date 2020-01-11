import Accordion from './_accordion';

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    const accordion = new Accordion('.js-wrap', {
      speed: 0.4,
      isOnly: true
    });
    accordion.init();
  });
})();
