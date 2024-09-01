'use strict';

function extractFormData(form) {
  const formData = Object.fromEntries(new FormData(form).entries());
  return formData;
}

function showErrorState(errorMessageElem, inputElem, message, state) {
  errorMessageElem.textContent = message;
  errorMessageElem.setAttribute('aria-hidden', 'false');
  inputElem.classList.add('invalid');
  state.setInvalid();
}

function hideErrorState(errorMessageElem, inputElem) {
  errorMessageElem.textContent = '';
  errorMessageElem.setAttribute('aria-hidden', 'true');
  inputElem.classList.remove('invalid');
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function handleFormValidation(elemOfRef) {
  const formElement = elemOfRef.closest('.js-form');
  const formData = extractFormData(formElement);
  const state = { isInvalid: false, setInvalid: function () { this.isInvalid = true; } };
  Object.seal(state);
  
  for (const data in formData) {
    const dataVal = formData[data];
    const inputElem = document.querySelector(`input[name="${data}"]`);
    const inputHeader = inputElem.previousElementSibling;
    const errorMessageElem = inputHeader.querySelector('.js-error-message');

    if (!inputElem || !inputHeader || !errorMessageElem) continue;

    if (!dataVal) {
      showErrorState(errorMessageElem, inputElem, 'This field is required', state);
    } else if (inputElem.type === 'email' && !validateEmail(dataVal)) {
      showErrorState(errorMessageElem, inputElem, 'Valid email required', state);
    } else {
      hideErrorState(errorMessageElem, inputElem);
    }
  }

  return { isValid: !state.isInvalid, data: formData };
}

function resetForm(elemOfRef) {
  const formElement = elemOfRef.closest('.js-form');
  const validInputTypes = { text: true, email: true };
  formElement.querySelectorAll('input').forEach(input => {
    if (validInputTypes[input.type]) {
      input.value = '';
      hideErrorState(input.previousElementSibling.querySelector('.js-error-message'), input);
    }
  });
}

function showSuccessState(elemOfRef, formData) {
  const formElement = elemOfRef.closest('.js-form');
  const wrapperElem = formElement.closest('.js-wrapper');
  const successElem = wrapperElem.querySelector('.js-success');

  // Set the visibility of each element
  successElem.classList.add('visible');
  formElement.classList.add('hidden');
  wrapperElem.classList.add('success');
  wrapperElem.querySelector('.js-decorative-images').classList.add('hidden');

  if (formData.email) {
    successElem.querySelector('.js-message-email').textContent = formData.email;
  }

  const dismissButton = successElem.querySelector('.js-dismiss-button');
  if (dismissButton) {
    dismissButton.focus();
  }
}

function hideSuccessState(elemOfRef) {
  const successElem = elemOfRef.closest('.js-success');
  const wrapperElem = successElem.closest('.js-wrapper');
  const formElement = wrapperElem.querySelector('.js-form');
  
  // Set the visibility of each element
  successElem.classList.remove('visible');
  formElement.classList.remove('hidden');
  wrapperElem.classList.remove('success');
  wrapperElem.querySelector('.js-decorative-images').classList.remove('hidden');

  successElem.querySelector('.js-message-email').textContent = '';
}

const submitButtonElem = document.querySelector('.js-submit-button');
submitButtonElem.addEventListener('click', function (e) {
  e.preventDefault();
  const validationResult = handleFormValidation(this);
  if (validationResult.isValid) {
    resetForm(this);
    showSuccessState(this, validationResult.data);
  }
});

const dismissButtonElem = document.querySelector('.js-dismiss-button');
dismissButtonElem.addEventListener('click', function () {
  hideSuccessState(this);
});