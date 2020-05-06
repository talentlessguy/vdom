(function () {
  'use strict';

  /**
   * @returns {boolean}
   * @description Check if node is text
   * @param {string} node
   * */
  const isTextNode = (node) =>
    ['string', 'boolean', 'number'].includes(typeof node);

  /**
   * @description Renders a single node
   * @param {{
   * tag: string
   * props: any
   * children: any[]
   * }} vnode
   * @returns {HTMLElement}
   */
  const renderNode = (vnode) => {
    let el;

    if (isTextNode(vnode)) {
      return document.createTextNode(vnode.toString())
    }

    const { tag, props, children } = vnode;

    el = document.createElement(tag);

    if (props) {
      for (let [k, v] of Object.entries(props)) {
        if (k === 'style') {
          for (let [prop, val] of Object.entries(v)) {
            el.style[prop] = val;
          }
        } else el.setAttribute(k, v);
      }
    }

    children.map((child) => el.appendChild(renderNode(child)));

    return el
  };

  /**
   * @description Appends vDOM inside of real DOM
   * @param {{
   * tag: string
   * props: any
   * children: any[]
   * }} vnode
   * @param {HTMLElement} target
   * @returns {HTMLElement}
   */
  const render = (vnode, target) => {
    target.appendChild(renderNode(vnode));

    return renderNode(vnode)
  };

  const diffProps = (oldProps, newProps) => {
    const patches = [];

    // setting new props
    if (newProps) {
      for (let [k, v] of Object.entries(newProps)) {
        patches.push(node => {
          if (k === 'style') {
            for (let [prop, val] of Object.entries(v)) {
              node.style[prop] = val;
            }
          } else node.setAttribute(k, v);
          return node
        });
      }
    }

    // removing props
    for (let k in oldProps) {
      if (!(k in newProps)) {
        patches.push(node => {
          node.removeAttribute(k);
          return node
        });
      }
    }

    return node => {
      for (let patch of patches) patch(node);
      return node
    }
  };

  const diffChildren = (oldChildren, newChildren) => {
    const patches = [];

    oldChildren.map((oldChild, i) => patches.push(diff(oldChild, newChildren[i])));

    const additionalPatches = [];
    for (let additionalVChild of newChildren.slice(oldChildren.length)) {
      additionalPatches.push(node => {
        node.appendChild(renderNode(additionalVChild));
        return node
      });
    }

    return parent => {

      Array.from(parent.childNodes).map((child, i) => patches[i](child));

      for (let patch of additionalPatches) patch(parent);

      return parent
    }
  };

  const diff = (oldTree, newTree) => {

    const renderAndReplace = node => {
      const newNode = renderNode(newTree);
      node.replaceWith(newNode);
      return newNode
    };

    if (newTree === undefined) {
      return node => {
        node.remove();
        return undefined
      }
    }

    if (isTextNode(oldTree) || isTextNode(newTree)) {
      if (oldTree !== newTree) {
        return renderAndReplace
      } else {
        return node => node
      }
    }

    if (oldTree.tag !== newTree.tag) {
      return renderAndReplace
    }

    const patchProps = diffProps(oldTree.props, newTree.props);
    const patchChildren = diffChildren(oldTree.children, newTree.children);

    return node => {
      patchProps(node);
      patchChildren(node);
      return node
    }
  };

  /**
   *
   * @param {string} tag
   *
   * @example
   *
   * const node = h('div', null, 'Hello World')
   *
   * @description Returns vnode
   *
   * */
  const h = (tag = 'div', props = null, ...children) => ({
    tag,
    props,
    children,
  });

  var n=function(t,r,u,e){for(var p=1;p<r.length;p++){var s=r[p],h="number"==typeof s?u[s]:s,a=r[++p];1===a?e[0]=h:3===a?e[1]=Object.assign(e[1]||{},h):5===a?(e[1]=e[1]||{})[r[++p]]=h:6===a?e[1][r[++p]]+=h+"":e.push(a?t.apply(null,n(t,h,u,["",null])):h);}return e},t=function(n){for(var t,r,u=1,e="",p="",s=[0],h=function(n){1===u&&(n||(e=e.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?s.push(n||e,0):3===u&&(n||e)?(s.push(n||e,1),u=2):2===u&&"..."===e&&n?s.push(n,3):2===u&&e&&!n?s.push(!0,5,e):u>=5&&((e||!n&&5===u)&&(s.push(e,u,r),u=6),n&&(s.push(n,u,r),u=6)),e="";},a=0;a<n.length;a++){a&&(1===u&&h(),h(a));for(var f=0;f<n[a].length;f++)t=n[a][f],1===u?"<"===t?(h(),s=[s],u=3):e+=t:4===u?"--"===e&&">"===t?(u=1,e=""):e=t+e[0]:p?t===p?p="":e+=t:'"'===t||"'"===t?p=t:">"===t?(h(),u=1):u&&("="===t?(u=5,r=e,e=""):"/"===t&&(u<5||">"===n[a][f+1])?(h(),3===u&&(s=s[0]),u=s,(s=s[0]).push(u,2),u=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(h(),u=2):e+=t),3===u&&"!--"===e&&(u=4,s=s[0]);}return h(),s},r="function"==typeof Map,u=r?new Map:{},e=r?function(n){var r=u.get(n);return r||u.set(n,r=t(n)),r}:function(n){for(var r="",e=0;e<n.length;e++)r+=n[e].length+"-"+n[e];return u[r]||(u[r]=t(n))};function htm(t){var r=n(this,e(t),arguments,[]);return r.length>1?r:r[0]}

  const html = htm.bind(h);

  let App = (counter) =>
    html`
    <p style="${{ fontSize: counter * 10 + 'px' }}"><span>${counter}</span></p>
  `;

  let AppWithProps = App(0);

  let mount = render(AppWithProps, document.getElementById('app'));

  setInterval(() => {
    const newCounter = parseInt(Math.random() * 10);

    const newApp = App(newCounter);

    const patch = diff(AppWithProps, newApp);

    AppWithProps = newApp;

    document.getElementById('app').firstChild.replaceWith(patch(mount));
  }, 1000);

}());
