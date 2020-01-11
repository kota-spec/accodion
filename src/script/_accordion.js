import gsap from 'gsap';

export class Accordion {
  /**
   * アコーディオン
   * * gsap v3 がないと動きません。
   *
   * domの構成とcssは必ず下記のようにお願いします。
   * js-accordion-inner、js-accordion-heading、js-accordion-contentsのクラス名は必ずふってください
   *
   * @param {string|NodeList|Element|Element[]} target アコーディオンを全体をラップしているクラス名
   * @param {number} [options.speed] アコーディオンのスピード
   * @param {boolean} [options.isOnly] 開く要素を一つのみにする
   *
   * @example
   * <div class="target"> // nameは引数で受け取るクラス名です
   *    <div style={overflow: 'hidden'} class="js-accordion-inner">
   *        <div class="js-accordion-heading">
   *           // ここの部分がアコーディオンのトリガーになります
   *        </div>
   *        <div style={display: 'none'} class="js-accordion-contents">
   *          // ここの部分がアコーディオンが開いた時のコンテンツ部分になります
   *        </div>
   *    </div>
   * </div>
   */

  constructor (target, options = {}) {
    const { speed = 0.4, isOnly = false } = options;

    this._els = this._getElements(target); // 指定されたDOMをここに格納
    this._isOnly = isOnly; // 空いてるアコーディオンは一つのみ
    this._speed = speed; // 開閉のスピード
    this._items = []; // 要素の色々な情報を入れる箱

    this._current = 0; // 現在開いているアコーディオンの番号を格納

    this._onAccordion = this._onAccordion.bind(this);
  }

  init () {
    this._setCache();
    this._onListener();
  }

  _onListener () {
    if (this._items.length !== 0) {
      this._items.forEach(r => {
        r.el.addEventListener('click', this._onAccordion);
      });
    }
  }

  // アコーディオンに必要なデータを格納
  _setCache () {
    this._items = this._els.map((r, i) => {
      const el = r.querySelector('.js-accordion-heading');
      const parent = el.parentNode;
      const nextEl = el.nextElementSibling;

      // データ属性装着
      el.setAttribute('data-id', i);

      return {
        el,
        wrapEl: r,
        parent,
        contents: nextEl,
        isOpen: false,
        timer: -1
      };
    });
  }

  // アコーディオンの開閉の処理
  _onAccordion (e) {
    this._current = Number(e.currentTarget.dataset.id);

    const { el, isOpen, parent, contents } = this._items[this._current];

    if (this._isOnly) {
      this.close(); // 空いているアコーディオンを閉じる
    }

    // contentsを表示したら見出しの高さと、全体の高さを格納
    const height = el.clientHeight;

    // アコーディオンの開閉の処理
    if (!isOpen) {
      window.clearTimeout(this._items[this._current].timer); // setTimeoutをリセット
      this._items[this._current].isOpen = !isOpen;

      // 全体を見出しの高さにする
      parent.style.height = `${height}px`;

      // contentsを表示
      contents.style.display = 'block';

      // 開閉の高さを取得
      const wrapHeight = contents.clientHeight + height;

      this._items[this._current].timer = window.setTimeout(() => {
        gsap.to(parent, this._speed, {
          height: `${wrapHeight}px`,
          duration: this._speed,
          ease: 'expo.inOut',
          onComplete: () => {
            parent.style.height = 'auto';
          }
        });
      }, 0);
    } else {
      window.clearTimeout(this._items[this._current].timer); // setTimeoutをリセット

      this._items[this._current].isOpen = !this._items[this._current].isOpen;

      gsap.to(parent, {
        height: `${height}px`, // 見出しの高さまで戻す
        duration: this._speed,
        ease: 'expo.inOut',
        onComplete: () => {
          contents.style.display = 'none';
          parent.style.height = 'auto';
        }
      });
    }
  }

  // 空いているアコーディオンを全て閉じる
  close () {
    this._items.forEach(r => {
      const { isOpen, el, parent, contents } = r;

      // クリックした要素が開いていないかつ他の要素が開いている場合
      if (isOpen) {
        // contentsを表示したら見出しの高さと、全体の高さを格納
        const height = el.clientHeight;

        r.isOpen = !isOpen;

        gsap.to(parent, {
          height: `${height}px`, // 見出しの高さまで戻す
          ease: 'expo.inOut',
          duration: this._speed,
          onComplete: () => {
            contents.style.display = 'none';
            parent.style.height = 'auto';
          }
        });
      }
    });
  }

  /**
   * domの入った配列を返す
   * @param {NodeList} nodeList NodeListをただのarrayに変換
   */
  _makeArray (nodeList) {
    return nodeList ? Array.prototype.slice.call(nodeList, 0) : [];
  }

  /**
   * domを取得
   * @param {string|NodeList|Element|Element[]} target
   * @param {string} context 親のdom
   */
  _getElements (target, context = document) {
    if (typeof target === 'string') {
      // string
      const nodeList = context.querySelectorAll(target);
      return this._makeArray(nodeList);
    } else if (target.length) {
      if (target.map) {
        // Array
        return target;
      } else {
        // NodeList
        return this._makeArray(target);
      }
    } else {
      // Element
      return [target];
    }
  }
}

export default Accordion;
