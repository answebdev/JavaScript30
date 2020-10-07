// As you know, styling a default HTML5 Video Player is not really possible.
// We're going to build a custom interface here, where we're going to hide the controls.

// This is going to be in 3 pieces:
// 1. Get our elements
// 2. Build the functions
// 3. Hook up the event listeners

// GET THE ELEMENTS
// First, get the player:
const player = document.querySelector('.player');

// And inside of this player (the main 'father' div), we're going to grab everything else.
// Note we do 'player.querySelector' and not 'document.querySelector' when getting the video.
const video = player.querySelector('.viewer');

const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// BUILD THE FUNCTIONS
function togglePlay() {
  //   const method = video.paused ? 'play' : 'pause';
  //   video[method]();
  // 'paused' is a property that lives on the video.
  // There is no 'playing' property - there is only a 'pause' property.
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// Listen to the video for whenever it is paused.
// Whatever causes it to pause, then we can update the play button.
function updateButton() {
  // We can use 'this' here, because it's BOUND to the video itself.
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
  console.log('Update the button.');
}

// Skip buttons
function skip() {
  // Define how much the video skips.
  // In the HTML the button has data-skip="-10", which means it will go back 10 seconds.
  // And the other button has data-skip="25", which means it's going to go forwards 25 seconds.
  // This HTML approach is a good approach, because that means we can put a 'data-skip' on anything,
  // e.g. if I put of picture of myself, and when you click on my picture it skips 25 seconds, etc.
  console.log(this.dataset.skip);

  // Use 'parseFloat', since it's a string. That way, it will convert to a number.
  // Make skip buttons actually skip.
  video.currentTime += parseFloat(this.dataset.skip);
}

// Logic for sliders.
function handleRangeUpdate() {
  video[this.name] = this.value;
  //   console.log(this.name);
  //   console.log(this.value);
}

// Progress Bar.
// Update progress bar in real time.
// Update video to correspond when clicked and dragged.
function handleProgress() {
  // Make a percentage.
  // This '.progress__filled' has a 'flex-basis' value that's percentage (we can see when we inspect it).
  // We're just going to be updating this 'flex-basis' value of the progress bar.
  // And it's going to corresponid with how long it is: 0% means not started at all. 100% means totally finished.
  // We just need to calculate that, knowing how long the video is, and how far in the video we are right now.
  // Note: 'currentTime' and 'duration' are just properties on that video.
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// Scrub the Video
// Wherever we click on the video bar, it will take us to that part of the video.
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;

  // Update the video:
  video.currentTime = scrubTime;
  console.log(e);
}

// HOOK UP THE EVENT LISTENERS
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// Listen for the video to emit an event called 'timeupdate', and when that happens, we will run 'handleProgress'.
video.addEventListener('timeupdate', handleProgress);

// Hook up play button
toggle.addEventListener('click', togglePlay);

// Skip buttons
// Listen for a click on anything that has a 'data-skip' attribute.
skipButtons.forEach((button) => button.addEventListener('click', skip));

ranges.forEach((range) => range.addEventListener('change', handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener('mousemove', handleRangeUpdate)
);
progress.addEventListener('click', scrub);

// Drag functionality.
// As is, it's a bit jerky, which is no good. We want to be clicking down.
// As in the canvas project, we create a flag variable adn set it to 'false'.
// And then, when you click, we set it to 'true'.
let mousedown = 'false';
progress.addEventListener('click', scrub);

// When someone moves the mouse, run a function that says
// if mousedown, then scrub.
// What this does, is it first checks this 'mousedown' variable, and if this variable is 'true',
// it moves on th '&& scrub(e)'.
// If the variable is 'false', it's just going to return 'false', and it's not going to do anything.
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));

// When someone mouses down, set the flag variable to 'true'.
progress.addEventListener('mousedown', () => (mousedown = true));

// When someone mouses up, set the flag variable to 'false'.
progress.addEventListener('mouseup', () => (mousedown = false));
