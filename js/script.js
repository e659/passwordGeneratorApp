const passwordDisplay = document.querySelector(".password-display"),
  passwordPlaceholder = document.querySelector(".password-placeholder"),
  passwordCopyButton = document.querySelector(".copy-btn"),
  passwordCopiedNotification = document.querySelector(".copied-text"),
  passwordForm = document.querySelector(".password-settings"),
  lengthSlider = document.querySelector(".char-length-slider"),
  charCount = document.querySelector(".char-count"),
  checkBoxes = document.querySelectorAll("input[type=checkbox]"),
  strengthDescription = document.querySelector(".strength-rating-text"),
  strengthRatingBars = document.querySelectorAll(".bar"),
  generateBtn = document.querySelector(".generate-btn"),
  validationBox = document.querySelector(".validation");
// passwordSet
const charcterSet = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
  lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
  numbers: ["1234567890", 10],
  symbols: ["!@#$%^&*()", 10],
};
// console.log(charcterSet);
let canCopy = false;

// getSliderValue
const getSliderValue = () => {
  charCount.textContent = lengthSlider.value;
};

const styleRangeSlider = () => {
  const value = lengthSlider.value;
  const min = lengthSlider.min;
  const max = lengthSlider.max;
  lengthSlider.style.backgroundSize =
    ((value - min) * 100) / (max - min) + "% 100%";
};
const handleSliderInput = () => {
  getSliderValue();
  styleRangeSlider();
};

//STRENGTHStyle

// Remove colors applied to the strength meter
const resetBarStyles = () => {
  strengthRatingBars.forEach((bar) => {
    bar.style.backgroundColor = "transparent";
    bar.style.borderColor = "hsl(252, 11%, 91%)";
  });
};

// Fill in specified meter bars with the provided color
const styleBars = ([...barElements], color) => {
  barElements.forEach((bar) => {
    bar.style.backgroundColor = color;
    bar.style.borderColor = color;
  });
};

// Display text description of password strength and
// fill in the appropriate meter bars
const styleMeter = (rating) => {
  const text = rating[0];
  const numBars = rating[1];
  const barsToFill = Array.from(strengthRatingBars).slice(0, numBars);

  resetBarStyles();

  strengthDescription.textContent = text;

  switch (numBars) {
    case 1:
      return styleBars(barsToFill, "hsl(0, 91%, 63%)");
    case 2:
      return styleBars(barsToFill, "hsl(13, 95%, 66%)");
    case 3:
      return styleBars(barsToFill, "hsl(42, 91%, 68%)");
    case 4:
      return styleBars(barsToFill, "hsl(127, 100%, 82%");
    default:
      throw new Error("Invalid value for numBars");
  }
};
const calcStrength = (passwordLength, charPoolSize) => {
  const strength = passwordLength * Math.log2(charPoolSize);

  if (strength < 25) {
    return ["Too Weak!", 1];
  } else if (strength >= 25 && strength < 50) {
    return ["Weak", 2];
  } else if (strength >= 50 && strength < 75) {
    return ["Medium", 3];
  } else {
    return ["Strong", 4];
  }
};

// generatePassword
const generatePassword = (e) => {
  e.preventDefault();
  try {
    validateInput();

    let generatedPassword = "";
    let includedSets = [];
    let charPool = 0;

    checkBoxes.forEach((box) => {
      if (box.checked) {
        includedSets.push(charcterSet[box.value][0]);
        charPool += charcterSet[box.value][1];
      }
    });

    if (includedSets) {
      for (let i = 0; i < lengthSlider.value; i++) {
        const randSetIndex = Math.floor(Math.random() * includedSets.length);
        const randSet = includedSets[randSetIndex];

        const randCharIndex = Math.floor(Math.random() * randSet.length);
        const randChar = randSet[randCharIndex];

        generatedPassword += randChar;
      }
    }

    const strength = calcStrength(lengthSlider.value, charPool);
    styleMeter(strength);

    passwordDisplay.textContent = generatedPassword;
    canCopy = true;
  } catch (err) {
    console.log(err);
  }
};
// ////////
// inputsValidation
const validateInput = () => {
  // At least one box is checked
  if (Array.from(checkBoxes).every((box) => box.checked === false)) {
    validationBox.classList.add("d-block");
    validationBox.classList.remove("d-none");
  } else {
    validationBox.classList.add("d-none");
    validationBox.classList.remove("d-block");
  }
};

// copyPassWord
const copyPassword = async () => {
  if (!passwordDisplay.textContent || passwordCopiedNotification.textContent)
    return;
  if (!canCopy) return;

  await navigator.clipboard.writeText(passwordDisplay.textContent);
  passwordCopiedNotification.textContent = "Copied";

  // Fade out text after 1 second
  setTimeout(() => {
    passwordCopiedNotification.style.transition = "all 1s";
    passwordCopiedNotification.style.opacity = 0;

    // Remove styles and text after fade out
    setTimeout(() => {
      passwordCopiedNotification.style.removeProperty("opacity");
      passwordCopiedNotification.style.removeProperty("transition");
      passwordCopiedNotification.textContent = "";
    }, 1000);
  }, 1000);
};
// Initialize number of characters on page load specified
// by the range input
charCount.textContent = lengthSlider.value;
passwordCopyButton.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", handleSliderInput);
passwordForm.addEventListener("submit", generatePassword);
