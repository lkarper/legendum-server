BEGIN;

TRUNCATE
    legendum_stories,
    legendum_dialogue,
    legendum_exercises,
    legendum_exercises_learn,
    legendum_exercises_learn_hints,
    legendum_exercises_do,
    legendum_users
    RESTART IDENTITY CASCADE;

INSERT INTO legendum_stories (story_title, chapter_number)
VALUES
    ('Initium', 1),
    ('Adventus', 2);

SET CLIENT_ENCODING TO 'utf8';

INSERT INTO legendum_dialogue (
    chapter_number, 
    page, 
    text, 
    choices, 
    responses_to_choices, 
    image_url, 
    image_alt_text, 
    background_image_url, 
    background_image_alt_text
)
VALUES
    (1, 1, '(You wake up and find yourself in a strange place.  Before you stands a strange looking man wearing a large blanket.  Your head feels fuzzy and you have no idea where you are or how you got there.  Suddenly, the man speaks.)', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 2, 'Rhadamanthus: “Bene advēnistī ad domum Plūtōnis.  Sum Rhadamanthus, iūdex mortuōrum.”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 3, '(Bemused, you stare at the man.)', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 4, 'Rhadamanthus: “Ah, I see.  You’re one of the new kids.”', '“I’m not a kid…”|“Uhhhh, what?”', 'Rhadamanthus: “Well, I’m over 3000 years old…”|Rhadamanthus: “Why do they always say that?”', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 5, 'Rhadamanthus: “I’m Rhadamanthus, judge of the dead, and you’re in the house of Pluto.”', '“Rhada--what?”|“...I’m dead?”', 'Rhadamanthus: “Rhadamanthus.  You know, THE Rhadamanthus…  Son of Jove, king of Crete, judge of the dead…”|“What, because you heard some Latin you must be dead?”', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 6, 'Rhadamanthus: “You’re not dead.  You’ve been chosen for a very special task: you’re going to be a genius!”', '“I’m already a genius.”|“...chosen?”', '“If you were a genius, you would have stayed on the beach in Naples.”|“Well, in a way, you chose your own fate.”', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 7, 'Rhadamanthus: “Maybe you fell into Lethe on your way here, but you were vacationing in Naples and decided to visit Lake Avernus without a guide.  You got lost and it started to rain quite heavily, so you made for a nearby cave.  In the dark of the cave, you tripped and stumbled all the way down to the underworld.”', '“That doesn’t sound like me.”|“If that’s true, I probably shouldn’t be CHOSEN to do anything…”', 'Rhadamanthus: “Well, you fell into Lethe, the river of forgetfulness, genius.”|Rhadamanthus: “That is why it must be you!  Sorry, we get movies a bit late down here, and I just saw Gladiator…”', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.',  'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 8, 'Rhadamanthus: “Anyway, since you’re here and you’re not technically dead, we have a very special job for you: you’re going to be assigned to a child as a genius--a guardian spirit who offers advice and guidance!  Luckily for you, we’re shorthanded in the Roman empire, so YOU get to learn Latin!  Don’t worry, I’ll help you.  Let’s start with some basics.”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 1, 'Rhadamanthus: “You’re off to a great start. Before you know it, you’ll be a bona fide, Latin-speaking genius!”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/rhadamanthus_arms_down_whkknx.png', 'Man with dark hair and large beard.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 2, 'Rhadamanthus: “In the meantime, you’ll have some help from a translator, Enni.”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/enni.0001_g02zz1.png', 'A dog with three heads.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 3, 'Rhadamanthus: “Enni here—with his three heads and three tongues—can speak three languages, including Latin and English!  He’ll help you as you learn how to communicate with your charge.”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/rhadamanthus_and_enni_mb4yvc.png', 'A man with dark hair and a beard and a three-headed dog.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 4, 'Rhadamanthus: “Now I’m going to send you back in time. I’d tell you where and when, but I’d hate to deprive you of the chance to figure that out for yourself.”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/rhadamanthus_and_enni_mb4yvc.png', 'A man with dark hair and a beard and a three-headed dog.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 5, 'Rhadamanthus: “Your job will be to guide your child and offer advice.  Enni will always be there for you, but the more Latin you learn, the better genius you’ll be!  Who knows: maybe I’ll have some more jobs for you in the future!  Bona fortūna!”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/rhadamanthus_and_enni_mb4yvc.png', 'A man with dark hair and a beard and a three-headed dog.', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 6, '(The room spins and you lose consciousness for a moment….)', null, null, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/swirl_tiny_x7tuk4.png', 'A swirl of lights.'),
    (2, 7, '(When the spinning stops you find yourself in a small room with a small child.)', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/seated_child2_er0dcz.png', 'A small child sits holding a scroll.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 8, 'Enni: “Here we are! Maybe we shouldn’t reveal ourselves right away. It might be better to whisper some insight into the child’s ear until he gets used to our presence.”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/seated_child_and_enni_ga5rif.png', 'A small boy sits holding a scroll; a three-headed dog sits besdie him.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 9, 'Enni: “Hmmm, I smell homework! Looks like the child is studying geography. This is the perfect chance to brush up on your own geography skills and learn some more Latin! Then, you can help the child and, if all goes well, reveal yourself!”', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251516/seated_child_and_enni_ga5rif.png', 'A small boy sits holding a scroll; a three-headed dog sits besdie him.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.');

SET CLIENT_ENCODING to 'utf8';

INSERT INTO legendum_exercises (exercise_title, chapter_number, exercise_translation)
VALUES 
    ('Exercitium prīmum: Salūtātiōnēs', 1, '(Exercise one: Greetings)'),
    ('Exercitium Secundum: Ubī est...?', 2, '(Exercise two: Where is...?)');

SET CLIENT_ENCODING to 'utf8';

INSERT INTO legendum_exercises_learn (chapter_number, page, text, image_url, image_alt_text, background_image_url, background_image_alt_text)
VALUES
    (1, 1, 'Lūcius: “Salvē!”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_lucius_talking_khc6to.png', 'A man named Lucius speaks to a woman named Iulia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 2, 'Lūcius: “Egō sum Lūcius!”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_lucius_talking_khc6to.png', 'A man named Lucius speaks to a woman named Iulia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 3, 'Lūcius: “Nōmen mihi est Lūcius!”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_lucius_talking_khc6to.png', 'A man named Lucius speaks to a woman named Iulia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 4, 'Iūlia: “Salvē, Lūcī!”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_iulia_talking_fuyoq2.png', 'A woman named Iulia speaks to a man named Lucius.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 5, 'Lūcius: “Quid est nōmen tibi?”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_lucius_talking_khc6to.png', 'A man named Lucius speaks to a woman named Iulia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 6, 'Iūlia: “Nōmen mihi est Iūlia.  Ego sum Iūlia.”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_iulia_talking_fuyoq2.png', 'A woman named Iulia speaks to a man named Lucius.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 7, 'Lūcius: “Salvē, Iūlia! Pergrātum tē convenīre!”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_lucius_talking_khc6to.png', 'A man named Lucius speaks to a woman named Iulia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 8, 'Iūlia: “Pergrātum quoque tē convenīre!”', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/intro_learn_iulia_talking_fuyoq2.png', 'A woman named Iulia speaks to a man named Lucius.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 9, 'Lūcius et Iūlia: “Valē!”', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/intro_learn_names_dunia7.png', 'Lucius and Iulia speak at the same time.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 10, '(Lūcius exit.)', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/intro_learn_lucius_exit_zl8e81.png', 'Lucius leaves and Iulia remains.', 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (1, 11, '(Iūlia exit.)', null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251514/Countryside_small_a22a4h.jpg', 'A sunny day in the Italian countryside.'),
    (2, 1, 'Haec est Rōma.', 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Roma_pbdvft.png', 'Map of Italy with Rome circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 2, 'Haec est Italia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Italia_u4bdhs.png', 'Map of Europe with Italy circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 3, 'Italia est in Eurōpā.', 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Italia_u4bdhs.png', 'Map of Europe with Italy circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 4, 'Rōma in Italiā est.', 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Roma_pbdvft.png', 'Map of Italy with Rome circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 5, 'Haec est Hispānia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Hispania_rku1ai.png', 'Map of Europe with Spain circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 6, 'Hispānia est in Eurōpā.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Hispania_rku1ai.png', 'Map of Europe with Spain circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 7, 'Haec est Graecia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Graecia_irwyyd.png', 'Map of Europe with Greece circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 8, 'Graecia quoque in Eurōpā est.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Graecia_irwyyd.png', 'Map of Europe with Greece circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 9, 'Hispānia et Italia et Graecia in Eurōpā sunt.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Hispania_Italia_Graecia_ya5xj8.png', 'Map of Europe with Spain, Italy, and Greece circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 10, 'Hīc est Aegyptus.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Aegyptus_rlovgz.png', 'Map with Egypt circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 11, 'Aegyptus est in Āfricā.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Aegyptus_rlovgz.png', 'Map with Egypt circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 12, 'Haec est Gallia.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Gallia_gytp24.png', 'Map of Europe with Gaul circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 13, 'Gallia nōn in Āfricā sed in Eurōpā est.', 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Gallia_gytp24.png', 'Map of Europe with Gaul circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 14, 'Syria et Arabia nōn in Eurōpā aut in Āfricā sed in Asiā sunt.', 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Syria_Arabia_vx1t1q.png', 'Map with Syria and Arabia circled.', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.');

SET CLIENT_ENCODING TO 'utf8';

INSERT INTO legendum_exercises_learn_hints (exercise_page_id, hint_order_number, hint)
    VALUES
        (1, 1, '“Salvē” is a greeting like “Hello”.  It is how you greet one person.'),
        (2, 1, '“Egō” is a pronoun.  It means “I”.'),
        (2, 2, '“sum” is a verb.  It means “I am”.'),
        (3, 1, '“Nōmen” is a noun.  It means “name”'),
        (3, 2, '“mihi” is a personal pronoun.  It literally means “for me”, but we can translate it like an adjective here and say “my”.'),
        (3, 3, '“est” is a verb.  It means “is”.'),
        (4, 1, '“Lūcī” is in the vocative case.  That’s a fancy way of saying that you use this form of the word “Lūcīus” to address directly someone named Lūcīus.'),
        (5, 1, '“Quid” is an interrogative pronoun.  It means “what”.'),
        (5, 2, '“tibi” is a personal pronoun.  It literally means “for you”, but we can translate it like an adjective here and say “your”.'),
        (7, 1, '“Pergrātum tē convenīre!” literally means “it is pleasing to meet you!”, but we can simply translate: “pleased to meet you!”.'),
        (8, 1, '“Quoque” is a conjunction.  It means “also” or “as well”.'),
        (9, 1, '“Valē” is a command.  It literally means “be well”, but it acts like the English “farewell”.  It’s how you say goodbye to one person in Latin.'),
        (10, 1, '“Exit” is a verb.  It means “goes away” or “departs”.'),
        (12, 1, '“Haec” means “This”.  It’s what we call a demonstrative.  Demonstratives “demonstrate” or “point out” things.  In Latin, they often act as pronouns and adjectives.'),
        (12, 2, '“est” is a verb.  It means “is”.'),
        (12, 3, '“Rōma” is Rome.'),
        (13, 1, '“Italia” is Italy.'),
        (14, 1, '“Eurōpā” is Europe.'),
        (14, 2, '“in” means “in” or “on”, depending on the context.'),
        (14, 3, 'Note the long mark over the final “a” in “Eurōpā”.  This is called a macron.  This is a modern invention, used to aid us in pronunciation, and the ancient Romans did not use macra (the plural of “macron”).'),
        (14, 4, 'The final “a” in “Eurōpā” is long because “Eurōpā” is in the ablative case.  Latin is a heavily inflected language, which means that forms of words change to indicate how they function in a sentence grammatically.  We do this in English.  “He”, for example, is used to indicate that the pronoun acts as the subject of a sentence or clause.  “Him”, meanwhile, indicates that the pronoun is acting as a direct object or the object of a preposition.  English generally relies on word order to indicate meaning.  For example “Mike gives the book to Tom” and “Tom gives the book to Mike” mean different things, even though “Mike” and “Tom” take the same form in each sentence.  We know which is the subject of each sentence and which is the object of the preposition “to” because of word order.  Latin nouns, however, indicate their function by changing their form.  We call this form “case”.  We have seen two cases: the nominative and the ablative.  While each has various uses, so far, we have seen that the nominative case is used to indicate that a noun is the subject of a verb (“Italia” above) and that the ablative is used as the object of a preposition, when that preposition indicates location without movement (“in” paired with “Eurōpā” above).'),
        (15, 1, '“Rōma” is in the nominative case; we know this because the final “a” is short (it has no macron above it).'),
        (15, 2, '“Italiā” is in the ablative case; we know this because the final “ā” is long (it has a macron above it).'),
        (16, 1, '“Hispānia” is Spain.'),
        (17, 1, '“Hispānia” is in the nominative case.'),
        (17, 2, '“Eurōpā” is in the ablative case.'),
        (18, 1, '“Graecia” is Greece.'),
        (19, 1, '“Graecia” is in the nominative case.'),
        (19, 2, '“Eurōpā” is in the ablative case.'),
        (19, 3, 'Recall that “quoque” means “also”.'),
        (20, 1, '“et” is a conjunction that means “and”.'),
        (20, 2, '“sunt” is the plural of “est”; it means “are”.  The subjects of the verb are “Hispānia”, “Italia”, and “Graecia”.  All three nouns are in the nominative case; we know this because the final -a in each word does NOT have a macron above it (and is, therefore, short).'),
        (20, 3, '“Eurōpā” is in the ablative case.  We know this because the final -ā is long (note the macron above it).  “Eurōpā” is the object of the preposition “in”, and this is why the noun is in the ablative case.'),
        (21, 1, '“Hīc” is also a demonstrative that means “this”.'),
        (21, 2, '“Aegyptus” is Egypt.'),
        (21, 3, '“Hīc” takes a different form than “haec” (which we saw above) because of the grammatical gender of “Aegyptus”.  Latin adjectives agree with the words they modify in gender, number, and case.  We’ve already spoken about case.  Number simply means “singular” or “plural”.  Gender refers to grammatical gender.  Latin nouns, pronouns, and adjectives have what we call grammatical gender.  There are three genders in Latin: masculine, feminine, and neuter.  This grammatical gender should not be confused with other notions of gender (although they do sometimes overlap: for example, the Latin word for dog (“canis”) can be either masculine or feminine, depending on whether the dog in question is a male or female).  Often, the grammatical gender of a word appears to be arbitrary.  For example, the Latin words “mare” (neuter), “pontus” (masculine) and “aqua” (feminine) all refer to water and, depending on the context, can all be translated as “sea”.  It is best to memorize the gender of a noun when you learn it, although you can sometimes infer a word’s gender based on the declension to which a noun belongs.'),
        (21, 4, 'Latin nouns and adjectives are grouped into what we call “declensions”.  Declensions share common endings that are used to differentiate case.  This is why “Italia”, “Hispania”, “Graecia” and “Eurōpa” all end in “a”: they all belong to the first declension.  First declension nouns are usually feminine, although this is not always true. “Aegyptus” is a nominative noun that belongs to the second declension.  Second declension nouns are usually masculine.  We can say that the word “Aegyptus” is a second declension, singular, masculine noun in the nominative case.'),
        (21, 5, '“Aegyptus” is in the nominative case here because it is what we call a “predicate nominative”.  “Predicate nominative” is a fancy term for a word that renames or further explains the subject of a sentence.  Predicate nominatives are often found with “copulatives”, that is, “linking verbs”, such as “is”, “are”, “am”, etc.  The subject of the verb “est” is the demonstrative pronoun “hīc”, which is also in the nominative case.  We have now seen the two main uses for the nominative case: subjects of verbs and predicate nominatives.'),
        (22, 1, 'Note that the position of the word “est” is malleable.  Word order in Latin is a lot looser than in English, because Latin words are so heavily inflected.  You know that “Aegyptus” is the subject of “est” because it is in the nominative case and “Āfricā” is in the ablative case.  You could place “est” anywhere in the above sentence, and the meaning would remain the same.  Because of this, word order in Latin is often used for emphasis and effect.  Placing a word or phrase first–or last–in a clause changes the impact of the sentence.'),
        (23, 1, '“Gallia” is the ancient Gaul, which included modern France, Belgium, Switzerland, and (originally) parts of northern Italy.  Later, northern Italy was included by the Romans in “Italia”.'),
        (24, 1, '“Nōn” is an adverb that negates verbs.  We can translate it as “not”.'),
        (24, 2, '“sed” is a conjunction; it means “but”.'),
        (25, 1, '“aut” is a conjunction; it means “or”.'),
        (25, 2, '“sunt” is the plural of “est”; it means “are”.  The subjects of the verb “sunt” are “Syria” and “Arabia”, which are both first declension feminine singular nouns in the nominative case.');

SET CLIENT_ENCODING to 'utf8';

INSERT INTO legendum_exercises_do (
    chapter_number, 
    page, 
    dialogue,
    dialogue_look_back,
    dialogue_to_look_for,
    question_type, 
    question,
    incorrect_response_option_1,
    incorrect_response_option_2,
    incorrect_response_option_3,
    correct_response,
    response_if_incorrect_1,
    response_if_incorrect_2,
    response_if_incorrect_3,
    look_ahead,
    look_back,
    property_to_save,
    property_to_look_for,
    image_url,
    image_alt_text,
    input_label,
    background_image_url,
    background_image_alt_text
)
VALUES
    (1, 1, 'Rhadamanthus: “Salvē!”', false, null, 'multiple-choice', 'How do you greet Rhadamanthus?', 'Valē!', null, null, 'Salvē!', 'Don’t say farewell just yet...', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251514/rhadamanthus_wave4_tlr1gz.gif', 'A man waves at you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 2, 'Rhadamanthus: “Egō sum Rhadamanthus.”', false, null, 'multiple-choice', 'Quid est nōmen?', 'mihi', 'tibi', 'sum', 'Rhadamanthus', 'Not quite: that means ‘my’', 'Close, but that means ‘your’', 'that’s a verb and we need a noun', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 3, 'Rhadamanthus: “Nōmen mihi est Rhadamanthus.”', false, null, 'input', '“Quid est nōmen tibi?”', null, null, null, null, null, null, null, true, false, 'user_name', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', 'Nōmen mihi est...', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 4, 'Rhadamanthus: “Nōmen tibi est |.”', true, 'user_name', 'true/false', 'True or False? (Vērum aut Falsum?)', 'False/Falsum', null, null, 'True/Vērum', 'What did you say your name is?', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 5, 'Rhadamanthus: “Pergrātum te convenīre!”', false, null, 'multiple-choice', 'Fill in the blank: “Pergrātum te __________ convenīre, Rhadamanthe!”', 'pergrātum', 'Rhadamanthe', 'te', 'quoque', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 1, 'Enni: “Looks like we have to fill in the blank here.”', false, null, 'multiple-choice', 'Haec est _____ .', 'Graecia', 'Eurōpa', 'Aegyptus', 'Italia', 'Graecia is to the east.', 'This is only part of Eurōpa.', 'Aegyptus is in Africa, to the south-east.', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Italia_do_cletxm.png', 'A map of Italy.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 2, 'Enni: “This is a true/false question.”', false, null, 'true/false', 'Haec nōn est Rōma.',  'True/Vērum', null, null, 'False/Falsum', 'Remember that “nōn” negates the verb.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Roma_pbdvft.png', 'A map with Rome circled.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 3, 'Enni: “Hmm, another fill in the blank question.”', false, null, 'input', 'Haec _____ Hispānia.', null, null, null, 'est', 'We’re looking for a verb here. What verbs have we learned so far?  Note that “Haec” will be the subject and “Hispānia” will be a predicate nominative.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Hispania_rku1ai.png', 'A map with Spain circled.', 'Fill in the blank', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 4, 'Enni: “Great job on that last question. This question is similar.”', false, null, 'input', 'Hispānia et Italia et Graecia in Eurōpā _____.', null, null, null, 'sunt', 'We need a verb. Make sure that you understand what the subjects of the verb are. The verb is related to “est”, but is not “est”. We need the plural form.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Hispania_Italia_Graecia_ya5xj8.png', 'A map with Spain, Italy, and Greece circled.', 'Fill in the blank', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 5, 'Enni: “A fill in the blank, but it looks like we have some options to choose from.”', false, null, 'multiple-choice', 'Aegyptus est in _____.', 'Āfrica', 'Eurōpā', 'Eurōpa', 'Āfricā', 'You have the right idea, but is the case of the word correct? Remember what we learned about the nominative and ablative cases.', 'You’re right that we need a noun in the ablative case, but is Egypt in Europe?', 'Double check the map: is Egypt in Europe?', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Aegyptus_rlovgz.png', 'A map with Egypt circled.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 6, 'Enni: “Good thing we went over a few basic conjunctions; you’ll need them here.”', false, null, 'multiple-choice', 'Gallia nōn in Āfricā _____ in Eurōpā est.', 'aut', null, null, 'sed', '“aut” is a conjunction, but it means “or”; Gallia in Eurōpā est… so what conjunction do we need to complete the sentence?', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Gallia_gytp24.png', 'A map with Gallia circled.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 7, 'Enni: “Great job so far with conjunctions. We need another one here.”', false, null, 'input', 'Syria et Arabia nōn in Eurōpā _____ in Āfricā sed in Asiā sunt.', null, null, null, 'aut', 'We need a conjunction that means “or”.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Syria_Arabia_vx1t1q.png', 'A map with Arabia and Syria circled.', 'Fill in the blank', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.');

INSERT INTO legendum_users (user_name, password, display_name, admin)
    VALUES 
    ('hanbran', '$2a$12$UtE7sMr3odc6aIBZdi36.O9Nm2mv7ohZ1IF.bo.MghA2ktqW75TM6', 'Lu', true),
    ('hanbranNoAuth', '$2a$12$UtE7sMr3odc6aIBZdi36.O9Nm2mv7ohZ1IF.bo.MghA2ktqW75TM6', 'Lu', false);

COMMIT;
