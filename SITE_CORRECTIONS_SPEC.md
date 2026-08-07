# Исправления для сайта Expedition Vault

## 1. Допуск при установке фрагментов пазла

### Проблема

Сейчас для установки фрагмента реликвии игроку может потребоваться слишком точно совместить его с силуэтом.

### Требуемое поведение

Фрагмент должен автоматически вставать в правильную позицию, даже если игрок отпустил его не точно поверх соответствующей части силуэта.

Необходимо добавить достаточно большую зону примагничивания:

- учитывать расстояние между фрагментом и его правильной позицией;
- принимать размещение, если фрагмент находится рядом с нужной областью;
- после успешного размещения автоматически перемещать часть в точные координаты;
- блокировать правильно установленный фрагмент;
- сохранять зелёно-золотой эффект правильной установки;
- не требовать попиксельного совпадения.

Рекомендуемый допуск:

```javascript
const snapDistance = Math.max(100, boardWidth * 0.35);
```

Дополнительно можно учитывать пересечение фрагмента с целевой зоной. Размещение считается правильным, если выполняется хотя бы одно условие:

1. центр фрагмента находится в пределах `snapDistance` от правильной позиции;
2. не менее 30–40% площади фрагмента пересекается с его целевой зоной;
3. указатель мыши или палец отпущен внутри расширенной области правильного слота.

Если фрагмент находится достаточно близко, показать:

> **Fragment secured.**

Если фрагмент отпущен далеко от правильной позиции, оставить существующее сообщение:

> **That fragment does not belong there. Try another position.**

### Критерии готовности

- [ ] Фрагмент не нужно совмещать с силуэтом точь-в-точь.
- [ ] Размещение рядом с правильной зоной активирует примагничивание.
- [ ] После примагничивания часть занимает точные координаты.
- [ ] Слишком далёкое размещение по-прежнему считается неправильным.
- [ ] Допуск одинаково удобно работает мышью и на сенсорных экранах.

---

## 2. Новая легенда

Заменить текущий текст в разделе **Legend** на следующий:

# Legend of the Hidden Jungle

They say that somewhere beyond the edge of the known world lies a jungle that cannot be found on any ordinary map.

For centuries, travelers have whispered of an ancient map hidden away and forgotten by time. Its ink never fades. Its paths never stay still. And when the map chooses a traveler, the world around them disappears.

You awaken beneath an endless emerald canopy, where ancient ruins sleep beneath tangled vines and unseen creatures move beyond the trees. Here, paths shift after sunset, stone guardians remember forgotten names, and the jungle allows no one to leave without proving themselves worthy.

The legends speak of three trials.

You must enter the **Lost Temple** and recover its shattered relic.

You must decipher the living runes of the **Jungle Code**.

And you must cross the **Hidden Trail**, where one wrong step may cause the path itself to vanish.

Only a traveler who completes all three trials can awaken the final gate and find the way home.

But the jungle remembers those who fail.

Some say their footsteps can still be heard among the trees.

And now, traveler, the map has chosen you.

### Адаптация текста

Полная версия используется на широких экранах, если она помещается рядом с видео без нарушения композиции.

Если полный текст не помещается, разрешается использовать сокращённую версию:

> They say that beyond the edge of the known world lies a jungle that appears on no ordinary map. Its paths never stay still, and when the map chooses a traveler, the world around them disappears.
>
> You awaken beneath an endless emerald canopy, where ancient ruins sleep beneath tangled vines and the jungle allows no one to leave without proving themselves worthy.
>
> Three trials stand between you and the way home: recover the shattered relic of the **Lost Temple**, decipher the living runes of the **Jungle Code**, and survive the **Hidden Trail**.
>
> Complete all three trials, and the final gate will awaken. Fail, and the jungle will remember your name.
>
> Now, traveler, the map has chosen you.

### Правила отображения

- Заголовок раздела: **Legend of the Hidden Jungle**.
- Названия трёх испытаний выделить полужирным.
- Не уменьшать основной текст до плохо читаемого размера.
- Предпочтительный размер текста — не менее `14px`.
- На небольших экранах разрешить размещение текста под видео.
- На мобильных устройствах можно использовать полную версию с обычной прокруткой страницы.
- Сокращать только текст легенды, но не названия испытаний и не финальную фразу.

### Критерии готовности

- [ ] Старый текст легенды полностью удалён.
- [ ] Используется новый заголовок.
- [ ] На широком экране текст помещается рядом с видео.
- [ ] Если места недостаточно, используется сокращённая версия.
- [ ] Текст остаётся читаемым и не выходит за границы блока.

---

## 3. Полноэкранная страница с реликвией

### Требование

Сцена сборки реликвии должна полностью помещаться в видимую область браузера без вертикальной и горизонтальной прокрутки.

В пределах одного экрана должны находиться:

- заголовок **Restore the Ancient Relic**;
- краткая инструкция;
- счётчик `Relic puzzle: 0 / 5`;
- силуэт готовой реликвии;
- все пять доступных фрагментов;
- сообщение о правильном или неправильном размещении.

### Размер сцены

Использовать высоту относительно viewport:

```css
.chamber-scene {
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
}
```

Высоту игровой области вычислять с учётом верхней панели:

```css
.puzzle-room {
  height: calc(100dvh - 170px);
  min-height: 0;
}
```

При необходимости использовать CSS-переменную:

```css
:root {
  --quest-header-height: 70px;
}
```

### Адаптивное масштабирование

Размер доски и фрагментов должен вычисляться от доступной высоты:

```css
.puzzle-board {
  height: min(70dvh, 500px);
  max-height: calc(100dvh - 210px);
}
```

Если высоты недостаточно:

1. уменьшить доску и фрагменты пропорционально;
2. сократить вертикальные отступы;
3. уменьшить заголовок, но сохранить читаемость;
4. разместить фрагменты по сторонам от силуэта;
5. не переносить фрагменты ниже видимой области;
6. не добавлять внутреннюю прокрутку в игровую сцену.

### Мобильные устройства

На мобильном экране также желательно сохранить один экран без прокрутки:

- уменьшить доску;
- располагать фрагменты компактно вокруг неё;
- использовать доступную ширину и высоту;
- учитывать `100dvh`, а не только `100vh`;
- учитывать безопасные области устройства через `env(safe-area-inset-*)`.

Если устройство имеет критически малую высоту, допускается дополнительный компактный режим, но кнопки и фрагменты не должны выходить за границы viewport.

### Запрет прокрутки только в сцене пазла

При входе в Relic Chamber добавить класс странице:

```javascript
document.body.classList.add("puzzle-active");
```

При завершении или выходе удалить его:

```javascript
document.body.classList.remove("puzzle-active");
```

Стили:

```css
body.puzzle-active {
  overflow: hidden;
  height: 100dvh;
}
```

### Критерии готовности

- [ ] Relic Chamber полностью помещается в один экран.
- [ ] Вертикальная прокрутка в сцене отсутствует.
- [ ] Горизонтальная прокрутка отсутствует.
- [ ] Все пять частей видны сразу.
- [ ] Силуэт и прогресс видны одновременно.
- [ ] Сообщение об установке части не перекрывает важные элементы.
- [ ] После выхода из пазла обычная прокрутка сайта восстанавливается.
- [ ] Сцена корректно работает при изменении размера окна.
