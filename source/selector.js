var marker_selecting;

function stop() {
  if (!marker_selecting) return;
  if (moveListener) window.removeEventListener(moveListener);
  if (clickListener) window.removeEventListener(clickListener);
  if (keyListener) window.removeEventListener(keyListener);
  selector.remove();
  moveListener = clickListener = keyListener = selectedTarget = null;
  marker_selecting = false;
}

function copySize(source, target, left = 0, top = 0, width = 0, height = 0) {
  var rect = source.getBoundingClientRect();
  var bodyRect = document.body.getBoundingClientRect();
  target.style.left = rect.left - bodyRect.left + left + 'px';
  target.style.top = rect.top - bodyRect.top + top + 'px';
  target.style.width = rect.width + width + 'px';
  target.style.height = rect.height + height + 'px';
}

function selected(target) {
  marker = document.createElement('div');
  marker.className = 'html_marker';
  label = document.createElement('input');
  label.type = 'text';
  label.className = 'html_marker_label';
  marker.appendChild(label);
  document.body.appendChild(marker);
  copySize(target, marker, -2, -2, 4, 19);
}

function highlight(target) {
  if (!target) return;
  selectedTarget = target;
  copySize(target, selector, -2, -2, 4, 4);
}

if (!marker_selecting) {
  marker_selecting = true;

  var selectedTarget;
  var selector = document.getElementById('marker_selector');
  if (!selector) {
    selector = document.createElement('div');
    selector.id = 'marker_selector';
    document.body.appendChild(selector);
  }

  var moveListener = window.addEventListener('mousemove', function (event) {
    if (!marker_selecting) return;
    var target = event.target;
    if (event.target.id === 'marker_selector'
      || event.target.tagName === 'BODY'
      || event.target.tagName === 'HTML'
      || event.target.className === 'html_marker') {
      return;
    }
    highlight(target);
  });

  var clickListener = window.addEventListener('click', function (event) {
    if (!marker_selecting) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    selected(selectedTarget);
    stop();
  }, true);

  var keyListener = window.addEventListener('keydown', function (event) {
    if (!marker_selecting) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    var target = selectedTarget;
    switch (event.key) {
      case "w": // Go Parent
      case "W":
      case "ArrowUp":
        highlight(target.parentElement);
        break;
      case "s": // Go FirstChild
      case "S":
      case "ArrowDown":
        highlight(target.firstElementChild);
        break;
      case "a": // Go PrevouseElement
      case "A":
      case "ArrowLeft":
        highlight(target.previousElementSibling);
        break;
      case "d": // Go NextElement
      case "D":
      case "ArrowRight":
        highlight(target.nextElementSibling);
        break;
      case " ": // Mark!
      case "Enter":
        selected(target);
        stop();
        break;
      case "Backspace": // Remove (Incompleted)
      case "Delete":
        console.log(event.target);
        if (event.target.className === 'html_marker') {
          event.target.remove();
        }
        break;
      case "Home": // Clear
        var markers = document.getElementsByClassName('html_marker');
        for (marker of markers) marker.remove();
        break;
      case "Escape": // Stop
      case "End":
        stop();
        break;
    }
  }, true);
}
