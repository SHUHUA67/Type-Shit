// DOM: class 06. Loops and random values: class 08 demo.
// setInterval and Date: class 08 notes.
let bubbles = [];
let positions = [3, 70, 18, 85, 5, 80];
let speeds = [0.09, 0.13, 0.07];
let poppedAt = [0, 0, 0];

window.onload = () => {
  let screen = document.getElementById("screen");

  for (let i = 0; i < 6; i++) {
    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.style.left = positions[i] + "%";
    // Each pair shares a row so the two circles can meet.
    bubble.style.top = 8 + Math.floor(i / 2) * 28 + "%";

    let shine = document.createElement("div");
    shine.classList.add("shine");
    bubble.appendChild(shine);
    screen.appendChild(bubble);
    bubbles[i] = bubble;
  }

  setInterval(moveBubbles, 50);
};

function moveBubbles() {
  let now = new Date();
  let time = now.getTime();

  for (let pair = 0; pair < 3; pair++) {
    let left = pair * 2;
    let right = left + 1;

    if (poppedAt[pair] == 0) {
      positions[left] = positions[left] + speeds[pair];
      positions[right] = positions[right] - speeds[pair];
      bubbles[left].style.left = positions[left] + "%";
      bubbles[right].style.left = positions[right] + "%";

      // A bubble is 12% of the screen width.
      if (positions[left] + 12 >= positions[right]) {
        bubbles[left].style.backgroundColor = "transparent";
        bubbles[right].style.backgroundColor = "transparent";
        bubbles[left].style.borderStyle = "dotted";
        bubbles[right].style.borderStyle = "dotted";
        bubbles[left].querySelector(".shine").style.display = "none";
        bubbles[right].querySelector(".shine").style.display = "none";
        poppedAt[pair] = time;
      }
    } else {
      // Date measures how long this pair has been popped.
      let elapsed = time - poppedAt[pair];

      if (elapsed > 250) {
        bubbles[left].style.display = "none";
        bubbles[right].style.display = "none";
      }

      if (elapsed > 1200) {
        positions[left] = Math.floor(Math.random() * 18);
        positions[right] = 70 + Math.floor(Math.random() * 16);
        let row = 5 + pair * 28 + Math.floor(Math.random() * 8);

        for (let i = left; i <= right; i++) {
          bubbles[i].style.left = positions[i] + "%";
          bubbles[i].style.top = row + "%";
          bubbles[i].style.borderStyle = "solid";
          bubbles[i].style.backgroundColor = "rgba(255, 255, 255, 0.45)";
          bubbles[i].querySelector(".shine").style.display = "block";
          bubbles[i].style.display = "block";
        }

        poppedAt[pair] = 0;
      }
    }
  }
}
