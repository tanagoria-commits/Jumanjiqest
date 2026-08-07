# Lost Temple — исправление выравнивания пазла

## 1. Обнаруженная причина ошибки

Полупрозрачный силуэт реликвии центрируется с помощью CSS:

```css
.puzzle-board {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

Однако функция определения правильной позиции использует:

```javascript
board.offsetLeft
board.offsetTop
```

`offsetLeft` и `offsetTop` возвращают положение элемента **до применения `transform`**.

Из-за этого после принятия фрагмента код устанавливает его:

- правее силуэта приблизительно на половину ширины доски;
- ниже силуэта приблизительно на половину высоты доски;
- формально в «правильные» координаты DOM, но визуально за пределы изображения.

Именно это видно на скриншоте: счётчик увеличивается, но зелёный фрагмент оказывается правее и ниже соответствующей части полупрозрачной реликвии.

## 2. Требуемое поведение

- фрагменты можно устанавливать в любом порядке;
- игрок накладывает часть на полупрозрачный силуэт;
- после принятия часть перемещается точно поверх соответствующего участка силуэта;
- пять частей вместе должны полностью повторить исходное изображение реликвии;
- между установленными частями не должно быть непредусмотренных сдвигов;
- установленный фрагмент получает мягкое зелёное свечение.

## 3. Исправление координат

Нельзя использовать `offsetLeft` и `offsetTop` для элемента, который визуально перемещён через `transform`.

Необходимо вычислять координаты относительно общей игровой области через `getBoundingClientRect()`.

Исправленная функция:

```javascript
function correctPiecePosition(piece) {
  const room = document.querySelector("#puzzle-room");
  const board = document.querySelector("#puzzle-board");
  const index = Number(piece.dataset.piece);

  const roomRect = room.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  return {
    left: boardRect.left - roomRect.left,
    top:
      boardRect.top -
      roomRect.top +
      index * (boardRect.height / 5)
  };
}
```

Так координаты учитывают:

- `translate(-50%, -50%)`;
- фактический размер доски;
- адаптивное масштабирование;
- изменение размера окна;
- положение сцены относительно viewport.

## 4. Установка фрагмента

После правильного наложения использовать визуальные координаты:

```javascript
function snapPiece(piece) {
  if (piece.classList.contains("placed")) return;

  const target = correctPiecePosition(piece);
  const index = Number(piece.dataset.piece);

  piece.style.left = `${target.left}px`;
  piece.style.top = `${target.top}px`;
  piece.style.zIndex = index + 5;
  piece.classList.add("placed");

  state.fragments.add(String(index));
  renderFragmentSlots();
}
```

`left` и `top` должны задаваться относительно `#puzzle-room` или другого общего позиционированного контейнера.

Контейнер силуэта и контейнер фрагментов должны иметь одну систему координат:

```css
.puzzle-room {
  position: relative;
}

.puzzle-board,
.puzzle-pieces {
  position: absolute;
}

.puzzle-pieces {
  inset: 0;
}
```

## 5. Проверка наложения

Фрагмент считается правильно размещённым, если он пересекает общую область силуэта или отпущен рядом с ней.

Для проверки использовать визуальные прямоугольники:

```javascript
const pieceRect = piece.getBoundingClientRect();
const boardRect = board.getBoundingClientRect();
```

Пример определения пересечения:

```javascript
const overlapWidth = Math.max(
  0,
  Math.min(pieceRect.right, boardRect.right) -
  Math.max(pieceRect.left, boardRect.left)
);

const overlapHeight = Math.max(
  0,
  Math.min(pieceRect.bottom, boardRect.bottom) -
  Math.max(pieceRect.top, boardRect.top)
);

const overlapArea = overlapWidth * overlapHeight;
const pieceArea = pieceRect.width * pieceRect.height;
const overlapRatio = overlapArea / pieceArea;
```

Рекомендуемое условие:

```javascript
if (overlapRatio >= 0.08 || pointerNearSilhouette) {
  snapPiece(piece);
}
```

## 6. Порядок сборки

Порядок установки не должен быть фиксированным.

Игрок может сначала установить любой из пяти фрагментов:

```text
Fragment 4 → Fragment 1 → Fragment 5 → Fragment 2 → Fragment 3
```

Каждая часть содержит собственный `data-piece` и всегда примагничивается только к своей позиции:

```html
<button class="puzzle-piece" data-piece="0"></button>
<button class="puzzle-piece" data-piece="1"></button>
<button class="puzzle-piece" data-piece="2"></button>
<button class="puzzle-piece" data-piece="3"></button>
<button class="puzzle-piece" data-piece="4"></button>
```

Счётчик показывает количество установленных частей, а не номер следующего обязательного фрагмента.

## 7. Корректировка при изменении окна

После изменения размера viewport необходимо повторно вычислить размеры и позиции уже установленных частей.

```javascript
function layoutPuzzlePieces() {
  const board = document.querySelector("#puzzle-board");
  const pieces = [...document.querySelectorAll(".puzzle-piece")];

  pieces.forEach(piece => {
    if (!piece.classList.contains("placed")) return;

    const target = correctPiecePosition(piece);
    piece.style.left = `${target.left}px`;
    piece.style.top = `${target.top}px`;
  });
}
```

## 8. Мягкая зелёная подсветка

Текущая яркая заливка делает установленный фрагмент кислотно-зелёным и скрывает золотую текстуру реликвии.

Необходимо удалить:

```css
background-color: rgba(34, 190, 66, 0.42);
background-blend-mode: color-dodge;
outline: 2px solid #79f06b;
filter: brightness(2.1) drop-shadow(0 0 32px #baff8c);
```

Использовать слабое зелёное свечение без цветной заливки:

```css
.puzzle-piece.placed,
.puzzle-piece.placed:hover,
.puzzle-piece.placed:focus {
  background-color: transparent;
  background-blend-mode: normal;
  outline: 1px solid rgba(121, 225, 83, 0.28);
  filter:
    saturate(1.35)
    brightness(1.08)
    drop-shadow(0 0 7px rgba(116, 239, 82, 0.7));
  cursor: default;
}
```

После установки:

- золотая текстура остаётся основной;
- появляется только мягкий зелёный контур;
- нет сплошной зелёной заливки;
- нет сильного неонового свечения;
- фрагмент визуально отличается от ещё не установленных частей.

## 9. Проверка результата

После установки каждой части проверить:

```javascript
const pieceRect = piece.getBoundingClientRect();
const boardRect = board.getBoundingClientRect();
const index = Number(piece.dataset.piece);

const expectedTop =
  boardRect.top +
  index * (boardRect.height / 5);

console.assert(
  Math.abs(pieceRect.left - boardRect.left) < 2,
  "Fragment is shifted horizontally"
);

console.assert(
  Math.abs(pieceRect.top - expectedTop) < 2,
  "Fragment is shifted vertically"
);
```

## 10. Критерии готовности

- [ ] `correctPiecePosition()` использует `getBoundingClientRect()`.
- [ ] Учитывается CSS-трансформация доски.
- [ ] Фрагменты устанавливаются точно поверх силуэта.
- [ ] Нет смещения вправо на половину ширины доски.
- [ ] Нет смещения вниз на половину высоты доски.
- [ ] Части можно устанавливать в любом порядке.
- [ ] После изменения размера окна части остаются на силуэте.
- [ ] Установленный фрагмент сохраняет золотую текстуру.
- [ ] Используется только мягкая зелёная подсветка.
- [ ] Сплошная ярко-зелёная заливка удалена.
