let countDown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

// Select ANYTHING with the 'data-time' attribute
const buttons = document.querySelectorAll('[data-time]');

// Timer function.
// Pass through the number of seconds you wish for the timer to be in.
// Using 'setTimer' here is not ideal - although it works, you may run into issues in that it may stop running at times (though we'll be
// using 'setInterval' below for something else - see below in function).
// Instead: We need to figure out when the timer started -> 'const now =Date.now()' (this gives us the current time stamp), etc.
function timer(seconds) {
  // Clear any existing timers - so if there is a timer in 'countDown', it will clear it. If not, the 'countDown' variable will still exist.
  clearInterval(countDown);
  const now = Date.now();

  // Multiply by 1000 because 'now' is going to be in milliseconds, while 'seconds' is in seconds.
  const then = now + seconds * 1000;
  //   console.log(now, then);

  displayTimeLeft(seconds);
  displayEndTime(then);

  // Every single second, we need to display the amount of time left.
  // HERE is we we set an interval. It's okay to use an interval here (as opposed to above - see notes above), because
  // we're really not worried about it running every single second.
  countDown = setInterval(() => {
    // Time left on the clock.
    // Divide by 1000, since it's in milliseconds.
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    // Check if we should stop it (numbers will keep going into the negatives unless we stop it).
    // And we want to stop it when seconds left is equal to 0.
    // So what we need to do is to store our interval (i.e. 'setInterval') in its own variable, 'countDown' (see above). It's going to be a global variable,
    // so it can live on the window, but we can pop that into an IIFE and not have it in the global name space.
    // And then here in our 'setInterval', we're going to simply update that variable -> countDown = setInterval (see above).
    // Then we'll call 'clearInterval' down below here, and pass in the name of our timer: 'countDown'.
    // And now when we run it, the timer will stop without continuing into the negative numbers.
    if (secondsLeft < 0) {
      clearInterval(countDown);
      return;
    }

    // Display it.
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// Another problem is that 'setInterval' does NOT run immediately - it runs but after one second has elapsed.
// It has to wait for the first second to elapse.
// So we'll create another function called 'displayTimeLeft'.
// And then we're going to run this immediately ONCE, up above,
// and then once again every single time we do that interval - see above under 'Display it' comment.
// And now we won't have to wait for that one second to have elapsed first.
function displayTimeLeft(seconds) {
  // Convert time into minutes and seconds.
  const minutes = Math.floor(seconds / 60);
  //   console.log({ minutes });

  const remainderSeconds = seconds % 60;
  //   console.log({ minutes, remainderSeconds });

  // Do a terniary so that if the seconds is less than 10, to put in a 0.
  // That way instead of '2:4', it should display '2:04'.
  const display = `${minutes}:${
    remainderSeconds < 10 ? '0' : ''
  }${remainderSeconds}`;

  // Update tab on the browser (where favicon normally goes). Now it just says 'Countdown Timer'.
  // Note that it's in the <title> tag, so 'document.title', etc.
  // So now when we run it, it will display the timer counting down.
  document.title = display;

  timerDisplay.textContent = display;

  //   console.log(seconds);
}

// Show the ending time.
// This will take in a timestamp of when you want to finish.
function displayEndTime(timestamp) {
  // Convert time stamp into a date.
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();

  // This will display military time (15:00 instead of 3:00), so we add a ternary here at the end to fix this,
  // then put it in a variable to use.
  // And then again, we add this to add the padded 0 if the minutes is less than 10 -> minutes < 10 ? '0' : '' }${minutes}
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  endTime.textContent = `Be Back At ${adjustedHour}:${
    minutes < 10 ? '0' : ''
  }${minutes}`;
}

function startTimer() {
  //   console.log(this.dataset.time);

  // Use 'parseInt' to turn it into a number (without it, it will be a string).
  const seconds = parseInt(this.dataset.time);
  //   console.log(seconds);

  // Display selected timer.
  timer(seconds);
}

// Hook this up to all the different buttons (tabs) up top.
// In the HTML, each of the buttons has a 'data-time' and the number of seconds we wish to run on it.
// And then we have a form, which is a custom number of minutes, not seconds.
buttons.forEach((button) => button.addEventListener('click', startTimer));

// Enter the number of minutes you want displayed in the form (top right).
// This form has a 'name' of 'customForm'.
// Use 'submit' (not 'click') so that we can submit it when we click ENTER, otherwise it will not submit (after all, we dont' have a button here).
document.customForm.addEventListener('submit', function (e) {
  // To prevent the page from reloading and sending the data over a GET request (which we do NOT want):
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60);

  // Clear the input field.
  this.reset();
});
