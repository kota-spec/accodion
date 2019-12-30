/**
 * document.querySelectorAllなどで取得したdomをmapとかで回す時に使う
 * @param {object} obj - document.querySelectorAllなどで取得したオブジェクト
 */
export const makeArray = obj => {
  const array = [];
  if (obj && obj.length > 1) {
    // convert nodeList to array
    for (let i = 0, num = obj.length; i < num; i++) {
      array[i] = obj[i];
    }
  } else {
    array.push(obj);
  }
  return array;
};
