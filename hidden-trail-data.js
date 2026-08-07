(function () {
  const stages = ['transport', 'place', 'activity', 'emotion', 'memory'];
  const speaking = {
    easy: {
      transport: 'How did you travel this summer?', place: 'Where did you go?', activity: 'What did you do?', emotion: 'How did you feel?', memory: 'What was your best summer moment?'
    },
    medium: {
      transport: 'Which means of transport did you use most and why?', place: 'What was the most memorable place you visited and why?', activity: 'Which activity would you like to do again?', emotion: 'When did you feel relaxed or excited?', memory: 'Did anything unexpected happen during your summer?'
    },
    hard: {
      transport: 'How did the journey shape your expectations of the destination?', place: 'Which place challenged your previous assumptions and why?', activity: 'Which experience had the greatest impact on you?', emotion: 'How did your emotions influence the choices you made?', memory: 'If you could relive one moment, which would you choose and why?'
    }
  };
  const raw = {
    easy: {
      transport: [
        ['category','Which word belongs to TRANSPORT?','train',['beach','sunny']],['sequence','airport → plane → ___','flight',['swimming','restaurant']],['category','Choose a vehicle used on water.','boat',['tent','cloud']],['context','We travelled to the city by ___.','bus',['hotel','happy']],['category','Which one can fly?','plane',['bicycle','ship']],['sequence','station → ticket → ___','train',['mountain','camera']]
      ],
      place: [
        ['category','Which word names a PLACE?','beach',['swim','excited']],['context','We stayed in a small ___.','hotel',['passport','sunny']],['category','Where can you see old paintings?','museum',['airport','sandwich']],['context','We climbed a high ___.','mountain',['train','photo']],['category','Choose a summer destination.','island',['jacket','tired']],['sequence','map → road → ___','village',['luggage','laugh']]
      ],
      activity: [
        ['context','We went ___ in the sea every morning.','swimming',['flying','sleepy']],['category','Choose a holiday activity.','go hiking',['hotel','surprised']],['context','I like to ___ photos on holiday.','take',['make','do']],['category','What can you do in a new city?','explore it',['be cloudy','feel blue']],['context','We ___ our friends at the park.','met',['flew','packed']],['sequence','put on boots → follow the path → ___','go hiking',['check in','sunbathe']]
      ],
      emotion: [
        ['category','Which word is an EMOTION?','excited',['beach','travel']],['context','After the long walk, I felt ___.','tired',['museum','train']],['synonym','Choose a word close to happy.','glad',['wet','late']],['context','The quiet beach made me feel ___.','relaxed',['crowded','flight']],['category','How might you feel after a surprise?','amazed',['mountain','passport']],['context','I was ___ because I lost my bag.','worried',['sunny','hiking']]
      ],
      memory: [
        ['context','I took a ___ to remember the day.','photo',['train','cloud']],['category','Which word relates to MEMORY?','remember',['travel','swim']],['context','It was the ___ day of my holiday.','best',['bus','blue']],['sequence','camera → picture → ___','memory',['airport','ticket']],['context','I will never ___ that sunset.','forget',['fly','pack']],['category','Choose something you can keep from a trip.','souvenir',['weather','emotion']]
      ]
    },
    medium: {
      transport: [
        ['phrasal','We ___ early to avoid the traffic.','set off',['turned up','gave away']],['collocation','Choose the natural phrase.','catch a flight',['take a flight late','do a flight']],['context','Our train was ___ by an hour.','delayed',['postponed away','missed off']],['sequence','check in → security → ___','board the plane',['book a table','rent a room']],['definition','A journey by sea is a ___.','voyage',['hike','commute']],['context','We had to ___ trains in the capital.','change',['replace','switch off']]
      ],
      place: [
        ['context','The village was surrounded ___ mountains.','by',['of','at']],['synonym','Choose a word close to beautiful.','picturesque',['exhausted','ordinary']],['definition','A place visited by many tourists is a ___.','destination',['departure','vehicle']],['collocation','Choose the natural phrase.','breathtaking view',['strong view','deep scenery']],['context','The hotel was within walking ___ of the beach.','distance',['length','space']],['phrasal','We decided to ___ the old town on foot.','look around',['look after','look down']]
      ],
      activity: [
        ['collocation','make →','memories',['a travel','a weather']],['phrasal','We decided to ___ a new water sport.','take up',['take off','take after']],['context','I spent the afternoon ___ the city.','exploring',['explored','to explore']],['collocation','Choose the natural phrase.','go sightseeing',['do sightseeing','make sights']],['definition','To walk a long distance in nature is to ___.','hike',['commute','sail']],['context','We managed ___ the summit before noon.','to reach',['reaching to','reach at']]
      ],
      emotion: [
        ['context','I was amazed ___ the view.','by',['of','for']],['synonym','Choose a word close to very tired.','exhausted',['delighted','peaceful']],['context','The unexpected delay was ___.','frustrating',['frustratedly','frustrate']],['collocation','Choose the natural phrase.','feel relieved',['make relieved','take reliefed']],['definition','Feeling calm and free from worry means ___.','relaxed',['crowded','remote']],['context','I felt proud ___ completing the climb.','of',['for','with']]
      ],
      memory: [
        ['formation','It was a truly ___ experience. MEMORY','memorable',['memorised','memoryful']],['collocation','Choose the natural phrase.','create lasting memories',['do long memories','build remembering']],['context','The trip reminded me ___ my childhood.','of',['about','from']],['synonym','Choose a word close to unforgettable.','remarkable',['routine','temporary']],['phrasal','Looking at the photos ___ happy memories.','brought back',['brought up to','took back on']],['context','That evening stands ___ in my memory.','out',['up','over']]
      ]
    },
    hard: {
      transport: [
        ['context','The rail strike seriously ___ our travel plans.','disrupted',['distracted','dissolved']],['collocation','Choose the most natural phrase.','a gruelling journey',['a harsh travel','a tiring voyage trip']],['nuance','A short regular journey to work is a ___.','commute',['voyage','expedition']],['phrasal','We were ___ at the border for several hours.','held up',['held on','held out']],['register','Choose the neutral formal option.','The service was temporarily suspended.',['They stopped the thing.','The ride totally died.']],['context','We took a scenic route to ___ the congested motorway.','bypass',['overcome','withdraw']]
      ],
      place: [
        ['nuance','A peaceful place far from crowds is best described as ___.','secluded',['abandoned','vacant']],['collocation','Choose the natural phrase.','unspoilt coastline',['untouched coast side','raw beach line']],['register','Choose the best neutral description.','The region is renowned for its dramatic landscape.',['The place has awesome stuff.','The region is loudly pretty.']],['context','The village has retained much of its original ___.','character',['personality','attitude']],['synonym','Choose the closest meaning to picturesque.','visually charming',['densely populated','poorly maintained']],['context','Tourism has transformed the once remote ___.','settlement',['installation','appointment']]
      ],
      activity: [
        ['collocation','Complete the phrase: ___ yourself in local culture.','immerse',['plunge','sink']],['phrasal','We ___ an opportunity to explore the caves.','jumped at',['jumped on','jumped over']],['context','The workshop enabled us to ___ our creative skills.','hone',['grind','sharpen up']],['idiom','Trying the sport pushed me ___.','out of my comfort zone',['over the moon','under the weather']],['register','Choose the most precise option.','We participated in a guided expedition.',['We did a guide thing.','We went around somehow.']],['collocation','Choose the natural phrase.','broaden your horizons',['widen your sights up','stretch your views']]
      ],
      emotion: [
        ['nuance','Choose the emotion meaning quietly happy and satisfied.','content',['ecstatic','indifferent']],['context','The scale of the landscape left me completely ___.','awestruck',['overseen','thoughtful']],['idiom','Before the journey I had ___.','butterflies in my stomach',['a storm in a teacup','a piece of cake']],['collocation','Choose the natural phrase.','a profound sense of relief',['a deep relieving','a strong relax']],['register','Choose the precise formal option.','I found the experience deeply unsettling.',['It was super weird.','I got a bad vibe.']],['context','Her initial anxiety gradually ___ as the journey continued.','subsided',['descended','withdrew']]
      ],
      memory: [
        ['collocation','Complete: ___ memories of a trip.','cherish',['maintain','perform']],['idiom','After months of work, the trip was a real ___.','breath of fresh air',['storm in a teacup','drop in the ocean']],['register','Choose the best paraphrase.','The experience profoundly influenced my perspective.',['The trip did a lot to my view.','It was big for my eyes.']],['context','The encounter has remained vividly ___ in my memory.','etched',['drawn','printed']],['nuance','A memory that causes both happiness and sadness is ___.','bittersweet',['bitter','sentimental only']],['formation','The journey had an unexpectedly ___ effect. TRANSFORM','transformative',['transformedly','transformation']]
      ]
    }
  };
  const tasks = {};
  Object.entries(raw).forEach(([level, groups]) => {
    tasks[level] = {};
    stages.forEach(stage => {
      tasks[level][stage] = groups[stage].map((entry, index) => ({
        id: `${level}_${stage}_${String(index + 1).padStart(2, '0')}`,
        level, stage, type: entry[0], prompt: entry[1],
        options: [entry[2], ...entry[3]], correctAnswer: entry[2],
        speakingPrompt: speaking[level][stage]
      }));
    });
  });
  window.hiddenTrailTasks = tasks;
})();
