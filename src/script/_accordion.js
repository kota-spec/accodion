import { TweenLite, Expo } from 'gsap';
import { makeArray } from './_make-array';

/**
 * アコーディオン
 *
 * domの構成とcssは必ず下記のようにお願いします。
 * js-accordion-inner、js-accordion-heading、js-accordion-contentsのクラス名は必ずふってください
 *
 * @param {string} name アコーディオンを全体をラップしているクラス名
 * @param {number} [options.speed] アコーディオンのスピード
 * @param {boolean} [options.isOnly] 開く要素を一つのみにする
 *
 * @example
 * <div class="name"> // nameは引数で受け取るクラス名です
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
const accordion = (name, options = {}) => {
  // 引数が定義されているか確認。
  if (name === '' && typeof name === 'undefined') return;

  const $$wrap = document.querySelectorAll(`.${name}`);

  let height;
  let wrapHeight;

  const { speed = 0.4, isOnly = false } = options;

  makeArray($$wrap).forEach(r => {
    r.querySelector('.js-accordion-heading').addEventListener('click', e => {
      const $$heading = e.currentTarget; // 選択した要素の見出し
      const $$parent = $$heading.parentNode; // 選択した要素の親のDOM
      const $$contents = $$heading.nextElementSibling; // 選択した要素のコンテンツ

      const isOpen = $$parent.classList.contains('open'); // 選んだ要素が開いているか確認

      let timer = -1;

      // 開く要素は一つのみにする
      if (isOnly) {
        makeArray($$wrap).forEach(el => {
          // 全ての各要素を取得
          const $$allInner = el.querySelector('.js-accordion-inner');
          const $$allHeading = el.querySelector('.js-accordion-heading');
          const $$allContents = el.querySelector('.js-accordion-contents');

          // クリックした要素が開いていないかつ他の要素が開いている場合
          if (!isOpen && $$allInner.classList.contains('open')) {
            const headingHeight = $$allHeading.offsetHeight; // 見出しの高さを格納
            $$allInner.classList.remove('open'); // クラスを削除

            // アコーディオンを閉じる
            TweenLite.to($$allInner, speed, {
              height: `${headingHeight}px`, // 見出しの高さまで戻す
              ease: Expo.easeInOut,
              onComplete: () => {
                $$allContents.style.display = 'none';
                $$allInner.style.height = 'auto';
              }
            });
          }
        });
      }

      // アコーディオンの開閉の処理
      if (!isOpen) {
        $$parent.classList.add('open'); // クラスの取り外し
        // contentsを表示
        $$contents.style.display = 'block';

        // contentsを表示したら見出しの高さと、全体の高さを格納
        height = $$heading.offsetHeight;
        wrapHeight = $$parent.offsetHeight;

        // 全体を見出しの高さにする
        $$parent.style.height = `${height}px`;

        timer = window.setTimeout(() => {
          TweenLite.to($$parent, speed, {
            height: `${wrapHeight}px`,
            ease: Expo.easeInOut,
            onComplete: () => {
              $$parent.style.height = 'auto';
            }
          });
        }, 0);
      } else {
        window.clearTimeout(timer); // setTimeoutをリセット
        $$parent.classList.remove('open');
        TweenLite.to($$parent, speed, {
          height: `${height}px`, // 見出しの高さまで戻す
          ease: Expo.easeInOut,
          onComplete: () => {
            $$contents.style.display = 'none';
            $$parent.style.height = 'auto';
          }
        });
      }
    });
  });
};

export default accordion;
