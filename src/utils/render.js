import Abstract from '../view/abstract';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  if (oldChild === null || newChild === null) {
    throw new Error('Can\'t replace not existing elements');
  }

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Can\'t replace not existing elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
