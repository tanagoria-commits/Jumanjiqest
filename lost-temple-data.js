/* Content library: 60 lexical entries × 3 exercise formats = 180 tasks. */
const LOST_TEMPLE_LEXICON = {
  easy: [
    ['look after','take care of someone','Maya stayed home to ___ her little brother.'],
    ['find out','discover information','We need to ___ where the hidden path begins.'],
    ['give up','stop trying','Do not ___ when the puzzle becomes difficult.'],
    ['pick up','collect something from a place','Please ___ the torch beside the door.'],
    ['turn on','make a device start working','Can you ___ the old lamp?'],
    ['run out of','have no more of something','We must leave before we ___ water.'],
    ['get along','have a friendly relationship','The two explorers ___ very well.'],
    ['calm down','become less worried or excited','Take a breath and try to ___.'],
    ['set off','begin a journey','We will ___ at sunrise.'],
    ['look for','try to find something','The team went to ___ the missing map.'],
    ['come back','return to a place','Promise that you will ___ before dark.'],
    ['wake up','stop sleeping','I always ___ when the jungle birds sing.'],
    ['put on','dress yourself in something','You should ___ your boots before leaving.'],
    ['take off','remove clothing','He had to ___ his wet jacket.'],
    ['write down','record something in writing','___ the symbols before they disappear.'],
    ['work out','find the answer to a problem','Can you ___ this ancient riddle?'],
    ['call back','return a telephone call','I will ___ when I reach the camp.'],
    ['carry on','continue doing something','The rain was heavy, but we decided to ___.'],
    ['slow down','move at a lower speed','You should ___ near the broken bridge.'],
    ['watch out','be careful of danger','___! There is a snake near your foot.']
  ],
  medium: [
    ['break the ice','start a friendly conversation','A simple joke helped us ___ with the new guide.'],
    ['under the weather','feel slightly ill','I am feeling ___, so I will rest at camp.'],
    ['hit the nail on the head','say exactly the right thing','You ___ when you said the map was a warning.'],
    ['get the hang of','begin to understand how to do something','After three attempts, I began to ___ reading the runes.'],
    ['come up with','think of an idea or solution','We need to ___ a safer route across the river.'],
    ['call it a day','stop working for the day','The light is fading, so let us ___.'],
    ['on the same page','share the same understanding','Before we enter, make sure we are all ___.'],
    ['go the extra mile','make more effort than expected','Our guide always ___ to keep everyone safe.'],
    ['a piece of cake','something very easy','The first clue was ___, but the second was difficult.'],
    ['keep an eye on','watch something carefully','Please ___ the entrance while I search the altar.'],
    ['take into account','consider a fact when deciding','We must ___ the rising water level.'],
    ['rule out','decide something is impossible','The footprints let us ___ the northern path.'],
    ['back someone up','support someone','I need you to ___ if the guardian asks questions.'],
    ['bring up','introduce a subject for discussion','Nobody wanted to ___ the missing supplies.'],
    ['figure out','understand or solve something','We finally managed to ___ how the mechanism worked.'],
    ['get away with','avoid punishment for something wrong','The thief thought he could ___ stealing the relic.'],
    ['in the long run','over a long period of time','Careful planning will help us ___.'],
    ['out of the blue','completely unexpectedly','A stone door opened ___.'],
    ['pull yourself together','calm yourself and behave normally','You must ___ before we face the guardian.'],
    ['take something for granted','fail to appreciate something familiar','Never ___ clean water in the jungle.']
  ],
  hard: [
    ['play it by ear','decide what to do as events develop','The map is incomplete, so we will have to ___.'],
    ['read between the lines','find a hidden meaning','To understand the warning, you must ___.'],
    ['take something with a grain of salt','not believe something completely','You should ___ when the merchant tells his stories.'],
    ['a blessing in disguise','something helpful that first seemed harmful','Losing the main trail was ___ because we found the temple.'],
    ['bite off more than you can chew','accept a task that is too difficult','Trying to cross alone means you may ___.'],
    ['cut to the chase','get to the important point without delay','We have little time, so please ___.'],
    ['get cold feet','become too frightened to act','Do not ___ now that the chamber is open.'],
    ['go out on a limb','take a risk by supporting an uncertain idea','I will ___ and trust the inscription.'],
    ['jump on the bandwagon','follow a popular trend','Many explorers ___ without understanding the danger.'],
    ['leave no stone unturned','search everywhere possible','We must ___ if we want all five fragments.'],
    ['miss the boat','lose an opportunity by acting too late','If we wait until sunset, we may ___.'],
    ['on thin ice','in a risky or dangerous situation','After ignoring the warning, the team was ___.'],
    ['put all your eggs in one basket','risk everything on one plan','Depending only on the river route would mean we ___.'],
    ['steal someone’s thunder','take attention or credit from another person','The rival tried to ___ by announcing our discovery.'],
    ['the last straw','the final problem that makes a situation intolerable','The broken compass was ___ for the exhausted guide.'],
    ['throw caution to the wind','act without worrying about risk','Desperate to escape, they decided to ___.'],
    ['up in the air','not yet decided or settled','Our route remains ___ until the storm passes.'],
    ['weather the storm','survive a difficult situation','The shelter helped us ___ through the night.'],
    ['draw the line','set a limit on what is acceptable','I ___ at entering the chamber without a torch.'],
    ['a double-edged sword','something with both benefits and disadvantages','The magical compass is ___ because it also attracts guardians.']
  ]
};

function buildLostTempleLibrary() {
  const library = {};
  Object.entries(LOST_TEMPLE_LEXICON).forEach(([level, entries]) => {
    const definitions = entries.map(item => item[1]);
    const terms = entries.map(item => item[0]);
    library[level] = { matching: [], meaning: [], sentence: [] };
    entries.forEach((entry, index) => {
      const next = (index + 1) % entries.length;
      const nextTwo = (index + 2) % entries.length;
      library[level].meaning.push({
        id: `${level}-meaning-${index}`,
        type: 'meaning',
        prompt: `What does “${entry[0]}” mean?`,
        options: [entry[1], definitions[next], definitions[nextTwo]],
        correctAnswer: entry[1],
        explanation: `“${entry[0]}” means “${entry[1]}.”`
      });
      library[level].sentence.push({
        id: `${level}-sentence-${index}`,
        type: 'sentence',
        prompt: entry[2],
        options: [entry[0], terms[next], terms[nextTwo]],
        correctAnswer: entry[0],
        explanation: `The expression that fits this context is “${entry[0]}.”`
      });
      const pairIndexes = [index, next, nextTwo];
      library[level].matching.push({
        id: `${level}-matching-${index}`,
        type: 'matching',
        prompt: 'Match each expression to its meaning.',
        pairs: pairIndexes.map(i => ({ term: entries[i][0], definition: entries[i][1] }))
      });
    });
  });
  return library;
}

const LOST_TEMPLE_QUESTIONS = buildLostTempleLibrary();
