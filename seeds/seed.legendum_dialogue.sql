BEGIN;
TRUNCATE
    legendum_dialogue
    RESTART IDENTITY CASCADE;

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

COMMIT;