let move_speed = 3.5;
let gravity = 0.25;
let base_speed = 2.5;
let base_gravity = 0.25;

let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let countdownEl = document.getElementById('countdown');
let startMessage = document.getElementById('startMessage');
let gameOverMessage = document.getElementById('gameOverMessage');

let game_state = 'Start';

let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let background = document.querySelector('.background').getBoundingClientRect();
let bird_props = bird.getBoundingClientRect();
img.style.display = 'none';

document.getElementById('startBtn').addEventListener('click', () => {
  startCountdown(3);
});

function startCountdown(timeLeft) {
  startMessage.style.display = 'none';
  countdownEl.style.display = 'block';
  countdownEl.innerText = timeLeft;

  let countdownInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft === 0) {
      clearInterval(countdownInterval);
      countdownEl.style.display = 'none';
      startGame();
    } else {
      countdownEl.innerText = timeLeft;
    }
  }, 1000);
}

function updateDifficulty(score) {
  move_speed = Math.min(4, base_speed + score * 0.1);
  gravity = Math.min(0.6, base_gravity + score * 0.02);
}

function showGameOver() {
  game_state = 'End';
  img.style.display = 'none';
  sound_die.play();

  gameOverMessage.innerHTML = `
    <div>
      <div style="font-size: 2em; color: red; margin-bottom: 20px;">Game Over</div>
      <button id="restartBtn">Restart</button>
    </div>
  `;
  gameOverMessage.classList.add('messageStyle');
  gameOverMessage.style.display = 'block';

  document.getElementById('restartBtn').addEventListener('click', () => location.reload());
}

function startGame() {
  document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
  img.style.display = 'block';
  bird.style.top = '40vh';
  game_state = 'Play';
  score_title.innerHTML = 'Score : ';
  score_val.innerHTML = '0';
  gameOverMessage.style.display = 'none';
  play();
}

function play() {
  function move() {
    if (game_state != 'Play') return;

    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          showGameOver();
          return;
        } else {
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + move_speed >= bird_props.left &&
            element.increase_score == '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            updateDifficulty(parseInt(score_val.innerHTML));
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - move_speed + 'px';
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != 'Play') return;

    bird_dy += gravity;

    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        img.src = 'images/Bird-2.png';
        bird_dy = -5;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        img.src = 'images/Bird.png';
      }
    });

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      showGameOver();
      return;
    }

    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_separation = 40;
  let pipe_gap = 40;

  function create_pipe() {
    if (game_state != 'Play') return;

    if (pipe_separation > 115) {
      pipe_separation = -30;
      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
      document.body.appendChild(pipe_sprite_inv);

      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
      document.body.appendChild(pipe_sprite);
    }

    pipe_separation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}

// Optional Enter restart
document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && game_state == 'End') {
    location.reload();
  }
});
