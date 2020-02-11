// Helper : Scroll To

function scrollTo(element) {
  var documentBody =
    document.documentElement.scrollTop || document.body.scrollTop;
  var elm = document.body;
  var from = 0;
  var to = element.getBoundingClientRect();
  var toPosition = documentBody == 0 ? to.top - from : to.top;
  var currentPosition = window.pageYOffset;
  var frames = 60;
  var jump = (toPosition - from) / frames;
  var firstElement = element.querySelectorAll('a, button');
  from = currentPosition;

  function scroll() {
    if (frames > 0) {
      const position = from + jump;

      from = position;
      elm.scrollTop = from;
      document.documentElement.scrollTop = from;

      frames--;
      window.requestAnimationFrame(scroll);
    } else {
      if (firstElement.length > 0) firstElement[0].focus();
    }
  }

  window.requestAnimationFrame(scroll);
}

// Helper : Fetch

function fetchAPI(json) {
  return new Promise(function (resolve, reject) {
    fetch('/api', {
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then(function (response) {
      resolve(response.json());
    });
  });
}

// Helper : Show Modal

function showModal() {
  var body = document.querySelector('body');
  var modal = document.querySelector('modal');
  var button = modal.querySelector('button');

  body.style.overflow = 'hidden';
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  button.focus();
}

// Helper : Close Modal

function closeModal() {
  var body = document.querySelector('body');
  var modal = document.querySelector('modal');
  var button = document.querySelector('[data-component="contact"]');

  body.style.overflow = 'visible';
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(function () {
    button.focus();
  }, 200);
}

// Helper : Check for a Character

function characterCheck(value) {
  return value.length > 0;
}

// Helper : Check for @ symbol

function emailCheck(value) {
  return /@/.test(value);
}

// Helper Strip Tags : Santize Input

function stripHTML(text) {
  var regex = /(<([^>]+)>)/gi;
  return text.replace(regex, '');
}

function showRequried(input) {
  var parent = input.parentNode;
  var requried = parent.querySelector('required');
  if (input.value.length == 0) {
    requried.style.maxHeight = '30px';
    return true;
  } else {
    requried.style.maxHeight = '0';
    return false;
  }
}

function showErrors(input) {
  var parent = input.parentNode;
  var requried = parent.querySelector('error');
  requried.style.maxHeight = '30px';
}

function hideErrors(input) {
  var parent = input.parentNode;
  var requried = parent.querySelector('error');
  requried.style.maxHeight = '0';
}

// Helper : Input Blur Event

function inputBlurEvent(input) {
  var parent = input.parentNode;
  var isRequired = parent.getAttribute('data-required');
  var value = stripHTML(input.value);

  if (isRequired) {
    const check = parent.getAttribute('data-check');
    const requiredShowing = showRequried(input);
    let valid = null;

    valid = window[check](value);
    if (!requiredShowing && !valid) showErrors(input);
    if (valid) {
      parent.setAttribute('isValid', '');
      hideErrors(input);
    } else {
      parent.setAttribute('notValid', '');
    }
  } else {
    parent.setAttribute('isValid', '');
  }

  input.value = value;
}

// Helper : Input Focus Event

function inputFocusEvent(input) {
  var parent = input.parentNode;
  var required = parent.querySelector('requried');
  var error = parent.querySelector('error');

  parent.removeAttribute('isValid');
  parent.removeAttribute('notValid');
  if (required) required.style.maxHeight = '0;';
  if (error) error.style.maxHeight = '0;';
}

// Helper : Add Validation to Form Fields

function addFormFieldValidation(form) {
  var fields = form.querySelectorAll('.input-field');

  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    field.addEventListener('blur', function () {
      inputBlurEvent(this);
    });
    field.addEventListener('focus', function () {
      inputFocusEvent(this);
    });
  }
}

// Helper : Clear field Values

function clearFields(form) {
  var fields = form.querySelectorAll('.input-field');

  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    field.value = '';
    inputFocusEvent(field);
  }
}

// Helper : Check Fields for Validation

function checkFields(form) {
  var fields = form.querySelectorAll('.input-field');
  var isValid = true;
  var data = {};

  for (var i = 0; i < fields.length; i++) {
    var input = fields[i];
    var value = stripHTML(input.value);
    var parent = input.parentNode;
    var name = input.getAttribute('name');
    data[name] = value;

    if (parent.getAttribute('notValid')) {
      isValid = false;
    }

    if (parent.getAttribute('data-required')) {
      const check = parent.getAttribute('data-check');
      isValid = window[check](value);
      if (!isValid) parent.setAttribute('notValid', '');
    }
  }

  return isValid ? data : false;
}

// Validate Form

function validateForm() {
  var form = document.querySelector('form#contact-form');

  addFormFieldValidation(form);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const json = checkFields(form);

    if (json != false) {
      fetchAPI(JSON.stringify(json)).then(function (response) {
        if (response.success) {
          closeModal();
          clearFields(form);
        } else {
          console.log(response);
        }
      });
    }
  });
}

// Contact

function contact() {
  var contactButton = document.querySelector('[data-component="contact"]');
  var modal = document.querySelector('modal');
  var form = document.querySelector('form');
  var submit = form.querySelector('input[type="submit"]');
  var closeButton = modal.querySelector('.close');

  // Check Key Up for Modal

  function keyupListen(parm) {
    var key = parm.key || parm.keyCode;
    if (key === 'Escape' || key === 'Esc' || key === 27) {
      closeModal();
      document.removeEventListener('keyup', keyupListen);
      document.removeEventListener('keydown', enterClick);
    }
  }

  // Check Enter when Modal is Showing

  function enterClick(parm) {
    var key = parm.key || parm.keyCode;
    if (key === 'Enter' || key === 13) {
      var attr = parm.target.getAttribute('data-attr');
      if (attr != 'action') {
        parm.preventDefault();
      }
    }
  }

  contactButton.addEventListener('click', function (event) {
    showModal();
    document.addEventListener('keyup', keyupListen);
    document.addEventListener('keydown', enterClick);
  });

  function closeEvent() {
    event.preventDefault();
    closeModal();
    document.removeEventListener('keyup', keyupListen);
    document.removeEventListener('keydown', enterClick);
  }

  closeButton.addEventListener('click', function (event) {
    closeEvent();
  });
  form.addEventListener('click', function (event) {
    event.stopPropagation();
  });
  modal.addEventListener('click', function (event) {
    closeEvent();
  });
  form.addEventListener('submit', function (event) {
    document.removeEventListener('keydown', enterClick);
  });
  submit.addEventListener('blur', function (event) {
    if (!form.contains(event.relatedTarget)) {
      closeEvent();
    }
  });
}

// Scroll To Events

function scrollEvents() {
  var buttons = document.querySelectorAll('[data-component="scroll"]');

  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];

    button.addEventListener('click', function () {
      var id = this.getAttribute('data-id');
      var element = document.querySelector('#' + id);
      scrollTo(element);
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // contact();
  // validateForm();
  scrollEvents();
});
