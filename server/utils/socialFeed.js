// utils/socialFeed.js

let posts = [
  { id: 1, user: 'user123', text: 'Need food supplies near Main St.', timestamp: Date.now(), type: 'need' },
  { id: 2, user: 'rescue_bot', text: 'Evacuation in progress at Riverside.', timestamp: Date.now(), type: 'alert' },
  { id: 3, user: 'volunteerA', text: 'Offering shelter at 4th Ave.', timestamp: Date.now(), type: 'offer' },
];
let nextId = 4;

// Returns the current mock posts
export function getMockSocialFeed() {
  return posts;
}

// Simulate new posts every 10 seconds and emit via Socket.IO
export function startMockSocialFeedEmitter(io) {
  setInterval(() => {
    const newPost = {
      id: nextId++,
      user: 'user' + Math.floor(Math.random()*1000),
      text: getRandomText(),
      timestamp: Date.now(),
      type: getRandomType(),
    };
    posts.unshift(newPost); // add to the start
    io.emit('social_post', newPost);
  }, 10000); // every 10 seconds
}

function getRandomText() {
  const samples = [
    'Need water at 5th Street.',
    'Offering medical help near hospital.',
    'Flooding reported at Central Park.',
    'Power outage in downtown.',
    'Food supplies available at community center.',
    'Help needed for evacuation at Elm St.',
  ];
  return samples[Math.floor(Math.random()*samples.length)];
}

function getRandomType() {
  return ['need','offer','alert'][Math.floor(Math.random()*3)];
}
