// The first thing we need to do is to get a server up and running.
// Usually, we just right-click etc. to open our HTML files (which have the JavaScript in the same files).
// Because of security restrictions with getting a user's webcam,
// it must be tied to what's called a "secure origin".
// A SECURE ORIGIN is a website that is HTTPS, or in our case, LOCALHOST, which is also a SECURE ORIGIN.
// Even if it's not (you can check the URL if it has a padlock or not), it's still considered a SECURE ORIGIN, which is LOCALHOST.

// So, what you need to do:
// So we have our 'index.html' file, and this needs to be fed through some sort of server; any sort of local server running will work,
// just make sure that you feed this 'index.html' through your LOCALHOST server.
// If you don't have any sort of server locally, there is a 'package.json' file included here in this project.
// And inside, there is a dependency called "browser-sync", which is nice, because it allows you to open up your website and start a little server,
// and it also gives you a live reloading and a bunch of other things.

// NPM INSTALL
// So we'll need to do: 'npm install'.
// When that's all done, in the terminal run 'npm start'.
// And that's going to run the "start" script in 'package.json'
// So now we can run 'npm start', which will open a little server.

// Bring in our selectors:
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
// 'ctx' is where the work happens:
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
// 'snap' is for the camera click audio sound:
const snap = document.querySelector('.snap');

// Get the video being piped in to the <video> element.
// The way to get someone's video is to use 'navigator.mediaDevices.getUserMedia()'
// (it used to be 'navigator.getUserMedia()'), but has changed to 'navigator.mediaDevices.getUserMedia()' in some of the newer browsers.
// And then we pass in 'video', which we want to be 'true', and 'audio: false'.

// And this is going to return a PROMISE,a nd so with a PROMISE, we call '.then' on it.
// And it's going to give us something called a 'localMediaStream', and from there, we'll run a function.
// If you get something in the browser that says something like, local host would like to access your camera, say YES.
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);

      // Set the source of our video to 'localMediaStream' -> video.src = localMediaStream;
      // And this is not going to work automatically because this is an object,
      // and in order for our video to work, it needs to be converted into some sort of URL.
      // This is how you set it to be a live video feed.
      // So we're going to wrap this 'localMediaStream' in 'window.URL.createObjectURL'.
      // And that's going to convert that media stream into something that the video player ('video') can understand.

      // This code from tutorial does not work:
      // video.src = window.URL.createObjectURL(localMediaStream);
      // Use this instead - it works, and you should now see yourself in the <video> element in the browser
      // (found this solution in comment section here: https://www.youtube.com/watch?v=ElWFcBlVk-o
      // scroll down to roob's comment and find this in the first reply).
      // The reason this new code works is because 'src' is being deprecated from new browsers - 'srcObject' is the new version:
      video.srcObject = localMediaStream; // You should now see yourself in the browser in video.

      // Play the video:
      video.play();
    })
    // Add a 'catch' in case someone does not allow you to access their webcam - you need to handle that error.
    .catch((err) => {
      console.error(`Oh, no!!!`, err);
    });
}

// Take a frame from this video and 'paint' it on the actual canvas on the screen
function paintToCanvas() {
  // Width and height of the video.
  const width = video.videoWidth;
  const height = video.videoHeight;
  // The video is going to have a width and height associated with it.
  // If we type 'paintToCanvas()' in the console, we'' get our width and height -> 640 480 (this is the size of the video
  // that is coming in from the webcam).

  //   console.log(width, height);

  // Now, we need to make sure that the canvas is the exact same size before we paint to it (640 480).
  // And this is really important because if the canvas is NOT the same size as the video, or if the dimensions are not the same,
  // we'll need to change that.
  canvas.width = width;
  canvas.height = height;

  // Every 16 or so milliseconds (you can play around with the number),
  // take an image from the webcam and put it into the canvas.
  // Add a 'return' to 'setInterval', because if you ever want to stop this from 'painting',
  // you can have access to that interval and call 'clearInterval' on it.
  return setInterval(() => {
    // Take the canvas context ('ctx') and call 'drawImage'.
    // And you simply just pass in your 'video' element.
    // So the way that 'drwaImage' works, is that you pass it an image, or a video element,
    // and it will paint it right to it.
    // We're going to start at 0, 0 (start at the top left corner of the canvas,
    // and then paint the 'width' and the 'height' - which is why we used put the width and height in these variables).
    // And this should now make the video as large as your screen (in the console, type 'setInterval()' or 'paintToCanvas()'),
    // and every 16ms, we are taking a frame from it.
    ctx.drawImage(video, 0, 0, width, height);

    // Add filters to our photos.
    // The way a filter works is you get the pixels out of the canvas, and you manipulate it by changing the RGB values,
    // and then put them back in.

    // Take the pixels out:
    let pixels = ctx.getImageData(0, 0, width, height);

    // Logging this (console.log(pixels)), we get a special kind of array that's meant for very large numbers (about a million or so items).
    // This array is just a huge array of numbers (they each represent pixels of red, green, blue, alpha, red, green, blue, alpha,...).
    // So for every one pixel of our picture, we have 4 entries in our array that describe the red, green, blue, and alpha.
    // console.log(pixels); // This might crash the browser since it's millions of pixels
    // debugger;

    // So what we can do is take these pixels and do the effects:
    // Manipulate the pixels:
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);

    // Global Alpha (ghosting effect)
    // Write what we have, but the ones that are underneath are still going to show through for 10 more frames.
    // This is because we're putting a transparency of 10% of the current image on top,
    // and we're just stacking and stacking and stacking.
    // So as it goes, it sort of follows you around in the video image.
    // And you can also play with this number.
    // ctx.globalAlpha = 0.1;

    pixels = greenScreen(pixels);

    // Put the pixels back:
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

// Take a photo function.
function takePhoto() {
  // Audio part (camera click sound ('snap')).
  // To test it, type 'takePhoto()' in the console, and you should now hear the audio.
  snap.currentTime = 0;
  snap.play();

  // Take photo of the actual canvas.
  // Take the data out of the canvas.
  const data = canvas.toDataURL('image/jpeg');
  // Now when we 'console.log(data)' and type 'takePhoto()' in the console, we get a very looong list of characters.
  // This is something called Base64. And this is a text-based representation of the picture that is taken.
  // And these are just like little attributes about the photo in text-base form.
  //   console.log(data);

  // So now what we can do with thie Base64 is we can create a link and an image to actually put it in our 'strip' (the class name of our <div>).
  // Create a link (create an anchor link).

  const link = document.createElement('a');
  // Make that link equal to the 'data' (see above):
  link.href = data;

  // Set the attribute of the link to 'download' and then set that to 'handsome'.
  link.setAttribute('download', 'handsome');

  // Make the image visible.
  // Instead of 'textContent', do -> link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  // So both the 'href' and the source os going to be equal to the data.
  // So now when we take a photo, we should see a photo down in the bottom right corner instead of the text 'Download Image'.
  // And then you can click on this photo to download it to your computer.
  // And the image will be downloaded with the name 'handsome' (or whatever you set it to be).
  // And so every time you take a picture, you will get as many photos as you take down a the bottom.
  //   link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;

  // Take our 'strip' (where we're going to dump our link), and do 'insertBefore',
  // then enter the link node, and it's going to happen right before 'strip.firstChild'.
  strip.insertBefore(link, strip.firstChild);

  // So now, when you click the Take Photo button to take a photo,
  // we get a link in the console (very long list of characters).
  // And if you copy this link (or click the Copy button in the console)
  // and paste the link in a new window, you should now see the photo you took.
  // So this URL is just a data image, but it's smart enough to know that that is the actual image.
  // It's not anywhere on our computer. It's just stored in this really long text string.

  // But we also created this 'download' attribute of 'handsome' (see above).
  // So once we take a photo, we will see a 'Download Image' (or whatever we set the 'textContent' to above) down in the bottom left corner,
  // and when we click on this link, it's going to download the photo to the computer,
  // and the file is going to be called 'handsome' (or whatever you choose it to be).
}

// Create function for red filter effect
function redEffect(pixels) {
  // Loop over every single pixel.
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Manipulate the RGB values of the pixels for a cool effect (+ 100, - 50, * 0.5 are just random and can be changed).
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // red channel
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green channel
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue channel
  }
  return pixels;
}

// RGB Split Effect
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // Manipulate the RGB values of the pixels for a cool effect (+ 100, - 50, * 0.5 are just random and can be changed).
    pixels.data[i - 150] = pixels.data[i + 0]; // red channel
    pixels.data[i + 500] = pixels.data[i + 1]; // green channel
    pixels.data[i - 550] = pixels.data[i + 2]; // blue channel
  }
  return pixels;
}

// Green Screen Effect
function greenScreen(pixels) {
  // Hold our minimum and maximum green
  const levels = {};

  // Grab every single RGB input (all 6 of the sliders in the browser),
  // and set the minimum and maximum for red, green, and blue
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  //   console.log(levels);

  // Loop over every single pixel; figure out what the red, green, blue, and alpha are.
  // And if the red, green, blue are anywhere in between those min and max values,
  // then we take it out.
  // And that's because the 4th pixel is the alpha, which is the transparency pixel.
  // And if you set that to 0, then it's going to be totally transparent.
  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

// Listen for an event on the video element called 'canplay' (this is an event that the video will emit).
// And when this happens, we are going to run the function 'paintToCanvas'.
// So once the video is played ('video.play()' above), it's going to emit an event called 'canplay',
// which in turn, <canvas> is going to say, "Oh, now we should start to paint to canvas."
// So that's going to happen now on our page load.
video.addEventListener('canplay', paintToCanvas);
