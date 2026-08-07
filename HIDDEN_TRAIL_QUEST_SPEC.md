# Hidden Trail — механика третьего квеста

## 1. Концепция

**Hidden Trail** — третий и последний квест Expedition Vault. Его главная механика называется **The Path of Clues**.

Игрок проходит через джунгли по скрытой тропе. На каждом этапе путь разветвляется на 2–4 направления. Возле каждой дороги находится английское слово, выражение, изображение или языковая подсказка. Только один вариант логично продолжает маршрут.

- правильная дорога остается открытой и ведет дальше;
- неправильную дорогу постепенно поглощает туман;
- ошибка не возвращает игрока в начало;
- цель — пройти путь от **START** до **PORTAL**.

Квест должен ощущаться как путешествие по настоящим разветвляющимся тропам, а не как обычный тест с кнопками A, B и C.

## 2. Музыка

При входе в Hidden Trail использовать существующий файл:

```text
music3.mp3
```

Требования:

- запускать музыку при нажатии **ENTER THE TRAIL**;
- воспроизводить циклически;
- не создавать повторные экземпляры трека при смене сцен;
- использовать умеренную начальную громкость;
- предоставить включение, выключение и регулировку громкости;
- сохранять настройки звука в `localStorage`;
- при выходе из квеста плавно остановить музыку;
- если браузер запрещает autoplay, начать воспроизведение после первого действия игрока.

## 3. Стартовая сцена

Показать атмосферную тропу, исчезающую в густом тумане.

Заголовок:

> **THE HIDDEN TRAIL**

Инструкция:

> **Only one path leads to the portal.**  
> **Follow the clues and choose carefully.**  
> **A wrong path will be swallowed by the fog.**

Кнопка:

> **ENTER THE TRAIL**

После нажатия запускается `music3.mp3` и открывается выбор сложности.

## 4. Уровни сложности

| Сложность | ESL | Содержание |
|---|---|---|
| Easy | A2–B1 | Повседневная и базовая туристическая лексика, очевидные категории, короткие предложения, 3 варианта |
| Medium | B1–B2 | Collocations, phrasal verbs, word formation, synonyms, dependent prepositions, контекстные предложения |
| Hard | B2–C1 | Идиомы, register, shades of meaning, advanced collocations, nuanced synonyms, сложное словообразование |

Hard не должен быть просто более длинной версией Easy. Должны возрастать языковая точность, идиоматичность, контекстная сложность и качество distractors.

Выбранная сложность применяется ко всему прохождению.

## 5. Маршрут My Summer Trail

Первый тематический маршрут называется:

> **MY SUMMER TRAIL**

Он состоит из пяти смысловых этапов:

```text
START
  ↓
STEP 1 — TRANSPORT
  ↓
STEP 2 — PLACE
  ↓
STEP 3 — ACTIVITY
  ↓
STEP 4 — EMOTION
  ↓
STEP 5 — MEMORABLE MOMENT
  ↓
PORTAL
```

### Step 1 — Transport

Игрок выбирает слово или выражение, связанное с транспортом и путешествием.

Примеры: `plane`, `train`, `set off`, `board the plane`.

Speaking prompt:

> **How did you travel this summer?**

### Step 2 — Place

Игрок выбирает место или логичное продолжение маршрута.

Примеры: `beach`, `mountains`, `hotel`, `museum`.

Speaking prompt:

> **What was the most interesting place you visited?**

### Step 3 — Activity

Игрок выбирает летнее действие или устойчивое выражение.

Примеры: `go swimming`, `explore the city`, `go hiking`, `meet friends`.

Speaking prompt:

> **What did you enjoy doing most?**

### Step 4 — Emotion

Игрок выбирает подходящую эмоцию или выражение.

Примеры: `excited`, `relaxed`, `exhausted`, `surprised`.

Speaking prompt:

> **When did you feel really relaxed or excited?**

### Step 5 — Memorable Moment

Игрок выбирает слово, collocation, sentence, idiom или paraphrase, связанные с воспоминаниями.

Speaking prompt:

> **What moment from this summer would you like to remember?**

После правильного выбора становится виден портал.

## 6. Визуальная структура маршрута

На игровом экране одновременно видны:

- текущая позиция игрока;
- уже пройденная часть пути;
- участок джунглей впереди;
- 2–4 разветвляющиеся тропы;
- надпись или объект возле каждого направления;
- туман вокруг закрытых дорог;
- силуэт портала вдали;
- индикатор пяти этапов.

Варианты ответа должны быть частью окружения:

- надпись на камне;
- деревянный указатель;
- древняя табличка;
- подвесной знак;
- следы или предмет на дороге.

Не использовать стандартный вертикальный список radio-кнопок.

## 7. Разнообразие заданий

Чередовать разные языковые механики:

1. **Category Trail** — найти слово нужной категории.
2. **Logical Sequence** — выбрать следующий элемент последовательности.
3. **Collocation Trail** — составить устойчивое сочетание.
4. **Phrasal Verb Trail** — выбрать phrasal verb по контексту.
5. **Synonym Trail** — найти близкое значение.
6. **Definition Trail** — сопоставить слово с определением.
7. **Idiom Trail** — выбрать подходящую ситуации идиому.
8. **Register Trail** — выбрать вариант нужного стиля.
9. **Meaning in Context** — определить точное значение в ситуации.
10. **Word Formation Trail** — образовать нужную форму слова.

Не делать все пять этапов вопросом одного типа.

## 8. Примеры по уровням

### Easy

```text
Which word belongs to TRANSPORT?

train
beach
sunny
```

Правильный ответ: `train`.

```text
airport → plane → ___

flight
swimming
restaurant
```

Правильный ответ: `flight`.

### Medium

```text
We ___ early because we wanted to avoid the traffic.

set off
turned up
gave away
```

Правильный ответ: `set off`.

```text
I was amazed ___ the view.

by
of
for
```

Правильный ответ: `by`.

### Hard

```text
After months of work, the trip was a real ___.

a breath of fresh air
a storm in a teacup
a blessing in disguise
```

Правильный ответ: `a breath of fresh air`.

```text
The experience had a strong effect on the way I see things.
```

Лучший нейтрально-формальный paraphrase:

> **The experience profoundly influenced my perspective.**

## 9. Большая библиотека заданий

Подготовить минимум 90 заданий:

- Easy — не менее 30;
- Medium — не менее 30;
- Hard — не менее 30.

Для каждой сложности:

- Transport — минимум 6;
- Place — минимум 6;
- Activity — минимум 6;
- Emotion — минимум 6;
- Memory — минимум 6.

При каждом прохождении выбирать по одному случайному заданию из каждой категории. На replay желательно формировать новую комбинацию.

## 10. Архитектура контента

Хранить задания отдельно от игровой логики, например в:

```text
hidden-trail-data.js
```

Структура библиотеки:

```js
const hiddenTrailTasks = {
  easy: {
    transport: [],
    place: [],
    activity: [],
    emotion: [],
    memory: []
  },
  medium: {
    transport: [],
    place: [],
    activity: [],
    emotion: [],
    memory: []
  },
  hard: {
    transport: [],
    place: [],
    activity: [],
    emotion: [],
    memory: []
  }
};
```

Структура задания:

```js
{
  id: 'easy_transport_01',
  level: 'easy',
  stage: 'transport',
  type: 'category',
  prompt: 'Which word belongs to TRANSPORT?',
  options: ['train', 'beach', 'sunny'],
  correctAnswer: 'train',
  speakingPrompt: 'How did you travel this summer?',
  explanation: 'Train is a means of transport.'
}
```

Учитель должен иметь возможность дополнять библиотеку без изменения компонентов интерфейса.

## 11. Генерация маршрута

При старте прохождения:

1. получить выбранную сложность;
2. выбрать случайное задание Transport;
3. выбрать случайное задание Place;
4. выбрать случайное задание Activity;
5. выбрать случайное задание Emotion;
6. выбрать случайное задание Memory;
7. перемешать варианты ответа каждого задания;
8. сохранить сформированный маршрут на время текущей попытки.

Не использовать одно задание дважды в одном прохождении. Правильная дорога не должна постоянно находиться слева, в центре или первой.

## 12. Неправильная дорога и туман

Если игрок ошибся:

1. выбранная тропа темнеет;
2. на нее наползает густой туман;
3. дорога постепенно исчезает;
4. выбранный вариант блокируется;
5. игрок остается на текущем этапе;
6. остальные дороги продолжают работать.

Сообщение:

> **The fog has swallowed this path.**

Не возвращать игрока в начало и не сбрасывать пройденные этапы.

## 13. Правильная дорога

При правильном выборе:

1. тропа получает слабое зелено-золотое свечение;
2. туман перед ней рассеивается;
3. ошибочные направления исчезают;
4. камера плавно движется вперед;
5. открывается следующая часть маршрута;
6. появляется speaking prompt.

Сообщение:

> **THE PATH IS CLEAR**

или:

> **You found the trail.**

## 14. Speaking prompts

После каждого правильного выбора показывать тематический вопрос. Система не оценивает устную речь.

Кнопка продолжения:

> **CONTINUE THE TRAIL**

Сложность speaking prompt соответствует выбранному уровню:

- Easy — короткие конкретные вопросы;
- Medium — вопросы, требующие объяснения;
- Hard — вопросы о влиянии опыта, причинах, выборе и личной оценке.

## 15. Прогресс маршрута

Показывать пять последовательных маркеров:

```text
HIDDEN TRAIL
● ○ ○ ○ ○
```

После второго этапа:

```text
● ● ○ ○ ○
```

После пятого:

```text
● ● ● ● ●
```

Вместо точек можно использовать следы, камни, листья или небольшие символы тропы.

## 16. Финальный портал

После пятого этапа:

- туман полностью рассеивается;
- открывается древний портал;
- портал начинает мягко светиться;
- камера приближается к нему;
- проигрывается магический эффект.

Заголовок:

> **THE HIDDEN TRAIL HAS BEEN REVEALED**

Текст:

> **You found the path through the jungle.**

Кнопка:

> **ENTER THE PORTAL**

По нажатию вернуть игрока на `index.html`.

## 17. Сохранение прогресса

При открытии портала сохранить:

```js
localStorage.setItem('hiddenTrailCompleted', 'true');
```

Добавить достижение:

```js
const achievements = JSON.parse(
  localStorage.getItem('expeditionAchievements') || '[]'
);

if (!achievements.includes('trail')) {
  achievements.push('trail');
}

localStorage.setItem(
  'expeditionAchievements',
  JSON.stringify(achievements)
);
```

Обновить третью звезду прогресса на главной странице. Повторное прохождение не должно удалять сохраненный результат.

## 18. Replay

Если квест уже завершен, показать:

> **HIDDEN TRAIL COMPLETED**

Кнопки:

- **PLAY AGAIN**;
- **BACK TO QUEST MAP**.

При replay:

- достижение остается сохраненным;
- игрок снова выбирает сложность;
- формируется новый случайный маршрут.

## 19. Состояние игры

```js
const hiddenTrailState = {
  difficulty: null,
  stageIndex: 0,
  route: [],
  blockedOptionIds: [],
  awaitingSpeakingPrompt: false,
  completed: false
};
```

## 20. Образовательные требования

Все задания должны:

- использовать естественный современный английский;
- быть грамматически корректными;
- соответствовать заявленному CEFR-уровню;
- иметь один однозначно правильный ответ;
- использовать правдоподобные distractors;
- подходить подросткам и взрослым;
- быть связаны с summer, travel, experiences, hobbies, emotions, memories и первым занятием после каникул.

## 21. Полный игровой цикл

```text
ENTER THE TRAIL
        ↓
music3 starts
        ↓
Choose Easy / Medium / Hard
        ↓
Generate a random My Summer Trail
        ↓
TRANSPORT → choose path → speaking prompt
        ↓
PLACE → choose path → speaking prompt
        ↓
ACTIVITY → choose path → speaking prompt
        ↓
EMOTION → choose path → speaking prompt
        ↓
MEMORABLE MOMENT → choose path → speaking prompt
        ↓
Fog disappears and portal appears
        ↓
Save completion
        ↓
ENTER THE PORTAL
        ↓
Return to Quest Map
```

## 22. Критерии готовности

- [ ] Используется `music3.mp3`.
- [ ] Доступны Easy, Medium и Hard.
- [ ] Маршрут состоит из пяти тематических этапов.
- [ ] На каждом этапе видны настоящие разветвляющиеся тропы.
- [ ] Варианты являются объектами игрового мира, а не обычным списком ответов.
- [ ] Используются разные типы языковых заданий.
- [ ] Библиотека содержит минимум 90 заданий.
- [ ] Контент отделен от игровой логики.
- [ ] Для каждого прохождения формируется случайный маршрут.
- [ ] Варианты ответа перемешиваются.
- [ ] Неправильную дорогу поглощает туман.
- [ ] Ошибка не сбрасывает общий прогресс.
- [ ] Правильная дорога открывает следующий участок.
- [ ] После каждого этапа появляется speaking prompt.
- [ ] После пятого этапа открывается портал.
- [ ] Завершение сохраняется в `localStorage`.
- [ ] Третья звезда прогресса активируется на главной странице.
- [ ] **ENTER THE PORTAL** возвращает игрока на `index.html`.
- [ ] Replay генерирует новый маршрут и не удаляет достижение.
