import accordion from './_accordion';

(() => {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('example template');
    accordion('js-wrap', {
      speed: 0.2,
      isOnly: true
    });
  });
})();
